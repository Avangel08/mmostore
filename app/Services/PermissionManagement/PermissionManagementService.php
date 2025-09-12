<?php
namespace App\Services\PermissionManagement;

use App\Models\MySQL\GroupPermission;
use DB;
use Spatie\Permission\Models\Permission;


class PermissionManagementService
{
    public function getAllGroupPermissions($select = ["*"], $relation = [], $isPaginate = false, $perPage = 10, $page = 1, $orderBy = ['id', 'DESC'])
    {
        $query = GroupPermission::select($select)->with($relation);

        if ($isPaginate) {
            return $query->orderBy(...$orderBy)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy(...$orderBy)->get();
    }

    public function findByListKey(array $listKey, $select = ["*"], $relation = [], $id = null)
    {
        $query = GroupPermission::whereIn('key', $listKey);
        if ($id) {
            $query->where('id', '!=', $id);
        }
        return $query->select($select)->with($relation)->get();
    }

    public function getGroupPermissionById($id, $select = ["*"], $relation = [])
    {
        return GroupPermission::where('id', $id)->select($select)->with($relation)->first();
    }

    public function createGroupPermission($data)
    {
        DB::transaction(function () use ($data) {
            $name = $data['groupPermissionName'];
            $description = $data['groupPermissionDescription'] ?? null;
            $key = $data['groupPermissionKey'];
            $newGroup = GroupPermission::create([
                'name' => $name,
                'description' => $description,
                'key' => $key,
            ]);

            $listKey = [];
            foreach ($data['groupPermissionValue'] as $permissionName) {
                if ($permissionName == 'all') {
                    continue;
                }
                $listKey[] = $key . '_' . $permissionName;
            }

            $currentListKey = $this->findByListKey($listKey, ['key'])->toArray();

            if (count($currentListKey) > 0) {
                throw new \Exception("Some permission keys already exist: " . implode(", ", array_column($currentListKey, 'key')));
            }

            foreach ($listKey as $permissionKey) {
                Permission::create([
                    'name' => $permissionKey,
                    'group_permission_id' => $newGroup->id,
                    'guard_name' => $data['groupPermissionGuard'],
                ]);
            }
        });
    }

    public function updateGroupPermission(GroupPermission $groupPermission, $data)
    {
        DB::transaction(function () use ($groupPermission, $data) {
            $name = $data['groupPermissionName'];
            $description = $data['groupPermissionDescription'] ?? null;
            $key = $data['groupPermissionKey'];
            $groupPermission->update([
                'name' => $name,
                'description' => $description,
                'key' => $key,
            ]);

            $groupPermission->permissions()->forceDelete();

            $listKey = [];
            foreach ($data['groupPermissionValue'] as $permissionName) {
                if ($permissionName == 'all') {
                    continue;
                }
                $listKey[] = $key . '_' . $permissionName;
            }

            $currentListKey = $this->findByListKey($listKey, ['key'], id: $groupPermission->id)->toArray();

            if (count($currentListKey) > 0) {
                throw new \Exception("Some permission keys already exist: " . implode(", ", array_column($currentListKey, 'key')));
            }

            foreach ($listKey as $permissionKey) {
                Permission::firstOrCreate([
                    'name' => $permissionKey,
                    'group_permission_id' => $groupPermission->id,
                    'guard_name' => $data['groupPermissionGuard'],
                ]);
            }
        });
    }

}