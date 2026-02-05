<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - MMOStore</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f8f9ff 0%, #e8ebf7 100%);
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            background: #ffffff;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(45deg, #4F46E5, #7C3AED);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }

        .logo {
            max-width: 180px;
            height: auto;
        }

        .logo-tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 24px;
            color: #2D3748;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .message {
            color: #4A5568;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
        }

        .cta-container {
            text-align: center;
            margin: 40px 0;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, #10B981, #059669);
            color: #ffffff !important;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            background: linear-gradient(45deg, #059669, #047857);
            color: #ffffff !important;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
            transform: translateY(-1px);
        }

        .security-note {
            background: #F7FAFC;
            border-left: 4px solid #10B981;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }

        .security-note p {
            color: #2D3748;
            font-size: 14px;
            margin: 0;
        }

        .footer {
            background: #F8F9FA;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
        }

        .footer-text {
            color: #718096;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .social-links {
            margin-top: 15px;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #4F46E5;
            text-decoration: none;
            font-size: 12px;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #E2E8F0, transparent);
            margin: 30px 0;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 12px;
            }

            .header,
            .content,
            .footer {
                padding: 20px;
            }

            .logo {
                max-width: 150px;
            }

            .greeting {
                font-size: 20px;
            }

            .cta-button {
                padding: 14px 24px;
                font-size: 17px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="{{ asset('images/logo/mmoshop.png') }}" alt="MMOStore" class="logo">
        </div>

        <div class="content">
            <h1 class="greeting">Xin chào {{ $data['first_name'] ?? "bạn" }}! 👋</h1>

            <p class="message">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản MMOStore của bạn.
                Để bảo mật tài khoản, vui lòng nhấp vào nút bên dưới để tạo mật khẩu mới.
            </p>

            <div class="cta-container">
                <a href="{{ $data['url'] ?? '' }}" class="cta-button">
                    Đặt lại mật khẩu ngay
                </a>
            </div>

            <div class="security-note">
                <p><strong>🛡️ Lưu ý bảo mật:</strong></p>
                <p>• Link này chỉ có hiệu lực trong 60 phút</p>
                <p>• Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</p>
                <p>• Không chia sẻ link này với bất kỳ ai khác</p>
            </div>

            <div class="divider"></div>

            @if (!empty($url))
                <p class="message">
                    Nếu bạn gặp khó khăn khi nhấp vào nút trên, bạn có thể sao chép và dán link sau vào trình duyệt:
                </p>
                <p
                    style="word-break: break-all; color: #10B981; font-size: 14px; background: #F7FAFC; padding: 10px; border-radius: 4px;">
                    {{ $url }}
                </p>
            @endif
        </div>

        <div class="footer">
            <p class="footer-text">
                © {{ date('Y') }} <strong>MMOStore</strong>
            </p>
        </div>
    </div>
</body>

</html>