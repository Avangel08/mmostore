<?php

namespace App\Http\Controllers\Home\Register;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\RegisterStore\RegisterStoreRequest;
use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use App\Services\Home\ServerService;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredStoreController extends Controller
{
    protected $userService;
    protected $storeService;
    protected $serverService;

    public function __construct(
        UserService $userService,
        StoreService $storeService,
        ServerService $serverService,
    )
    {
        $this->userService = $userService;
        $this->storeService = $storeService;
        $this->serverService = $serverService;
    }

    public function register(): Response
    {
        return Inertia::render('Register/index');
    }

    public function createStore(RegisterStoreRequest $registerStoreRequest): Response
    {

        try {
            $data = $registerStoreRequest->validated();
            $dataUser = [
                'name' => $data['store_name'],
                'email' => $data['email'],
                'status' => User::STATUS['ACTIVE'],
                'password' => Hash::make($data['password']),
                'type' => User::TYPE['SELLER'],
            ];

            $user = $this->userService->create($dataUser);
            $server = $this->serverService->getActive();
            $server = $server->random();

            $dataStore = [
                'name' => $data['name'],
                'user_id' => $user['id'],
                'server_id' => $server['id'],
                'status' => Stores::STATUS['ACTIVE'],
            ];

            $this->storeService->create($dataStore);
        } catch (\Exception $exception) {
            dd($exception->getMessage());
        }

        return true;
    }
}
