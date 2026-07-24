<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'name', 'company', 'email', 'phone', 'industry', 'budget',
    'timeline', 'message', 'status', 'assigned_to', 'meeting_date',
    'notes', 'source'
])]
class Lead extends Model
{
    use HasUuids, SoftDeletes;

    /**
     * Get the user assigned to this lead.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
