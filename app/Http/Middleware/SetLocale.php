<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $lang = $request->query('lang') ?? $request->header('X-Locale') ?? $request->cookie('I18N_LANGUAGE', $request->cookie('locale'));

        if (!$lang) {
            $lang = $request->getPreferredLanguage(['vi', 'en']);
        }

        $supported = ['vi', 'en'];

        if (!in_array($lang, $supported, true)) {
            $lang = config('app.fallback_locale', 'en');
        }

        $lang = 'vi';

        App::setLocale($lang);

        $response = $next($request);

        if ($request->has('lang') || $request->header('X-Locale')) {
            $response->cookie('I18N_LANGUAGE', $lang, 60 * 24 * 365);
        }

        return $response;
    }
}
