<?php

namespace Database\Seeders;

use App\Models\MySQL\Plans;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $listPlans = [
            [
                'type' => Plans::TYPE['DEFAULT'],
                'name' => 'Free',
                'price' => 0,
                'price_origin' => 0,
                'off' => 0,
                'interval' => 30,
                'interval_type' => 1,
                'feature' => null,
                'description' => null,
                'status' => Plans::STATUS['ACTIVE'],
                'creator_id' => 1,
                'best_choice' => 0,
                'show_public' => 0,
                'sub_description' => "Free plan with basic features",
            ]
        ];

        foreach ($listPlans as $plan) {
            Plans::create($plan);
        }
    }
}
