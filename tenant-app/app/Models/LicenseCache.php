<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class LicenseCache extends Model
{
    use HasFactory;

    protected $table = 'license_cache';

    protected $fillable = [
        'license_key',
        'status',
        'expires_at',
        'last_checked_at',
        'grace_until',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'last_checked_at' => 'datetime',
            'grace_until' => 'datetime',
        ];
    }

    public function isValid(): bool
    {
        return $this->status === 'valid' && 
               ($this->expires_at === null || $this->expires_at->isFuture());
    }

    public function isInGracePeriod(): bool
    {
        return $this->grace_until !== null && $this->grace_until->isFuture();
    }

    public function shouldRevalidate(): bool
    {
        if ($this->last_checked_at === null) {
            return true;
        }

        $cacheTtl = config('license.cache_ttl', 3600);
        return $this->last_checked_at->addSeconds($cacheTtl)->isPast();
    }
}
