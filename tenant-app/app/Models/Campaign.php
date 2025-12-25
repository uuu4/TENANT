<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CampaignType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Campaign extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'discount_value',
        'conditions',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => CampaignType::class,
            'discount_value' => 'decimal:2',
            'conditions' => 'array',
            'starts_at' => 'date',
            'ends_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now());
    }

    public function isCurrentlyActive(): bool
    {
        return $this->is_active
            && $this->starts_at <= now()
            && $this->ends_at >= now();
    }

    public function calculateDiscount(float $originalPrice, int $quantity = 1): float
    {
        if (!$this->isCurrentlyActive()) {
            return 0;
        }

        return match ($this->type) {
            CampaignType::PERCENTAGE => $originalPrice * ($this->discount_value / 100),
            CampaignType::FIXED => min($this->discount_value, $originalPrice),
            CampaignType::BUY_X_GET_Y => $this->calculateBuyXGetYDiscount($originalPrice, $quantity),
        };
    }

    private function calculateBuyXGetYDiscount(float $originalPrice, int $quantity): float
    {
        $buyX = $this->conditions['buy'] ?? 2;
        $getY = $this->conditions['get'] ?? 1;
        
        $freeItems = intdiv($quantity, $buyX + $getY) * $getY;
        
        return $freeItems * $originalPrice;
    }
}
