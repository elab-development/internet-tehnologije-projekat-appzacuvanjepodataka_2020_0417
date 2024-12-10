<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'admin_id',
    ];

    /**
     * Useri koji pripadaju kompaniji
     */
    public function members()
    {
        return $this->belongsToMany(User::class, 'company_user')->withTimestamps();
    }

    /**
     * Admin kompanije
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }
}
