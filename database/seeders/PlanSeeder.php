<?php

namespace Database\Seeders;

use App\Models\MySQL\Plans;
use App\Services\Plan\PlanService;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $listPlans = [
            // [
            //     'type' => Plans::TYPE['DEFAULT'],
            //     'name' => 'Free',
            //     'price' => 0,
            //     'price_origin' => 0,
            //     'off' => 0,
            //     'interval' => 30,
            //     'interval_type' => 1,
            //     'feature' => null,
            //     'description' => null,
            //     'status' => Plans::STATUS['ACTIVE'],
            //     'creator_id' => 1,
            //     'best_choice' => 0,
            //     'show_public' => 0,
            //     'sub_description' => "Free plan with basic features",
            // ]
        ];
        $successCount = 0;
        $planService = app(PlanService::class);
        $defaultPlan = $planService->createDefaultPlanIfNotExist();
        if ($defaultPlan?->wasRecentlyCreated) {
            $this->command->info("Default plan created successfully.");
            $successCount++;
        } else {
            $this->command->info("Default plan already exists. Skipping creation of default plan.");
        }
        $this->command->info("----------------------------");
        

        foreach ($listPlans as $index => $planData) {
            $this->command->info(($index + 1) . ". Seeding plan: " . ($planData['name'] ?? ''));
            $plan = Plans::create(
                $planData
            );
            if ($plan) {
                $this->command->info("Created plan: " . ($planData['name'] ?? ''));
                $successCount++;
            }
            $this->command->info("----------------------------");
        }
        $this->command->info("Seeded $successCount plans successfully.");
    }
}
