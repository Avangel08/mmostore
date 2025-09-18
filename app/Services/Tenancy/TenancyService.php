<?php

namespace App\Services\Tenancy;

use App\Models\MySQL\Stores;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * Class TenancyService
 * @package App\Services
 */
class TenancyService
{
    /** @var int TTL seconds for caching host->store mapping */
    protected int $hostStoreTtl = 600; // 10 minutes

    /** @var int TTL seconds for caching store->connection mapping */
    protected int $storeConnTtl = 900; // 15 minutes

    /**
     * Resolve a store by its host domain.
     * The Stores model is expected to have a JSON column 'domain' that contains the host.
     */
    public function resolveStoreByHost(string $host): ?Stores
    {
        if ($host === '') {
            return null;
        }

        $cacheKey = "tenant_store:host:" . $host;
        return Cache::remember($cacheKey, $this->hostStoreTtl, function () use ($host) {
            return Stores::query()->whereJsonContains('domain', $host)->first();
        });
    }

    /**
     * Build MongoDB connection config array from a Store's database_config.
     */
    public function buildConnectionFromStore(Stores $store): array
    {
        $cfg = is_array($store->database_config)
            ? $store->database_config
            : (json_decode((string) $store->database_config, true) ?? []);

        // Cache the built connection by store id + cfg hash
        $cfgHash = md5(json_encode($cfg));
        $cacheKey = "tenant_conn:store:" . $store->id . ":" . $cfgHash;

        return Cache::remember($cacheKey, $this->storeConnTtl, function () use ($cfg) {
            return $this->buildConnectionFromConfig($cfg);
        });
    }

    /**
     * Build MongoDB connection config array from raw config.
     */
    public function buildConnectionFromConfig(array $cfg): array
    {
        $host = $cfg['host'] ?? '127.0.0.1';
        $port = (int) ($cfg['port'] ?? 27017);
        $username = $cfg['user'] ?? null;
        $password = $cfg['password'] ?? null;
        $prefix = $cfg['prefix'] ?? '';
        $authDatabase = $cfg['authentication'] ?? null;
        $authMechanism = $cfg['authentication_mechanism'] ?? null;
        $dsn = $cfg['dsn'] ?? null;

        $database = $prefix !== '' ? ($prefix) : '';

        $connection = [
            'driver' => 'mongodb',
            'host' => $host,
            'port' => $port,
            'database' => $database,
            'username' => $username,
            'password' => $password,
            'options' => array_filter([
                'database' => $authDatabase,
                'authMechanism' => $authMechanism,
            ], fn($v) => !is_null($v) && $v !== ''),
        ];
        if (!empty($dsn)) {
            $connection['dsn'] = $dsn;
        }

        return $connection;
    }

    /**
     * Apply the given connection settings to the 'tenant_mongo' connection and reconnect.
     */
    public function applyConnection(array $connection, bool $setDefault = false): void
    {
        DB::purge('tenant_mongo');
        Config::set('database.connections.tenant_mongo', $connection);
        if ($setDefault) {
            Config::set('database.default', 'tenant_mongo');
        }
        DB::reconnect('tenant_mongo');
    }

    /**
     * Convenience: resolve by host and apply connection.
     */
    public function applyByHost(string $host, bool $setDefault = false): bool
    {
        $store = $this->resolveStoreByHost($host);
        if (!$store) {
            return false;
        }

        $connection = $this->buildConnectionFromStore($store);
        $this->applyConnection($connection, $setDefault);
        return true;
    }

    /** Forget cached host->store mapping */
    public function forgetHost(string $host): void
    {
        Cache::forget("tenant_store:host:" . $host);
    }

    /** Forget cached connection(s) for a store (all config versions) */
    public function forgetStoreConnections(Stores $store): void
    {
        // If using cache stores that support tags, we could tag by store id.
        // Without tags, we can forget by known current hash only.
        $cfg = is_array($store->database_config)
            ? $store->database_config
            : (json_decode((string) $store->database_config, true) ?? []);
        $cfgHash = md5(json_encode($cfg));
        Cache::forget("tenant_conn:store:" . $store->id . ":" . $cfgHash);
    }
}
