<?php

namespace Database\Seeders;

use App\Models\MySQL\User;
use Hash;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class StoreOwnerUser extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeOwner = User::firstOrCreate(
            ['email' => 'store_owner@gmail.com'],
            [
                'name' => 'Store Owner',
                'password' => Hash::make('123123'),
                'type' => 'SELLER',
            ]
        );

        $storeOwnerRole = Role::findOrCreate(config('role.seller'), config('guard.seller'));
        $storeOwner->assignRole($storeOwnerRole);
    }
}
