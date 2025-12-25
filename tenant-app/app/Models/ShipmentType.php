<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class ShipmentType extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'base_cost',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'base_cost' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
