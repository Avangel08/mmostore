<?php

namespace Database\Seeders;

use App\Models\MySQL\ProductType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Email',
                'status' => ProductType::STATUS['ACTIVE']
            ],
            [
                'name' => 'Account',
                'status' => ProductType::STATUS['ACTIVE'],
            ],
            [
                'name' => 'Other',
                'status' => ProductType::STATUS['ACTIVE']
            ]
        ];

        foreach ($types as $type) {
            ProductType::create($type);
        }
    }
}
