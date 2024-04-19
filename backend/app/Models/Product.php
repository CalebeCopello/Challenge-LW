<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'price', 'description', 'category', 'image', 'rating_rate', 'rating_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
        'rating_rate' => 'decimal:1',
    ];
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            if (empty($product->image)) {
                $product->image = null;
            }
            if (empty($product->rating_rate)) {
                $product->rating_rate = 0.0;
            }
            if (empty($product->rating_count)) {
                $product->rating_count = 0;
            }
        });
    }
}
