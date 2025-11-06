<?php

namespace App\Console\Commands\Systems;

use App\Models\Mongo\BalanceHistories;
use App\Models\MySQL\Stores;
use App\Services\Tenancy\TenancyService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use MongoDB\BSON\UTCDateTime;
use Throwable;

class CommandConvertBalanceHistoryDateAt extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'systems:convert-balance-history-dates {--save : Save changes to database} {--chunk-size=1000 : Number of records to process per chunk}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Chuyển đổi trường date_at trong BalanceHistories từ các kiểu dữ liệu khác nhau (string/ISODate) sang định dạng chuỗi';

    protected $logFile;
    protected $saveToDb;
    protected $chunkSize;

    /**
     * Execute the console command.
     */
    public function handle(TenancyService $tenancyService)
    {
        $this->setupLogFile();
        $this->saveToDb = $this->option('save');
        $this->chunkSize = (int) $this->option('chunk-size');
        $this->info("============= LỆNH CHUYỂN ĐỔI NGÀY THÁNG LỊCH SỬ SỐ DƯ =============");

        if ($this->saveToDb) {
            $this->info("💾 Chạy ở chế độ LƯU DỮ LIỆU. Các thay đổi sẽ được lưu vào cơ sở dữ liệu.");
        } else {
            $this->warn("⚠️ Chạy ở chế độ THỬ NGHIỆM. Không có thay đổi nào được thực hiện. Sử dụng --save để lưu thay đổi.");
        }

        $this->logInfo("🚀 Bắt đầu chuyển đổi trường date_at trong BalanceHistories...");
        $this->logInfo("📦 Kích thước chunk: {$this->chunkSize} bản ghi mỗi lô");

        $totalStores = 0;
        $totalConverted = 0;
        $totalErrors = 0;

        $listStore = Stores::where("status", Stores::STATUS['ACTIVE'])->cursor();
        $index = 0;
        foreach ($listStore as $store) {
            try {
                $this->newLine();
                $this->logInfo((++$index) . ". Đang xử lý Store ID: {$store->id} ");
                $this->logInfo("Tên Store: {$store->name}");

                $connect = $tenancyService->buildConnectionFromStore($store);
                $tenancyService->applyConnection($connect, true);

                $storeConverted = 0;
                $storeErrors = 0;

                // Get total count for this store
                $totalRecords = BalanceHistories::count();
                $this->logInfo("Tìm thấy {$totalRecords} bản ghi lịch sử số dư");

                if ($totalRecords > 0) {
                    $this->logInfo("Bắt đầu quá trình chuyển đổi...");

                    BalanceHistories::chunkById($this->chunkSize, function ($records) use (&$storeConverted, &$storeErrors) {
                        foreach ($records as $record) {
                            try {
                                $converted = $this->convertDateField($record);
                                if ($converted) {
                                    $storeConverted++;
                                    if ($this->saveToDb) {
                                        $this->logInfo("✅ Đã cập nhật bản ghi {$record->_id} vào cơ sở dữ liệu");
                                    }
                                }
                            } catch (Throwable $th) {
                                $this->logError("Lỗi khi xử lý bản ghi {$record->_id}: {$th->getMessage()}");
                                $storeErrors++;
                            }

                        }
                    });
                } else {
                    $this->logInfo("Không có bản ghi nào để xử lý - bỏ qua...");
                }

                if ($this->saveToDb) {
                    $this->logInfo("Kết quả: Đã chuyển đổi và lưu vào DB: {$storeConverted}, Lỗi: {$storeErrors}");
                } else {
                    $this->logInfo("Kết quả: Đã phân tích: {$storeConverted}, Lỗi: {$storeErrors} (chưa lưu vào DB)");
                }

                $totalStores++;
                $totalConverted += $storeConverted;
                $totalErrors += $storeErrors;
            } catch (Throwable $th) {
                $this->logError("THẤT BẠI khi xử lý store {$store->id}: {$th->getMessage()}");
                $totalErrors++;
                continue;
            }
        }

        $this->newLine(2);
        $this->info("===================== TỔNG KẾT CHUYỂN ĐỔI ========================");
        $this->logInfo("Tổng store: {$totalStores}");
        
        if ($this->saveToDb) {
            $this->logInfo("Tổng số bản ghi đã chuyển đổi và lưu vào DB: {$totalConverted}");
        } else {
            $this->logInfo("Tổng số bản ghi cần chuyển đổi: {$totalConverted} (chưa lưu vào DB)");
        }

        if ($totalErrors > 0) {
            $this->warn("Tổng số lỗi gặp phải: {$totalErrors}");
        } else {
            $this->info("Tổng số lỗi gặp phải: 0");
        }

        $this->logInfo("Chuyển đổi hoàn thành lúc: " . Carbon::now()->toDateTimeString());

        if ($totalConverted > 0) {
            if ($this->saveToDb) {
                $this->info("Trạng thái: Đã chuyển đổi và lưu thành công {$totalConverted} bản ghi lịch sử số dư vào cơ sở dữ liệu!");
            } else {
                $this->info("Trạng thái: Phát hiện {$totalConverted} bản ghi cần chuyển đổi. Sử dụng --save để lưu thay đổi.");
            }
        } else {
            $this->info("Trạng thái: Không có bản ghi nào cần chuyển đổi - tất cả trường date_at đã là chuỗi.");
        }

        return $totalErrors > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * Convert date_at field to string format if needed
     *
     * @param BalanceHistories $record
     * @return bool Whether conversion was needed and performed
     */
    protected function convertDateField(BalanceHistories $record): bool
    {
        $dateAt = $record->getRawOriginal('date_at');

        // Check if it's already a string
        if (is_string($dateAt)) {
            return false; // No conversion needed
        }

        $convertedDate = null;

        try {
            // Handle MongoDB UTCDateTime (ISODate)
            if ($dateAt instanceof UTCDateTime) {
                $convertedDate = $dateAt->toDateTime()->format('Y-m-d H:i:s');
                $this->logDebug("Chuyển đổi UTCDateTime cho bản ghi {$record->_id}: {$convertedDate}");
            }
            // Handle Carbon/DateTime objects
            elseif ($dateAt instanceof \DateTime || $dateAt instanceof Carbon) {
                $convertedDate = $dateAt->format('Y-m-d H:i:s');
                $this->logDebug("Chuyển đổi DateTime cho bản ghi {$record->_id}: {$convertedDate}");
            }
            // Handle timestamp
            elseif (is_numeric($dateAt)) {
                $convertedDate = Carbon::createFromTimestamp($dateAt)->format('Y-m-d H:i:s');
                $this->logDebug("Chuyển đổi timestamp cho bản ghi {$record->_id}: {$convertedDate}");
            }
            // Handle other formats
            else {
                // Try to parse as Carbon
                $carbonDate = Carbon::parse($dateAt);
                $convertedDate = $carbonDate->format('Y-m-d H:i:s');
                $this->logDebug("Chuyển đổi định dạng khác cho bản ghi {$record->_id}: {$convertedDate}");
            }

            if ($convertedDate && $this->saveToDb) {
                $record->update(['date_at' => $convertedDate]);
            }

            if ($convertedDate) {
                return true; // Conversion was performed
            }

        } catch (Throwable $th) {
            $this->logError("Thất bại khi chuyển đổi ngày tháng cho bản ghi {$record->_id}: {$th->getMessage()}");
            throw $th;
        }

        return false;
    }

    /**
     * Setup log file
     */
    protected function setupLogFile()
    {
        $logDir = storage_path('logs' . DIRECTORY_SEPARATOR . date('Ymd'));

        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        $this->logFile = $logDir . DIRECTORY_SEPARATOR . 'convert_balance_history_dates.txt';
    }

    /**
     * Log info message
     */
    protected function logInfo(string $message)
    {
        $this->info($message);
        $this->writeToLog('INFO', $message);
    }

    /**
     * Log warning message
     */
    protected function logWarn(string $message)
    {
        $this->warn($message);
        $this->writeToLog('WARN', $message);
    }

    /**
     * Log error message
     */
    protected function logError(string $message)
    {
        $this->error($message);
        $this->writeToLog('ERROR', $message);
    }

    /**
     * Log debug message (only to file)
     */
    protected function logDebug(string $message)
    {
        $this->writeToLog('DEBUG', $message);
    }

    /**
     * Write message to log file
     */
    protected function writeToLog(string $level, string $message)
    {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
        file_put_contents($this->logFile, $logMessage, FILE_APPEND);
    }
}