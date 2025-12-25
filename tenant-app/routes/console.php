<?php

declare(strict_types=1);

use App\Jobs\WmsSyncStockJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes / Scheduler
|--------------------------------------------------------------------------
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Jobs
|--------------------------------------------------------------------------
*/

// WMS Stock Sync - Every 5 minutes
Schedule::job(new WmsSyncStockJob())
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onOneServer();
