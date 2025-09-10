<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Priority: explicit ?lang -> header X-Locale -> cookie I18N_LANGUAGE/locale -> config default
        $lang = $request->query('lang');

        if (!$lang) {
            $lang = $request->header('X-Locale');
        }

        if (!$lang) {
            $lang = $request->cookie('I18N_LANGUAGE', $request->cookie('locale'));
        }

        if (!$lang) {
            $lang = config('app.locale');
        }

        // Normalize to supported locales
        $supported = ['vi', 'en'];
        if (!in_array($lang, $supported, true)) {
            $lang = config('app.fallback_locale', 'en');
        }

        App::setLocale($lang);

        // Persist cookie if `lang` query provided
        $response = $next($request);
        if ($request->has('lang')) {
            return $response->cookie('I18N_LANGUAGE', $lang, 60 * 24 * 365); // 1 year
        }

        return $response;
    }
}


