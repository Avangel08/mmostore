<?php
namespace App\Service\RoleManagement;

use Spatie\Permission\Models\Role;

class RoleManagementService
{
    public function getAllRoles($select = ["*"], $relation = [], $isPaginate = false, $perPage = 10, $page = 1, $orderBy = ['id', 'DESC']) {
        $query = Role::select($select)->with($relation);

        if ($isPaginate) {
            return $query->orderBy(...$orderBy)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy(...$orderBy)->get();
    }
}