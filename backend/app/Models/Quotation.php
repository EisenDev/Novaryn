<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Quotation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'client_name',
        'client_email',
        'client_phone',
        'client_address',
        'downpayment',
        'plan_id',
        'build_total',
        'monthly_total',
        'notes',
        'include_maintenance',
        'status',
        'pending_deletion_at',
        'pending_deletion_by',
        'pending_deletion_reason',
    ];

    protected $casts = [
        'include_maintenance' => 'boolean',
        'downpayment' => 'integer',
        'pending_deletion_at' => 'datetime',
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

    public function quotationModules()
    {
        return $this->hasMany(QuotationModule::class);
    }
}
