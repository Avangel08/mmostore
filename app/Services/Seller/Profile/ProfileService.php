<?php

namespace App\Services\Seller\Profile;

use App\Models\MySQL\User;
use Hash;

/**
 * Class ProfileService
 */
class ProfileService
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
