<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
  <title inertia>Admin MMO Store</title>

  <meta name="csrf-token" content="{{ csrf_token() }}">

  @routes
  @viteReactRefresh
  @vite(['resources/js/app-admin.tsx'])
  @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>


