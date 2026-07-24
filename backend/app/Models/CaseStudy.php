<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'project_id', 'statistics', 'results', 'challenges',
    'solutions', 'client_feedback', 'client_author', 'client_role'
])]
class CaseStudy extends Model
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
            'statistics' => 'array',
        ];
    }

    /**
     * Get the project that owns the case study.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
