<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>404 - Page Not Found</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <style>
        body {
            font-family: 'Figtree', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .error-container {
            text-align: center;
            background: white;
            border-radius: 25px;
            padding: 60px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            max-width: 1000px;
            width: 95%;
        }
        
        .error-image {
            width: 100%;
            max-width: 1000px;
            height: auto;
            margin-bottom: 40px;
        }
        
        .error-message {
            font-size: 1.3rem;
            color: #718096;
            margin-bottom: 40px;
            line-height: 1.7;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <img src="{{ Vite::asset('resources/images/error400-cover.png') }}" alt="404 Error" class="error-image">

        <p class="error-message">
            Oops! The page you're looking for doesn't exist or the store is not found.
        </p>
    </div>
</body>
</html>
