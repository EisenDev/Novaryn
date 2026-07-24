<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'name', 'setup_price', 'monthly_price', 'description',
    'features', 'recommended', 'button_text', 'sort_order', 'visible'
])]
class PricingPackage extends Model
{
    use HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'recommended' => 'boolean',
            'visible' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
