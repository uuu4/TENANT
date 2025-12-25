<?php

declare(strict_types=1);

namespace App\Services\License;

use Carbon\Carbon;

final readonly class LicenseResponse
{
    public function __construct(
        public bool $valid,
        public ?Carbon $expiresAt,
        public ?string $message = null,
        public ?array $features = null,
    ) {}

    public function isValid(): bool
    {
        return $this->valid && ($this->expiresAt === null || $this->expiresAt->isFuture());
    }

    public static function valid(Carbon $expiresAt, ?array $features = null): self
    {
        return new self(
            valid: true,
            expiresAt: $expiresAt,
            features: $features,
        );
    }

    public static function invalid(string $message): self
    {
        return new self(
            valid: false,
            expiresAt: null,
            message: $message,
        );
    }
}
