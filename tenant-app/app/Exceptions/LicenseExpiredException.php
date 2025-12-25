<?php

declare(strict_types=1);

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

final class LicenseExpiredException extends HttpException
{
    public function __construct(
        string $message = 'License has expired or is invalid',
        ?\Throwable $previous = null,
    ) {
        parent::__construct(
            statusCode: 402, // Payment Required
            message: $message,
            previous: $previous,
        );
    }
}
