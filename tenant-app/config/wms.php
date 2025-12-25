<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | WMS API URL
    |--------------------------------------------------------------------------
    |
    | The base URL for the Warehouse Management System API.
    |
    */
    'api_url' => env('WMS_API_URL', 'https://wms.example.com/api'),

    /*
    |--------------------------------------------------------------------------
    | WMS API Key
    |--------------------------------------------------------------------------
    |
    | Authentication key for WMS API requests.
    |
    */
    'api_key' => env('WMS_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Webhook Secret
    |--------------------------------------------------------------------------
    |
    | Secret key for validating incoming webhook requests from WMS.
    |
    */
    'webhook_secret' => env('WMS_WEBHOOK_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Sync Interval (minutes)
    |--------------------------------------------------------------------------
    |
    | How often to run the scheduled stock/price sync job.
    | Default: 5 minutes
    |
    */
    'sync_interval' => env('WMS_SYNC_INTERVAL', 5),

    /*
    |--------------------------------------------------------------------------
    | Batch Size
    |--------------------------------------------------------------------------
    |
    | Number of records to process in each batch during sync.
    |
    */
    'batch_size' => env('WMS_BATCH_SIZE', 100),

    /*
    |--------------------------------------------------------------------------
    | Timeout (seconds)
    |--------------------------------------------------------------------------
    |
    | HTTP timeout for WMS API requests.
    |
    */
    'timeout' => env('WMS_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Retry Attempts
    |--------------------------------------------------------------------------
    |
    | Number of times to retry failed WMS API requests.
    |
    */
    'retry_attempts' => env('WMS_RETRY_ATTEMPTS', 3),

    /*
    |--------------------------------------------------------------------------
    | Retry Delay (seconds)
    |--------------------------------------------------------------------------
    |
    | Delay between retry attempts.
    |
    */
    'retry_delay' => env('WMS_RETRY_DELAY', 60),
];
