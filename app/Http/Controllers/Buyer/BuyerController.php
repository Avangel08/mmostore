<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\Home\StoreService;

class BuyerController extends Controller
{
    protected $storeService;

    public function __construct(StoreService $storeService)
    {
        $this->storeService = $storeService;
    }

    public function home(string $sub): Response
    {
        $theme = "Theme_1"; // This could be dynamic based on tenant settings 
        $user = auth('buyer')->user();
        return Inertia::render("Themes/{$theme}/Home/index", [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null,
            'store_settings' => [
                'theme' => $theme,
                'storeName' => 'Hieu Store',
                'storeLogo' => '',
                'pageHeaderText' => '<h3 class="display-8 fw-semibold text-capitalize mb-3 lh-base text-white">Hello, welcome to MMO Store</h3><p class="fs-13 mb-4 text-white">Mỗi tài khoản MAIL được bán duy nhất và một lần ( Không chia sẻ)</p><p class="fs-13 mb-4 text-white">Nhằm bảo mật phải đúng thiết bị + trình duyệt đã mua mới có thể xem được dữ liệu và tải xuống. Tất cả Dữ liệu đơn hàng sẽ được tự động xóa sau 24h</p><p class="fs-13 mb-4 text-white">Phương pháp đọc email qua IMAP, POP3 và SMTP ko còn khả dụng nữa để truy cập và đọc được tất cả hòm thư gửi về bạn phải sử dụng phương thức thông qua (OAuth2)</p><p class="fs-13 mb-4 text-white">Chúng tôi đã tích hợp đọc mail qua OAuth2 trên website và API để sử dụng khi mua mail bạn tải full định dạng bao gồm Refresh_token và client_id. Mỗi Refresh_token có thời gian tồn tại là 90 ngày, sau 90 ngày, nếu không được làm mới, Refresh_token sẽ không thể sử dụng được nữa</p>',
                'pageHeaderImage' => ''
            ]
        ]);
    }

    public function products(string $sub): Response
    {
        $user = auth('buyer')->user();
         
        return Inertia::render('Products/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function productDetail(string $sub, string $id): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Products/Detail', [
            'subdomain' => $sub,
            'productId' => $id,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function about(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('About/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function contact(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Contact/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }
}


