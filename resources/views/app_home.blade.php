<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>MMO Shop</title>

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
        
        <meta
            name="description"
            content="Tạo shop MMO của riêng bạn trong 5 phút"
        />
        <meta name="author" content="MMO Shop" />

        <!-- Open Graph meta tags -->
        <meta property="og:title" content="MMO Shop" />
        <meta property="og:description" content="Tạo shop MMO của riêng bạn trong 5 phút" />
        <meta property="og:image" content="{{ asset('storage/images/logo-dark.png') }}" />
        <meta property="og:url" content="https://mmostore.local" />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="MMO Shop" />

        <!-- Twitter card tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MMO Shop" />
        <meta name="twitter:description" content="Tạo shop MMO của riêng bạn trong 5 phút" />
        <meta name="twitter:image" content="{{ asset('storage/images/logo-dark.png') }}" />

        <meta name="robots" content="index, follow" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app-home.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
    </html>


