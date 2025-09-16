<?php
namespace App\Services\Home;

use App\Models\MySQL\User;
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
        return User::destroy($id);
    }

    public function findById($id, $select = ["*"], $relation = [])
    {
        return User::select($select)->with($relation)->where('id', $id)->first();
    }

    public function findByIds($ids, $select = ["*"], $relation = [])
    {
        return User::select($select)->with($relation)->whereIn('id', $ids)->get();
    }
}