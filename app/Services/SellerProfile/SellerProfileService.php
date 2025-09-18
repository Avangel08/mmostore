<?php

namespace App\Services\SellerProfile;

use App\Models\MySQL\User;
use Hash;

/**
 * Class ProfileService
 */
class SellerProfileService
{
    public function updateInfo(User $user, array $data)
    {
        return $user->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'name' => $data['first_name'] . ' ' . $data['last_name'],
        ]);
    }

    public function changePassword(User $user, string $newPassword)
    {
        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}
