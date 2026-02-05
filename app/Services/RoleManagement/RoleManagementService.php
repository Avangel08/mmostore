<?php
namespace App\Services\RoleManagement;

use App\Models\MySQL\RoleCustom;
use DB;
use Spatie\Permission\Models\Permission;


class RoleManagementService
{
    public function getAllRoles($select = ["*"], $relation = [], $isPaginate = false, $perPage = 10, $page = 1, $orderBy = ['id', 'DESC'])
    {
        $query = RoleCustom::select($select)->with($relation);

        if ($isPaginate) {
            return $query->orderBy(...$orderBy)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy(...$orderBy)->get();
    }

    public function getById($id, $select = ["*"], $relation = [])
    {
        return RoleCustom::select($select)->with($relation)->where('id', $id)->first();
    }

    public function findByIds($ids, $select = ["*"], $relation = [])
    {
        return RoleCustom::select($select)->with($relation)->whereIn('id', $ids)->get();
    }

    public function createRole($data)
    {
        DB::transaction(function () use ($data) {
            $name = $data['roleName'];
            $guard = $data['guard'];
            $permissionIds = $data['permissionIds'] ?? [];

            $groupIds = Permission::whereIn('id', $permissionIds)->distinct()->pluck('group_permission_id')->toArray();

            $newRole = RoleCustom::create([
                'name' => $name,
                'guard_name' => $guard,
            ]);

            $newRole->groupPermissions()->sync($groupIds);
            $newRole->permissions()->sync($permissionIds);
        });
    }

    public function updateRole(RoleCustom $role, $data)
    {
        DB::transaction(function () use ($role, $data) {
            $name = $data['roleName'];
            $guard = $data['guard'];
            $permissionIds = $data['permissionIds'] ?? [];

            $groupIds = Permission::where('guard_name', $guard)->whereIn('id', $permissionIds)->distinct()->pluck('group_permission_id')->toArray();

            $role->update([
                'name' => $name,
                'guard_name' => $guard,
            ]);
            $role->groupPermissions()->sync($groupIds);
            $role->permissions()->sync($permissionIds);
        });
    }
}