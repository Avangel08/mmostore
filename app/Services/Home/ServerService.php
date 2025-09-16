<?php
namespace App\Services\Home;

use App\Models\MySQL\Servers;
use DB;


class ServerService
{
    public function create(array $data)
    {
        return Servers::create($data);
    }

    public function update($item, array $data)
    {
        return $item->update($data);
    }

    public function delete($id)
    {
        return Servers::destroy($id);
    }

    public function getActive($select = ["*"], $relation = [])
    {
        return Servers::select($select)->with($relation)->where('status', Servers::STATUS['ACTIVE'])->get();
    }

    public function findById($id, $select = ["*"], $relation = [])
    {
        return Servers::select($select)->with($relation)->where('id', $id)->first();
    }

    public function findByIds($ids, $select = ["*"], $relation = [])
    {
        return Servers::select($select)->with($relation)->whereIn('id', $ids)->get();
    }
}