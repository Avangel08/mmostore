<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title inertia>Admin | {{ config('app.name', 'Laravel') }}</title>

  @routes
  <script>
    if (typeof Ziggy !== 'undefined') {
      Ziggy.absolute = false;
      try {
        Ziggy.url = window.location.origin;
      } catch (e) {}
    }
  </script>
  @viteReactRefresh
  @vite(['resources/js/app-admin.tsx'])
  @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>


