<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'invoice_number', 'client_name', 'client_email', 'amount',
    'type', 'status', 'due_date', 'paid_at', 'project_id'
])]
class Invoice extends Model
{
    use HasUuids;

    /**
     * Get the project associated with the invoice.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
