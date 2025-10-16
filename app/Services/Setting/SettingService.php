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

    public function getSettings($autoLoad, $select = ['*'], $relation = [])
    {
        return Settings::select($select)->with($relation)->where('auto_load', $autoLoad)->get();
    }

    public function createSetting(array $data)
    {
        return Settings::create($data);
    }

    public function findByKey($key)
    {
        return Settings::where('key', $key)->first();
    }

    public function updateSetting(Settings $setting, array $data)
    {
        return $setting->update($data);
    }

    public function updateOrCreateSetting($key, $value)
    {
        return Settings::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'auto_load' => true,
                'updated_at' => now()
            ]
        );
    }
}
