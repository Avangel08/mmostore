<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class GroupPermission extends Model
{
    use HasFactory;
    
    protected $table = "group_permissions";
    protected $fillable = [
        "name",
        "description",
        "key",
    ];

    public function permissions()
    {
        return $this->hasMany(Permission::class, 'group_permission_id', 'id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'group_permissions_roles', 'group_permission_id', 'role_id');
    }
}
