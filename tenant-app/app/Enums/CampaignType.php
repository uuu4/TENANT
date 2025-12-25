<?php

declare(strict_types=1);

namespace App\Enums;

enum CampaignType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED = 'fixed';
    case BUY_X_GET_Y = 'buy_x_get_y';

    public function label(): string
    {
        return match ($this) {
            self::PERCENTAGE => 'Percentage Discount',
            self::FIXED => 'Fixed Amount',
            self::BUY_X_GET_Y => 'Buy X Get Y',
        };
    }
}
