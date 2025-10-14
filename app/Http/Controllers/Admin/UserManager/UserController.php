<?php

namespace App\Http\Controllers\Admin\UserManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserManagement\UserManagementRequest;
use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;
    protected $storeService;

    public function __construct(
        UserService $userService,
        StoreService $storeService,
    )
    {
        $this->userService = $userService;
        $this->storeService = $storeService;
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Inertia::render('UserManager/index', [
            'users' => fn() => $this->userService->getAll(isPaginate: true, page: $page, perPage: $perPage, relation: [], request: $request),
            'status' => fn() => User::STATUS,
            'type' => fn() => User::TYPE,
            'detail' => fn() => $this->userService->findById(id: $request->input('id'), relation: [])
        ]);
    }

    public function add(UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $data['password'] = Hash::make($data['password']);
            $this->userService->create($data);

            return back()->with('success', "User added successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update($id, UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $user = $this->userService->findById($id);

            if (!$user) {
                return back()->with('error', "User not found");
            }

            if ($data['status'] == User::STATUS['INACTIVE'] || $data['status'] == User::STATUS['BLOCK']) {
                $this->storeService->updateByUserId($id, ['status' => Stores::STATUS['INACTIVE']]);
            }

            $this->userService->update($user, $data);

            return back()->with('success', "User updated successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function delete(UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $ids = $data['ids'] ?? [];

            if (empty($ids)) {
                return back()->with('error', "No users selected for deletion");
            }

            $this->userService->deletes($ids);

            return back()->with('success', "Deleted selected " . count($ids) .  " user successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function loginAs($id)
    {
        $user = $this->userService->findById($id);
        if (!$user) {
            return back()->with('error', 'User not found');
        }

        $store = $this->storeService->findByUserId($user->id);

        if (!$store || empty($store->domain) || !is_array($store->domain)) {
            return back()->with('error', 'Store domain not found for this user');
        }

        $domains = is_array($store->domain) ? $store->domain : [(string)$store->domain];
        $mainDomain = (string) config('app.main_domain');

        $host = collect($domains)->first(function ($d) use ($mainDomain) {
            return is_string($d) && $mainDomain !== '' && str_ends_with($d, '.' . $mainDomain);
        }) ?? $domains[0];

        $hostParts = explode('.', (string) $host);
        $sub = $hostParts[0] ?? null;

        if (!$sub) {
            return back()->with('error', 'Invalid store domain');
        }

        $signedUrl = URL::temporarySignedRoute(
            'seller.magic-login',
            now()->addMinutes(2),
            [
                'sub' => $sub,
                'user_id' => $user->id,
            ]
        );

        return Redirect::away($signedUrl);
    }
}
