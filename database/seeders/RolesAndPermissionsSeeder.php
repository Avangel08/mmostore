<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'manage stores',
            'manage products',
            'view reports',
        ];

        foreach ($permissions as $perm) {
            Permission::findOrCreate($perm, 'web');
        }

        $admin = Role::findOrCreate('admin', 'web');
        $seller = Role::findOrCreate('seller', 'web');
        $buyer = Role::findOrCreate('buyer', 'web');

        $admin->givePermissionTo($permissions);
        $seller->givePermissionTo(['manage products']);
        $buyer->givePermissionTo([]);
    }
}


