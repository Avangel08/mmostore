<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        Role::findOrCreate(config('role.admin'), config('guard.admin'));

        // Store Owner
        Role::findOrCreate(config('role.store_owner'), config('guard.store_owner'));
    }
}
