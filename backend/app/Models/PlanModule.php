<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PlanModule extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'plan_id',
        'category',
        'name',
        'build_price',
        'monthly_price',
        'complexity_score',
        'is_required',
        'enabled_by_default',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'enabled_by_default' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
