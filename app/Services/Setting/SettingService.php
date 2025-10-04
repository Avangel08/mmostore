<?php

namespace App\Services\Setting;

use App\Models\Mongo\Settings;

/**
 * Class SettingService
 * @package App\Services
 */
class SettingService
{
    public function getById($id, $select = ['*'], $relation = [])
    {
        return Settings::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function createSetting(array $data)
    {
        return Settings::create($data);
    }

    public function updateSetting(Settings $setting, array $data)
    {

    }
}
