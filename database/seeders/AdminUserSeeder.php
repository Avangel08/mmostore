<?php

namespace Database\Seeders;

use App\Models\MySQL\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('123123'),
            ]
        );

        $adminRole = Role::findOrCreate(config('role.admin'), config('guard.admin'));
        $admin->assignRole($adminRole);
    }
}
