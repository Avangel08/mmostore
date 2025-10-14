<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Đăng ký cửa hàng thành công</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #111827; }
        .container { max-width: 640px; margin: 0 auto; padding: 24px; }
        .btn { display: inline-block; background: #2563eb; color: #fff !important; padding: 10px 16px; border-radius: 6px; text-decoration: none; }
        .muted { color: #6b7280; font-size: 12px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
    </style>
    </head>
<body>
<div class="container">
    <h2>Chúc mừng bạn đã đăng ký cửa hàng thành công 🎉</h2>
    <div class="card">
        <p><strong>Cửa hàng:</strong> {{ $store_name ?? '' }}</p>
        <p><strong>Tên miền:</strong> <a href="{{ $redirect_url ?? '' }}" target="_blank">{{ $domain ?? '' }}</a></p>
        <p><strong>Tài khoản:</strong> {{ $email ?? '' }}</p>
        <p>Bạn có thể truy cập trang quản trị bằng nút bên dưới.</p>
        <p>
            <a class="btn" href="{{ $redirect_url ?? '' }}" target="_blank">Vào trang quản trị</a>
        </p>
    </div>
    <p class="muted">Nếu bạn không thực hiện thao tác này, vui lòng bỏ qua email.</p>
</div>
</body>
</html>


