<?php

namespace App\Models;

use Spatie\Permission\Models\Role;

class RoleCustom extends Role
{
    public function groupPermissions()
    {
        return $this->belongsToMany(GroupPermission::class, "group_permissions_roles", "role_id", "group_permission_id");
    }
}
