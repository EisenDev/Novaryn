<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'title', 'slug', 'description', 'industry', 'cover_image',
    'gallery', 'tech_stack', 'features', 'status', 'seo_title', 'seo_description'
])]
class Project extends Model
{
    use HasUuids, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'tech_stack' => 'array',
            'features' => 'array',
        ];
    }

    /**
     * Get the case study associated with the project.
     */
    public function caseStudy(): HasOne
    {
        return $this->hasOne(CaseStudy::class);
    }
}
