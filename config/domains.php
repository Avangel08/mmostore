<?php

return [
    // Base domain without subdomain, e.g., "mmostore.local" for local, "mmostore.com" for prod
    'base' => env('APP_BASE_DOMAIN', 'mmostore.local'),

    // Optional: list of domains to bind routes to (comma-separated). Defaults to [base]
    'hosts' => array_filter(array_map('trim', explode(',', env('APP_DOMAINS', '')))) ?: [env('APP_BASE_DOMAIN', 'mmostore.local')],
];


