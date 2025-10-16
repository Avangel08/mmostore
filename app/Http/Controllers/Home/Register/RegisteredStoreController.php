<?php

namespace App\Http\Controllers\Home\Register;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\RegisterStore\RegisterStoreRequest;
use App\Models\Mongo\PaymentMethodSeller;
use App\Models\Mongo\Settings;
use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use App\Services\Home\ServerService;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use App\Services\PaymentMethodSeller\PaymentMethodSellerService;
use App\Services\Setting\SettingService;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use App\Mail\StoreRegistered;
use App\Services\Tenancy\TenancyService;

class RegisteredStoreController extends Controller
{
    protected $userService;
    protected $storeService;
    protected $serverService;
    protected $settingService;
    protected $tenancyService;
    protected $paymentMethodSellerService;

    public function __construct(
        UserService $userService,
        StoreService $storeService,
        ServerService $serverService,
        SettingService $settingService,
        TenancyService $tenancyService,
        PaymentMethodSellerService $paymentMethodSellerService
    )
    {
        $this->userService = $userService;
        $this->storeService = $storeService;
        $this->serverService = $serverService;
        $this->settingService = $settingService;
        $this->tenancyService = $tenancyService;
        $this->paymentMethodSellerService = $paymentMethodSellerService;
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
                'country' => $data['country'],
                'phone' => $data['phone'],
                'phone_code' => $data['country_code'],
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
                    $data['domain_store'] . '.' .env('APP_MAIN_DOMAIN'),
                ],
                'database_config' => [
                    "host" => $server['host'],
                    "port" => $server['port'],
                    "user" => $server['user'],
                    "password" => $server['password'],
                ],
            ];

            $store = $this->storeService->create($dataStore);

            $this->storeService->update($store, [
                'database_config' => [
                    "host" => $server['host'],
                    "port" => $server['port'],
                    "user" => $server['user'],
                    "password" => $server['password'],
                    "database_name" => date('Y_m_d') . '_' . $store['id'],
                    "prefix" => $store['id']
                ]
            ]);

            $defaultSettings = [
                "theme" => "theme_1",
                "storeName" => "",
                "storeLogo" => "",
                "pageHeaderImage" => "",
                "pageHeaderText" => "",
                "currency" => Settings::CURRENCY['VND'],
            ];

            $connection = $this->tenancyService->buildConnectionFromStore($store);
            $this->tenancyService->applyConnection($connection, false);

            foreach ($defaultSettings as $key => $value) {
                $dataSetting['key'] = $key;
                $dataSetting['value'] = $value;
                $dataSetting['auto_load'] = true;
                $this->settingService->createSetting($dataSetting);
            }

            $defaultPaymentMethod = [
                [
                    "type" => PaymentMethodSeller::TYPE['API'],
                    "key" => PaymentMethodSeller::KEY['API'],
                    "name" => "Balance (API)",
                    "details" => "",
                    "icon" => "",
                    "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                ],
                [
                    "type" => PaymentMethodSeller::TYPE['BALANCE'],
                    "key" => PaymentMethodSeller::KEY['BALANCE'],
                    "name" => "Balance",
                    "details" => "",
                    "icon" => "",
                    "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                ]
            ];

            foreach ($defaultPaymentMethod as $value) {
                $this->paymentMethodSellerService->updateOrCreate($value);
            }

            $scheme = request()->isSecure() ? 'https://' : 'http://';
            $redirectUrl = $scheme . $data['domain_store'] . '.' .env('APP_MAIN_DOMAIN') . '/admin';

			Mail::to($data['email'])->send(new StoreRegistered([
				'email' => $data['email'],
				'password' => $data['password'],
				'store_name' => $data['store_name'],
				'domain' => $data['domain_store'] . '.' . env('APP_MAIN_DOMAIN'),
				'redirect_url' => $redirectUrl,
			]));

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
