<?php

namespace App\Services\CheckBank;

use App\Models\MySQL\PaymentMethods;
use App\Services\CheckBank\VietCombank;
use Illuminate\Support\Carbon;

/**
 * Class CheckBankService
 * @package App\Services
 */
class CheckBankService
{
    public function getHistoryBankInfo($bank)
    {
        try {
            $bankCode = $bank->key;
            $accountNumber = $bank->details['account_number'];
            $user = $bank->details['account_name'];
            $password = $bank->details['password'];
            $fromDate = $bank->details['from_date'] ?? Carbon::now()->subDays(7)->format('d/m/Y');
            $toDate = $bank->details['to_date'] ?? Carbon::now()->format('d/m/Y');

            // Sử dụng method mapping thay vì switch case
            $methodName = $this->getBankMethodName($bankCode);
            if (!$methodName) {
                return [
                    'success' => false,
                    'message' => "Unsupported bank: {$bankCode}",
                    'data' => null
                ];
            }

            return $this->$methodName($user, $password, $accountNumber, $fromDate, $toDate);

        } catch (\Throwable $th) {
            \Log::error('Bank history error', [
                'bank' => $bank->key ?? 'unknown',
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Service error: ' . $th->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Get method name for bank code
     */
    private function getBankMethodName(string $bankCode): ?string
    {
        $bankMethods = [
            PaymentMethods::KEY["VCB"] => 'getHistoryVCB',
            PaymentMethods::KEY["MB"] => 'getHistoryMB',
        ];

        return $bankMethods[$bankCode] ?? null;
    }

    public function getHistoryVCB($user, $password, $accountNumber, $fromDate, $toDate)
    {
        try {
            $vcbService = new VietCombank($user, $password, $accountNumber);

            // Retry logic với cải thiện
            $maxRetries = 2;
            $retryCount = 0;

            while ($retryCount < $maxRetries) {
                $history = $vcbService->getHistories($fromDate, $toDate, $accountNumber);
                // Success case
                if ($history->code == '00') {
                    return [
                        'success' => true,
                        'data' => $history->transactions,
                        'message' => 'Success'
                    ];
                }

                // Session expired - try login and retry
                if ($history->code == '108') {
                    $loginResult = $vcbService->doLogin();
                    if (!$loginResult['success']) {
                        return [
                            'success' => false,
                            'data' => $history,
                            'message' => 'Login failed: ' . ($loginResult['message'] ?? 'Unknown error')
                        ];
                    }
                    $retryCount++;
                    continue;
                }

                // Other errors
                return [
                    'success' => false,
                    'data' => $history,
                    'message' => $history->des ?? 'Unknown error',
                    'code' => $history->code ?? '999'
                ];
            }
            return [
                'success' => false,
                'data' => null,
                'message' => 'Max retries exceeded'
            ];

        } catch (\Throwable $th) {
            \Log::error('VCB history error', [
                'user' => $user,
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return [
                'success' => false,
                'data' => null,
                'message' => 'VCB service error: ' . $th->getMessage()
            ];
        }
    }

    public function getHistoryMB($user, $password, $accountNumber, $fromDate, $toDate)
    {
        return [
            'success' => false,
            'data' => null,
            'message' => 'MB Bank integration not implemented yet'
        ];
    }

    public function bankClassification($bankCode, $payment)
    {
        $result = [];
        $format = 'd/m/Y H:i:s';
        switch ($bankCode) {
            case PaymentMethods::KEY['MB']:
            // $activeDateTime = Carbon::createFromFormat($format, $payment['transactionDate']);
            // $keyUnique = $payment['refNo'];
            // $description = $payment['description'];
            // $amountVND = $payment['creditAmount'];
            // // REGEX
            // $regexContentBank = '/MDF\d+(?:\s+\d+)?/';
            // preg_match($regexContentBank, $description, $output_array);
            // if (isset($output_array[0])) {
            //     $contentBank = trim($output_array ? $output_array[0] : null);
            //     $userId = Helpers::decodeContentBank($contentBank);
            // }
            // $result = [
            //     'bank' => $bankCode,
            //     'user_id' => $userId ?? null,
            //     'amount' => $amountVND,
            //     'date' => $activeDateTime->format($format),
            //     'description' => $description,
            //     'key_unique' => $keyUnique,
            //     'json' => $payment,
            // ];
            // break;
            case PaymentMethods::KEY['VCB']:
                $activeDateTime = $this->handleDateTime($payment['TransactionDate'], $payment['PCTime']);
                $keyUnique = $payment['Reference'];
                $description = $payment['Description'];
                $amountVND = $this->handleAmount($payment['Amount']);
                $parseDescription = $this->parseDescription($description);
                $result = [
                    'bank' => $bankCode,
                    'user_id' => $parseDescription['user_id'],
                    'customer_identifier' => $parseDescription['customer_identifier'],
                    'amount' => $amountVND,
                    'date' => $activeDateTime->format($format),
                    'description' => $description,
                    'key_unique' => $keyUnique,
                    'json' => $payment,
                ];
                break;
            default:
                break;
        }
        return $result;
    }

    //handle date VCB
    public function handleDateTime($dateInput, $timeInput)
    {
        try {
            $time = "00:00:00";
            if (strlen($timeInput) == 6) {
                // Format 140901 -> 14:09:01
                $time = substr($timeInput, 0, 2) . ':' . substr($timeInput, 2, 2) . ':' . substr($timeInput, 4, 2);
            } else if (strlen($timeInput) == 5) {
                // Format 91104 -> 09:11:04
                $time = '0' . substr($timeInput, 0, 1) . ':' . substr($timeInput, 1, 2) . ':' . substr($timeInput, 3, 2);
            }
            $strDate = $dateInput . ' ' . $time;
            return Carbon::createFromFormat('d/m/Y H:i:s', $strDate);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function handleAmount($amount)
    {
        $amount = str_replace(',', '', $amount);
        return (int) $amount;
    }

    public function validateTransaction($dataLog)
    {
        $success = true;
        $message = [];
        if (empty($dataLog['user_id'])) {
            $message['user_id'] = 'User ID invalid';
            $success = false;
        }
        if (empty($dataLog['amount'])) {
            $message['amount'] = 'Amount invalid';
            $success = false;
        }
        if (empty($dataLog['date'])) {
            $message['transaction_id'] = 'Transaction ID invalid';
            $success = false;
        }

        return [
            'success' => $success,
            'message' => $message
        ];
    }

    public function genTransferCode($userId, $identifierCustomer)
    {
        return 'U' . $userId . 'C' . $identifierCustomer;
    }

    public static function parseDescription(string $description)
    {
        $userId = $customerIdentifier = null;
        // Lấy user = 2 chữ số ngay sau 'U' và trước 'C'
        preg_match('/U(\d+)C/', $description, $output_array);
        if (isset($output_array[1])) {
            $userId = $output_array[1];
        }

        preg_match('/U\d+C(\d+)/', $description, $output_array);
        if (isset($output_array[1])) {
            $customerIdentifier = $output_array[1];
        }
        // Lấy customer = 5 chữ số ngay sau 'C'

        return [
            'user_id' => $userId,
            'customer_identifier' => $customerIdentifier,
        ];
    }
}
