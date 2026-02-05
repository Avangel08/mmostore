@php
    $settings = \App\Models\Mongo\Settings::where('auto_load', true)->get();
    $result = [];
    foreach ($settings as $setting) {
        $result[$setting->key] = $setting->value;
    }
    $store = app('store');
    $domainSuffix = config('app.domain_suffix');

    $matchedDomain = collect($store->domain)
        ->first(fn($d) => str_contains($d, $domainSuffix));

    $domain = $matchedDomain ? "https://{$matchedDomain}" : null;
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
        <title inertia>{{ $result['storeName'] ?? '' }}</title>
        <meta
            name="description"
            content="{{ $result['metaDescription'] ?? '' }}"
        />
        <meta name="author" content="{{ $result['storeName'] ?? '' }}" />

        <!-- Open Graph meta tags -->
        <meta property="og:title" content="{{ $result['storeName'] ?? '' }}" />
        <meta property="og:description" content="{{ $result['metaDescription'] ?? '' }}" />
        <meta property="og:image" content="{{ asset('storage/' . ($result['storeLogo'] ?? '')) }}" />
        <meta property="og:url" content="{{ $domain }}" />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="{{ $result['storeName'] ?? ''}}" />

        <!-- Twitter card tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $result['storeName'] ?? '' }}" />
        <meta name="twitter:description" content="{{ $result['metaDescription'] ?? '' }}" />
        <meta name="twitter:image" content="{{ asset('storage/' . ($result['storeLogo'] ?? '')) }}" />

        <meta name="robots" content="index, follow" />

        <meta name="csrf-token" content="{{ csrf_token() }}">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app-buyer.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
    </html>


