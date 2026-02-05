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
    protected $signature = 'systems:update-non-plan-user 
                            {--save : Actually save changes to database (dry-run by default, no changes saved)}
                            {--user-id= : Process only specific user ID}
                            {--max-records= : Maximum number of records to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign default plan to seller users if no plan exists';

    protected $logFile;
    protected $statistics = [
        'total_found' => 0,
        'processed' => 0,
        'successful' => 0,
        'failed' => 0,
        'skipped' => 0,
        'mode' => 'dry-run',
    ];

    /**
     * Execute the console command.
     */
    public function handle(
        PlanService $planService,
        PaymentMethodService $paymentMethodService,
        PlanCheckoutService $planCheckoutService
    ) {
        $this->setupLogFile();

        $isDryRun = !$this->option('save');
        $specificUserId = $this->option('user-id');
        $maxRecords = $this->option('max-records') ? (int) $this->option('max-records') : null;

        $this->statistics['mode'] = $isDryRun ? 'dry-run' : 'save';

        if ($isDryRun) {
            $this->logInfo('DRY RUN MODE - No changes will be saved to database. Use --save to actually save changes.');
        } else {
            $this->logInfo('SAVE MODE - Changes will be saved to the database.');
        }

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

            $query = User::where('type', User::TYPE['SELLER'])
                ->whereDoesntHave('currentPlan');

            if ($specificUserId) {
                $query->where('id', $specificUserId);
            }

            if ($maxRecords) {
                $query->limit($maxRecords);
            }

            $totalUsers = $query->count();
            $this->statistics['total_found'] = $totalUsers;

            if ($totalUsers === 0) {
                $this->logInfo('No seller users found without a plan.');
                $this->showStatistics();
                return Command::SUCCESS;
            }

            $this->logInfo("Found {$totalUsers} seller(s) without a plan.");

            $chunkSize = 100;

            $progressBar = $this->output->createProgressBar($totalUsers);
            $progressBar->start();

            // Rebuild query for chunking
            $chunkQuery = User::where('type', User::TYPE['SELLER'])
                ->whereDoesntHave('currentPlan');

            if ($specificUserId) {
                $chunkQuery->where('id', $specificUserId);
            }

            if ($maxRecords) {
                $chunkQuery->limit($maxRecords);
            }

            $chunkQuery->chunkById($chunkSize, function ($users) use ($planCheckoutService, $defaultPlan, $paymentMethod, $progressBar, $isDryRun) {
                    foreach ($users as $user) {
                        $this->statistics['processed']++;
                        
                        try {
                            if ($isDryRun) {
                                $this->logInfo(" [DRY RUN] Would assign default plan to user ID: {$user->id} | Name: {$user->name} | Email: {$user->email}");
                                $this->statistics['successful']++;
                            } else {
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
                                    $this->statistics['failed']++;
                                    DB::rollBack();
                                    $progressBar->display();
                                    $progressBar->advance();
                                    continue;
                                }

                                dispatch_sync(JobProcessPaymentPlan::forDefaultPlanNewUser(checkoutId: $planCheckout->id));

                                $this->logInfo("Successfully assigned default plan to user ID: {$user->id} | Name: {$user->name} | Email: {$user->email}");
                                $this->statistics['successful']++;
                                DB::commit();
                            }
                        } catch (Throwable $th) {
                            if (!$isDryRun) {
                                DB::rollBack();
                            }
                            $this->logError("Error processing user ID: {$user->id} - {$user->name}");
                            $this->logError("Error: {$th->getMessage()}");
                            $this->statistics['failed']++;
                        }

                        $progressBar->display();
                        $progressBar->advance();
                    }
                });

            $progressBar->finish();
            $this->newLine(2);

            $this->logInfo("Process completed!");
            $this->showStatistics();

            return $this->statistics['failed'] > 0 ? Command::FAILURE : Command::SUCCESS;
        } catch (Throwable $th) {
            $this->logError('An error occurred: ' . $th->getMessage());
            $this->logError('Stack trace: ' . $th->getTraceAsString());
            $this->showStatistics();
            return Command::FAILURE;
        }
    }

    protected function showStatistics()
    {
        $this->newLine();
        $this->logInfo('=== EXECUTION STATISTICS ===');
        $this->logInfo("Execution mode: " . strtoupper($this->statistics['mode']));
        $this->logInfo("Total users found: {$this->statistics['total_found']}");
        $this->logInfo("Users processed: {$this->statistics['processed']}");
        $this->logInfo("Successful operations: {$this->statistics['successful']}");
        $this->logInfo("Failed operations: {$this->statistics['failed']}");
        $this->logInfo("Skipped operations: {$this->statistics['skipped']}");
        
        if ($this->statistics['processed'] > 0) {
            $successRate = round(($this->statistics['successful'] / $this->statistics['processed']) * 100, 2);
            $this->logInfo("Success rate: {$successRate}%");
        }
        
        if ($this->statistics['mode'] === 'dry-run') {
            $this->logInfo("* This was a DRY RUN - no actual changes were made to the database.");
        }

        if ($this->statistics['mode'] === 'save') {
            $this->logInfo("* Changes were SAVED to the database.");
        }
        
        $this->logInfo('============================');
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
