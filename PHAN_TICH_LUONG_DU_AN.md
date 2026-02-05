# Phân Tích Các Luồng Chính Của Dự Án MMO Store

## Tổng Quan Dự Án

**MMO Store** là một nền tảng thương mại điện tử đa tenant (multi-tenant) cho phép các seller tạo cửa hàng riêng để bán tài khoản game (accounts). Hệ thống sử dụng:
- **Backend**: Laravel 12 (PHP 8.2)
- **Frontend**: React + TypeScript + Inertia.js
- **Database**: MySQL (cho dữ liệu chung) + MongoDB (cho dữ liệu tenant)
- **Queue**: Redis/Queue system
- **Payment**: Tích hợp SePay

---

## 1. KIẾN TRÚC ĐA TENANT (Multi-Tenant Architecture)

### 1.1. Luồng Phân Giải Tenant

```
Request → ValidateSubdomain Middleware → ResolveTenantMongo Middleware → Controller
```

**Chi tiết:**
1. **ValidateSubdomain Middleware** (`app/Http/Middleware/ValidateSubdomain.php`):
   - Kiểm tra host domain từ request
   - Tìm Store trong MySQL theo domain
   - Lưu Store vào container: `app()->instance('store', $store)`
   - Nếu không tìm thấy → 404

2. **ResolveTenantMongo Middleware** (`app/Http/Middleware/ResolveTenantMongo.php`):
   - Lấy Store từ container
   - Xây dựng MongoDB connection từ `store->database_config`
   - Áp dụng connection cho tenant hiện tại
   - Mỗi store có database MongoDB riêng

3. **Routing theo Domain:**
   - **Main Domain** (vd: `mmostore.local`): Home page, Admin panel
   - **Subdomain** (vd: `seller1.mmostore.local`): Seller/Buyer store
   - **Custom Domain**: Hỗ trợ domain tùy chỉnh

### 1.2. Cấu Trúc Dữ Liệu

**MySQL (Shared):**
- `stores`: Thông tin cửa hàng
- `users`: Người dùng (admin, seller)
- `plans`: Gói đăng ký
- `payment_methods`: Phương thức thanh toán (admin)
- `currency_rates`: Tỷ giá
- `checkouts`: Thanh toán gói plan

**MongoDB (Per Tenant):**
- `products`: Sản phẩm
- `sub_products`: Sub sản phẩm (variant)
- `accounts`: Tài khoản game để bán
- `orders`: Đơn hàng
- `customers`: Khách hàng (buyer)
- `balance_histories`: Lịch sử số dư
- `deposits`: Nạp tiền
- `categories`: Danh mục
- `settings`: Cài đặt store

---

## 2. LUỒNG XÁC THỰC (Authentication Flows)

### 2.1. Admin Authentication
**Route**: `routes/admin.php`
- **Login**: `/admin/login` → `AuthenticatedSessionController`
- **Guard**: `admin`
- **Domain**: Main domain only
- **Features**: 
  - Quản lý users, plans, payment methods
  - Xác thực store
  - Quản lý roles & permissions

### 2.2. Seller Authentication
**Route**: `routes/seller.php`
- **Login**: `{subdomain}/admin/login` → `LoginController`
- **Guard**: `seller`
- **Domain**: Subdomain hoặc custom domain
- **Features**:
  - Magic login link (signed URL)
  - Forgot/Reset password
  - API token generation

### 2.3. Buyer Authentication
**Route**: `routes/buyer.php`
- **Login**: `{subdomain}/login` → `AuthenticatedSessionController`
- **Register**: `{subdomain}/register` → `RegisteredUserController`
- **Guard**: `buyer`
- **Features**:
  - Đăng ký tài khoản
  - Forgot/Reset password
  - API token cho mobile app

### 2.4. Home Authentication (Store Owner)
**Route**: `routes/home.php`
- **Login**: Main domain → `AuthenticatedSessionController`
- **Register Store**: Tạo store mới
- **Go to Store**: Chuyển đến store của seller

---

## 3. LUỒNG QUẢN LÝ SẢN PHẨM (Product Management)

### 3.1. Seller Tạo Sản Phẩm

```
Seller → ProductController::create() 
  → ProductService::createProduct()
    → Tạo Product trong MongoDB
    → Upload ảnh
    → Tạo SubProduct (variant)
```

**Chi tiết:**
1. **Product** (`app/Http/Controllers/Seller/Product/ProductController.php`):
   - Tạo Product với: name, category, description, image, productType
   - Status: ACTIVE/INACTIVE
   - Liên kết với Category và ProductType

2. **SubProduct** (`app/Http/Controllers/Seller/Product/SubProductController.php`):
   - Variant của Product
   - Chứa: price, quantity, name
   - Mỗi SubProduct có nhiều Accounts

3. **SellerAccount** (`app/Http/Controllers/Seller/Product/SellerAccountController.php`):
   - Quản lý Accounts (tài khoản game)
   - Import accounts từ file
   - Status: LIVE (chưa bán) / SOLD (đã bán)
   - Mỗi Account thuộc một SubProduct

### 3.2. API Product (Seller)
**Route**: `routes/api.php` → `ProductApiController`
- `GET /api/v1/products`: Danh sách products
- `GET /api/v1/products/{id}`: Chi tiết product
- Middleware: `auth:seller_api`, `validate.subdomain`, `tenant.mongo`

---

## 4. LUỒNG ĐẶT HÀNG & THANH TOÁN (Order & Checkout Flow)

### 4.1. Buyer Checkout Product

```
Buyer chọn sản phẩm 
  → ProductController::checkout()
    → CheckoutService::checkout()
      → Tạo Order (PENDING)
      → Dispatch JobProcessPurchase
        → Xử lý bất đồng bộ
```

**Chi tiết luồng Checkout:**

1. **Validation** (`app/Services/Order/CheckoutService.php`):
   - Kiểm tra Product, SubProduct, Customer có ACTIVE
   - Kiểm tra số lượng còn đủ
   - Kiểm tra số dư customer

2. **Tạo Order**:
   - Status: `PENDING`
   - Payment Status: `PENDING`
   - Order Number: Tự động generate

3. **Dispatch Job** (`app/Jobs/Systems/JobProcessPurchase.php`):
   - Queue: `process_purchase`
   - Xử lý bất đồng bộ để tránh timeout

### 4.2. Job Process Purchase (Xử Lý Đơn Hàng)

**Luồng xử lý trong Job:**

```
1. Validate lại dữ liệu (Product, SubProduct, Customer)
2. Reserve Accounts (atomic operation với MongoDB)
   - Tìm accounts chưa bán (status = LIVE)
   - Reserve bằng findOneAndUpdate (atomic)
   - Lưu account data vào Redis
3. Deduct Customer Balance (atomic)
   - Trừ số dư customer
   - Kiểm tra số dư đủ
4. Tạo Balance History
   - Ghi lại giao dịch
   - Chuyển đổi tiền tệ (USD/VND)
5. Update Accounts
   - Gán order_id cho accounts
   - Status = SOLD
6. Update SubProduct Stock
   - Giảm quantity
7. Complete Order
   - Status = COMPLETED
   - Payment Status = PAID
8. Send Telegram Notification (nếu có)
```

**Rollback Mechanism:**
- Nếu bất kỳ bước nào fail → Rollback:
  - Refund customer balance
  - Release reserved accounts
  - Restore sub-product stock
  - Update order to FAILED

**Atomic Operations:**
- Sử dụng MongoDB `findOneAndUpdate` với điều kiện
- Đảm bảo không có race condition
- Redis để cache account data

### 4.3. Buyer Xem Đơn Hàng

**Routes:**
- `GET /order`: Danh sách orders
- `GET /order/{orderNumber}`: Chi tiết order
- `GET /order/{orderNumber}/download`: Download accounts

**API:**
- `GET /api/v1/order`: Danh sách (API)
- `GET /api/v1/order/{orderNumber}`: Chi tiết (API)

---

## 5. LUỒNG THANH TOÁN (Payment Flow)

### 5.1. Payment Methods

**Admin Payment Methods:**
- Quản lý phương thức thanh toán cho Plan checkout
- Tích hợp SePay
- Verify payment

**Seller Payment Methods:**
- Seller tự cấu hình phương thức thanh toán
- Cho phép buyer nạp tiền
- Tích hợp SePay

### 5.2. SePay Webhook Flow

**Seller Webhook** (`app/Http/Controllers/Api/Webhook/SePay/SePayWebHookController.php`):

```
SePay gửi webhook
  → Validate token
  → Check duplicate transaction
  → Parse description (content_bank)
  → Dispatch JobDepositCustomer
    → Xử lý nạp tiền cho customer
```

**Admin Webhook** (`app/Http/Controllers/Api/Webhook/SePay/SePayWebHookAdminController.php`):

```
SePay gửi webhook
  → Validate token
  → Check duplicate transaction
  → Parse description (content_bank)
  → Dispatch JobProcessPaymentPlan
    → Xử lý thanh toán plan
```

**Content Bank Format:**
- Mã định danh trong nội dung chuyển khoản
- Format: `{user_id}_{checkout_id}_{payment_key}_{length}`
- Service: `CheckBankService::parseDescription()`

### 5.3. Deposit Flow (Nạp Tiền)

**Buyer nạp tiền:**

```
Buyer → DepositController::checkout()
  → Tạo Deposit (PENDING)
  → Generate content_bank
  → Buyer chuyển khoản với content_bank
  → SePay webhook nhận
  → JobDepositCustomer xử lý
    → Cộng số dư customer
    → Update Deposit status = COMPLETED
```

**Routes:**
- `GET /deposits`: Trang nạp tiền
- `POST /deposits/checkout`: Tạo deposit
- `GET /deposits/ping`: Ping để check status

---

## 6. LUỒNG PLAN & SUBSCRIPTION

### 6.1. Plan Management (Admin)

**Routes**: `routes/admin.php`
- CRUD Plans
- Duplicate plan
- Plan có: name, price, interval, type, description

### 6.2. Seller Mua Plan

**Luồng:**

```
Seller → PlanController::index()
  → Chọn plan
  → PlanController::checkout()
    → PlanCheckoutService::createCheckout()
      → Tạo Checkout (PENDING)
      → Generate content_bank
      → Seller chuyển khoản
      → SePay webhook (Admin)
      → JobProcessPaymentPlan
        → Activate plan cho seller
        → Update Checkout status
```

**Routes:**
- `GET /admin/plans`: Danh sách plans
- `POST /admin/plans/checkout`: Checkout plan
- `GET /admin/plans/ping`: Ping check status

---

## 7. LUỒNG API

### 7.1. Seller API

**Base URL**: `https://{subdomain}/api/v1`

**Endpoints:**
- `POST /accounts`: Tạo accounts
- `DELETE /accounts`: Xóa accounts
- `GET /products`: Danh sách products
- `GET /products/{id}`: Chi tiết product

**Authentication:**
- Guard: `seller_api` (Sanctum)
- Middleware: `validate.seller.token`
- Token được tạo từ Profile page

### 7.2. Buyer API

**Base URL**: `https://{subdomain}/api/v1`

**Endpoints:**
- `GET /product`: Danh sách products
- `GET /product/{id}`: Chi tiết product
- `GET /order`: Danh sách orders
- `GET /order/{orderNumber}`: Chi tiết order
- `POST /order/checkout`: Checkout

**Authentication:**
- Guard: `buyer_api` (Sanctum)
- Middleware: `validate.buyer.token`

### 7.3. Public API

**Endpoints:**
- `GET /resources/stores`: Danh sách stores
- `GET /resources/categories`: Danh mục
- `GET /resources/banner`: Banner

---

## 8. LUỒNG QUẢN LÝ KHÁCH HÀNG (Customer Management)

### 8.1. Seller Quản Lý Customer

**Routes:**
- `GET /admin/customer-manager`: Danh sách customers
- `GET /admin/customer-manager/edit/{id}`: Sửa customer
- `POST /admin/customer-manager/deposit`: Nạp tiền thủ công

**Features:**
- Xem lịch sử giao dịch
- Nạp tiền thủ công
- Quản lý số dư

### 8.2. Customer Profile

**Buyer:**
- Xem profile
- Đổi mật khẩu
- Upload avatar
- Tạo API token
- Xem payment history

**Seller:**
- Tương tự buyer
- Thêm theme settings
- Telegram notification settings

---

## 9. LUỒNG NOTIFICATION

### 9.1. Telegram Notification

**Service**: `TelegramNotificationService`

**Trigger:**
- Khi có đơn hàng mới (JobProcessPurchase)
- Cấu hình trong Settings

**Settings Key**: `notification`
- `telegram_bot_token`
- `telegram_chat_id`
- `telegram_enabled`

---

## 10. LUỒNG CURRENCY & RATE

### 10.1. Currency Rate Management

**Admin:**
- Quản lý tỷ giá USD/VND
- CRUD currency rates

**Seller:**
- Seller có thể override tỷ giá riêng
- Sử dụng trong checkout để chuyển đổi

**Service:**
- `CurrencyRateService`: Tỷ giá admin
- `CurrencyRateSellerService`: Tỷ giá seller

---

## 11. LUỒNG THEME & SETTINGS

### 11.1. Theme Settings

**Seller có thể:**
- Chọn theme
- Cấu hình màu sắc
- Cấu hình logo
- Cấu hình banner

**Route**: `GET /admin/theme-settings`

### 11.2. Store Settings

**Settings trong MongoDB:**
- `currency`: Loại tiền tệ (VND/USD)
- `notification`: Cấu hình Telegram
- Các settings khác

---

## 12. LUỒNG JOBS & QUEUE

### 12.1. Jobs Chính

1. **JobProcessPurchase**:
   - Queue: `process_purchase`
   - Timeout: 120s
   - Xử lý đơn hàng

2. **JobDepositCustomer**:
   - Xử lý nạp tiền từ webhook
   - Cộng số dư customer

3. **JobProcessPaymentPlan**:
   - Xử lý thanh toán plan
   - Activate plan cho seller

### 12.2. Queue Configuration

- Driver: Redis (mặc định)
- Config: `config/queue.php`

---

## 13. BẢO MẬT & MIDDLEWARE

### 13.1. Middleware Stack

**Common:**
- `validate.subdomain`: Validate domain
- `tenant.mongo`: Resolve MongoDB connection
- `checkauth:{guard}`: Check authentication

**API:**
- `validate.seller.token`: Validate seller API token
- `validate.buyer.token`: Validate buyer API token

**Admin:**
- `admin.user.type`: Check user type

### 13.2. Guards

- `admin`: Admin authentication
- `seller`: Seller authentication
- `buyer`: Buyer authentication
- `seller_api`: Seller API (Sanctum)
- `buyer_api`: Buyer API (Sanctum)

---

## 14. ĐIỂM QUAN TRỌNG CẦN LƯU Ý

### 14.1. Atomic Operations
- Sử dụng MongoDB atomic operations để tránh race condition
- Redis để cache và lock

### 14.2. Error Handling
- Rollback mechanism trong JobProcessPurchase
- Comprehensive error logging

### 14.3. Multi-Tenancy
- Mỗi store có MongoDB database riêng
- Connection được resolve động
- Cache connection để tối ưu

### 14.4. Payment Security
- Webhook validation với token
- Duplicate transaction check
- Content bank parsing để identify payment

### 14.5. Account Management
- Accounts được reserve atomic
- Redis cache để tránh duplicate
- TTL 24h cho order accounts

---

## 15. FLOW DIAGRAM TÓM TẮT

### 15.1. Order Flow
```
Buyer → Checkout → Create Order (PENDING) 
  → Queue Job → Reserve Accounts → Deduct Balance 
    → Create Balance History → Update Accounts (SOLD) 
      → Update Stock → Complete Order → Send Notification
```

### 15.2. Deposit Flow
```
Buyer → Create Deposit → Generate Content Bank 
  → Transfer Money → SePay Webhook → Job Process 
    → Add Balance → Update Deposit (COMPLETED)
```

### 15.3. Plan Purchase Flow
```
Seller → Choose Plan → Create Checkout → Generate Content Bank 
  → Transfer Money → SePay Webhook (Admin) → Job Process 
    → Activate Plan → Update Checkout (COMPLETED)
```

---

## KẾT LUẬN

Dự án MMO Store là một hệ thống phức tạp với:
- ✅ Multi-tenant architecture
- ✅ Real-time order processing
- ✅ Payment integration (SePay)
- ✅ Queue-based job processing
- ✅ API support cho mobile
- ✅ Comprehensive error handling
- ✅ Atomic operations để đảm bảo data consistency

Hệ thống được thiết kế để scale và handle nhiều stores đồng thời với MongoDB per-tenant và queue system.

