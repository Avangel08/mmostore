<?php

namespace App\Http\Middleware;

use App\Models\MySQL\Stores;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantMongo
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        // Expect sub.domain.tld, take first label as subdomain
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;

        if ($subdomain) {
            $store = Stores::query()->where('domain', $subdomain)->first();
            if ($store && is_array($store->database_config)) {
                $cfg = $store->database_config;

                $host = $cfg['host'] ?? '127.0.0.1';
                $port = (int)($cfg['port'] ?? 27017);
                $username = $cfg['user'] ?? null;
                $password = $cfg['password'] ?? null;
                $prefix = $cfg['prefix'] ?? '';
                $authDatabase = $cfg['authentication'] ?? null; // auth database name
                $authMechanism = $cfg['authentication_mechanism'] ?? 'SCRAM-SHA-256';
                $dsn = $cfg['dsn'] ?? null;

                // Derive database name from prefix and subdomain if provided
                $database = $prefix !== '' ? ($prefix.'_'.$subdomain) : $subdomain;

                $connection = [
                    'driver' => 'mongodb',
                    'host' => $host,
                    'port' => $port,
                    'database' => $database,
                    'username' => $username,
                    'password' => $password,
                    'options' => array_filter([
                        // Match typical Laravel Mongo config keys
                        'database' => $authDatabase,
                        'authMechanism' => $authMechanism,
                    ], fn($v) => !is_null($v) && $v !== ''),
                ];

                if (!empty($dsn)) {
                    $connection['dsn'] = $dsn;
                }

                Config::set('database.connections.tenant_mongo', $connection);
            }
        }

        return $next($request);
    }
}


