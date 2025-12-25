<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | License Key
    |--------------------------------------------------------------------------
    |
    | This is the unique license key assigned to this tenant installation.
    | It is validated against the central SaaS Provider API.
    |
    */
    'key' => env('LICENSE_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Provider URL
    |--------------------------------------------------------------------------
    |
    | The base URL of the central SaaS Provider API for license validation
    | and update checks.
    |
    */
    'provider_url' => env('LICENSE_PROVIDER_URL', 'https://provider.example.com'),

    /*
    |--------------------------------------------------------------------------
    | Validation Endpoint
    |--------------------------------------------------------------------------
    |
    | The specific endpoint for license validation on the provider.
    |
    */
    'validation_endpoint' => '/api/v1/license/validate',

    /*
    |--------------------------------------------------------------------------
    | Cache TTL (seconds)
    |--------------------------------------------------------------------------
    |
    | How long to cache a successful license validation response.
    | Default: 1 hour (3600 seconds)
    |
    */
    'cache_ttl' => env('LICENSE_CACHE_TTL', 3600),

    /*
    |--------------------------------------------------------------------------
    | Grace Period (hours)
    |--------------------------------------------------------------------------
    |
    | If the license server is unreachable, allow the application to
    | continue operating for this many hours using the last known valid state.
    | Default: 72 hours (3 days)
    |
    */
    'grace_period_hours' => env('LICENSE_GRACE_PERIOD_HOURS', 72),

    /*
    |--------------------------------------------------------------------------
    | Timeout (seconds)
    |--------------------------------------------------------------------------
    |
    | HTTP timeout for license validation requests.
    |
    */
    'timeout' => env('LICENSE_TIMEOUT', 10),
];
