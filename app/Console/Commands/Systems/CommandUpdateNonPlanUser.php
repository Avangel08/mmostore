<?php

namespace App\Console\Commands\Systems;

use App\Jobs\Systems\JobProcessPaymentPlan;
use App\Models\MySQL\User;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\Plan\PlanService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Illuminate\Console\Command;
use DB;
use Throwable;

class CommandUpdateNonPlanUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'systems:update-non-plan-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign default plan to seller users if no plan exists';

    protected $logFile;

    /**
     * Execute the console command.
     */
    public function handle(
        PlanService $planService,
        PaymentMethodService $paymentMethodService,
        PlanCheckoutService $planCheckoutService
    ) {
        $this->setupLogFile();

        $this->logInfo('Starting to assign default plans to seller users without any plan...');

        try {
            $defaultPlan = $planService->getDefaultPlan();

            if (!$defaultPlan) {
                $defaultPlan = $planService->createDefaultPlanIfNotExist();
            }

            if (!$defaultPlan) {
                $this->logError('Default plan not found. Please create a default plan first.');
                return Command::FAILURE;
            }

            $this->logInfo("Default plan found: {$defaultPlan->name} (ID: {$defaultPlan->id})");

            $paymentMethod = $paymentMethodService->findNoBankMethod();

            if (!$paymentMethod) {
                $this->logError('Payment method no_bank not found.');
                return Command::FAILURE;
            }

            $totalUsers = User::where('type', User::TYPE['SELLER'])
                ->whereDoesntHave('currentPlan')
                ->count();

            if ($totalUsers === 0) {
                $this->logInfo('No seller users found without a plan.');
                return Command::SUCCESS;
            }

            $this->logInfo("Found {$totalUsers} seller(s) without a plan.");

            $successCount = 0;
            $failureCount = 0;
            $chunkSize = 100;

            $progressBar = $this->output->createProgressBar($totalUsers);
            $progressBar->start();

            User::where('type', User::TYPE['SELLER'])
                ->whereDoesntHave('currentPlan')
                ->chunkById($chunkSize, function ($users) use ($planCheckoutService, $defaultPlan, $paymentMethod, &$successCount, &$failureCount, $progressBar) {
                    foreach ($users as $user) {
                        try {
                            DB::beginTransaction();

                            // Create checkout for this user
                            $planCheckout = $planCheckoutService->createCheckout(
                                $user,
                                $defaultPlan,
                                $paymentMethod,
                            );

                            if (!$planCheckout) {
                                $message = "Failed to create checkout for user ID: {$user->id} - {$user->name}";
                                $this->logWarn($message);
                                $failureCount++;
                                DB::rollBack();
                                $progressBar->display();
                                $progressBar->advance();
                                continue;
                            }

                            dispatch_sync(JobProcessPaymentPlan::forDefaultPlanNewUser(checkoutId: $planCheckout->id));

                            $this->logInfo(" Successfully assigned default plan to user ID: {$user->id} | Name: {$user->name} | Email: {$user->email}");
                            $successCount++;
                            DB::commit();
                        } catch (Throwable $th) {
                            DB::rollBack();
                            $this->logError("Error processing user ID: {$user->id} - {$user->name}");
                            $this->logError("Error: {$th->getMessage()}");
                            $failureCount++;
                        }

                        $progressBar->display();
                        $progressBar->advance();
                    }
                });

            $progressBar->finish();
            $this->newLine(2);

            $this->logInfo("Process completed!");
            $this->logInfo("Successfully assigned default plan to {$successCount} user(s).");

            if ($failureCount > 0) {
                $this->logWarn("Failed to assign plan to {$failureCount} user(s).");
            }

            return Command::SUCCESS;
        } catch (Throwable $th) {
            $this->logError('An error occurred: ' . $th->getMessage());
            $this->logError('Stack trace: ' . $th->getTraceAsString());
            return Command::FAILURE;
        }
    }

    protected function setupLogFile()
    {
        $logDir = storage_path('logs' . DIRECTORY_SEPARATOR . date('Ymd'));

        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        $this->logFile = $logDir . DIRECTORY_SEPARATOR . 'update_non_plan_user.txt';
    }

    protected function logInfo(string $message)
    {
        $this->info($message);
        $this->writeToLog('INFO', $message);
    }

    protected function logWarn(string $message)
    {
        $this->warn($message);
        $this->writeToLog('WARN', $message);
    }

    protected function logError(string $message)
    {
        $this->error($message);
        $this->writeToLog('ERROR', $message);
    }

    protected function writeToLog(string $level, string $message)
    {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
        file_put_contents($this->logFile, $logMessage, FILE_APPEND);
    }
}
