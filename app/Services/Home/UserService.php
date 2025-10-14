<?php
namespace App\Services\Home;

use App\Models\MySQL\User;
use App\Models\MySQL\Stores;
use DB;


class UserService
{
    public function create(array $data)
    {
        return User::create($data);
    }

    public function update($item, array $data)
    {
        return $item->update($data);
    }

    public function delete($id)
    {
        return User::where('id', $id)->delete();
    }

    public function deletes(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $deletedUsers = User::whereIn('id', $ids)->delete();

            Stores::whereIn('user_id', $ids)->delete();

            return $deletedUsers;
        });
    }

    public function findById($id, $select = ["*"], $relation = [])
    {
        return User::select($select)->with($relation)->where('id', $id)->first();
    }

    public function findByIds($ids, $select = ["*"], $relation = [])
    {
        return User::select($select)->with($relation)->whereIn('id', $ids)->get();
    }

    public function getAll($select = ["*"], $relation = [], $isPaginate = false, $perPage = 10, $page = 1, $orderBy = ['id', 'DESC'], $request = null)
    {
        $query = User::select($select)->with($relation);

        // Apply filters if request is provided
        if ($request) {
            $query->filterName($request)
                  ->filterEmail($request)
                  ->filterType($request)
                  ->filterStatus($request)
                  ->filterCreatedDate($request);
        }

        if ($isPaginate) {
            return $query->orderBy(...$orderBy)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy(...$orderBy)->get();
    }
}