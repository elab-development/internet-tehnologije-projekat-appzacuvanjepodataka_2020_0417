<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;

class CompanyPolicy
{
    /**
     * Kreiranje polise - kao pasos za usera
     */
    public function __construct()
    {
        //
    }

      /**
     * Da li odredjenu kompaniju moze da menadzuje user
     */
    public function manage(User $user, Company $company)
    {
        return $user->id === $company->admin_id;
    }

    /**
     * Da li user moze da vidi kompaniju kao clan 
     */
    
    public function view(User $user, Company $company)
    {
        // Ova polisa dozvoljava upravljanje firmom u zavisnosti od role usera
        return $company->members()->where('user_id', $user->id)->exists() || $user->id === $company->admin_id;
    }

}
