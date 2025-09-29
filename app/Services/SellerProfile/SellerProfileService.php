<?php

namespace App\Services\SellerProfile;

use App\Models\MySQL\User;
use Carbon\Carbon;
use Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

    public function uploadProfileImage(User $user, UploadedFile $image)
    {
        if ($user?->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }
        $host = request()->getHost();
        $filename = 'avatar_' . $user->id . '_' . Carbon::now()->format("Ymd") . '.' . $image->getClientOriginalExtension();

        $path = $image->storeAs("{$host}/avatar", $filename, 'public');

        return $user->update([
            'image' => $path,
        ]);
    }
}
