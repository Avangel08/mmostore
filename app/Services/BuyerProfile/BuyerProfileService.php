<?php

namespace App\Services\BuyerProfile;

use App\Models\Mongo\Customers;
use App\Models\MySQL\User;
use Carbon\Carbon;
use Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Class ProfileService
 */
class BuyerProfileService
{
    public function updateInfo(Customers $customer, array $data)
    {
        return $customer->update([
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
        ]);
    }

    public function changePassword(Customers $customer, string $newPassword)
    {
        return $customer->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    public function uploadProfileImage(Customers $customer, UploadedFile $image)
    {
        if ($customer?->image && Storage::disk('public')->exists($customer->image)) {
            Storage::disk('public')->delete($customer->image);
        }
        $host = request()->getHost();
        $filename = 'avatar_' . $customer->id . '_' . now()->format("Ymd_His") . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        $path = $image->storeAs("{$host}/avatar/" . config('guard.buyer'), $filename, 'public');

        return $customer->update([
            'image' => $path,
        ]);
    }
}
