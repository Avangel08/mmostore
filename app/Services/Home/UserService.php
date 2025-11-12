<?php
namespace App\Services\Home;

use App\Models\MySQL\User;
use App\Models\MySQL\Stores;
use Illuminate\Support\Facades\DB;

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
        return DB::transaction(function () use ($id) {
            $store = Stores::where('user_id', $id)->get();
            if ($store->isNotEmpty()) {
                $store->storeCategories()->detach();
                $store->delete();
            }
            return User::where('id', $id)->delete();
        });
    }

    public function deletes(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $deletedUsers = User::whereIn('id', $ids)->delete();

            Stores::whereIn('user_id', $ids)->get()->each(function ($store) {
                $store->storeCategories()->detach();
                $store->delete();
            });

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
        $selectColumns = $select;

        if (count($selectColumns) === 1 && $selectColumns[0] === '*') {
            $selectColumns = ['users.*'];
        }

        $query = User::select($selectColumns)
            ->with($relation)
            ->withReportAccountSeller();

        if ($request) {
            $query->filterName($request)
                  ->filterEmail($request)
                  ->filterType($request)
                  ->filterStatus($request)
                  ->filterCreatedDate($request)
                  ->filterStoreVerifyStatus($request);
        }

        $orderColumn = $orderBy[0] ?? 'id';
        $orderDirection = $orderBy[1] ?? 'DESC';

        if (!str_contains($orderColumn, '.')) {
            $orderColumn = 'users.' . $orderColumn;
        }

        if ($isPaginate) {
            return $query->orderBy($orderColumn, $orderDirection)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy($orderColumn, $orderDirection)->get();
    }
}