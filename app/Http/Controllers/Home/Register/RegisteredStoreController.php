<?php

namespace App\Http\Controllers\Home\Register;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\RegisterStore\RegisterStoreRequest;
use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use App\Services\Home\ServerService;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use App\Services\Setting\SettingService;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegisteredStoreController extends Controller
{
    protected $userService;
    protected $storeService;
    protected $serverService;
    protected $settingService;

    public function __construct(
        UserService $userService,
        StoreService $storeService,
        ServerService $serverService,
        SettingService $settingService,
    )
    {
        $this->userService = $userService;
        $this->storeService = $storeService;
        $this->serverService = $serverService;
        $this->settingService = $settingService;
    }

    public function register(): Response
    {
        return Inertia::render('Register/index');
    }

    public function createStore(RegisterStoreRequest $registerStoreRequest)
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
                'name' => $data['store_name'],
                'user_id' => $user['id'],
                'server_id' => $server['id'],
                'status' => Stores::STATUS['ACTIVE'],
                'domain' => [
                    $data['domain_store'] . env('DOMAIN_STORE'),
                ],
                'database_config' => [
                    "host" => $server['host'],
                    "port" => $server['port'],
                    "user" => $server['user'],
                    "password" => $server['password'],
                ],
            ];

            $store = $this->storeService->create($dataStore);

            // Create default theme
            $defaultSettings = [
                'user_id' => $user['id'],
                'theme' => "theme_1",
                'store_settings' => []
            ];
            $settings = $this->settingService->createSetting($defaultSettings);
            dd($settings);
            $this->storeService->update($store, [
                'database_config' => [
                    "host" => $server['host'],
                    "port" => $server['port'],
                    "user" => $server['user'],
                    "password" => $server['password'],
                    "database_name" => date('Y_m_d') . '_' . $store['id'],
                    "prefix" => $store['id'],
                    "setting_id" => $settings->id
                ]
            ]);

            $scheme = request()->isSecure() ? 'https://' : 'http://';
            $redirectUrl = $scheme . $data['domain_store'] . env('DOMAIN_STORE') . '/admin';

            return Inertia::render('Register/Redirect', [
                'redirectUrl' => $redirectUrl,
                'seconds' => 5,
            ]);
        } catch (\Exception $exception) {
            throw ValidationException::withMessages([
                'register' => $exception->getMessage(),
            ]);
        }
    }
}
