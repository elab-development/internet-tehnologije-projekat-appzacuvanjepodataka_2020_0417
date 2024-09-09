<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;

class UserApiController extends Controller
{
    // Dodaj usera u kompaniju
    public function addUser(Request $request, $companyName)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

       

        $user = User::where('email', $request->email)->first();
        $company = Company::where('name', $companyName)->first();

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        // Dodaj usera u kompaniju (pretpostavlja vise-vise veza)
        $company->members()->attach($user->id);

        return response()->json(['message' => 'User added to company']);
    }

    // Brisanje usera iz kompanije
    public function removeUser($companyName, $userId)
    {
        $company = Company::where('name', $companyName)->first();
        $user = User::find($userId);

        $this->authorize('manage', $company);

        if (!$company || !$user) {
            return response()->json(['message' => 'Company or User not found'], 404);
        }

        // Brisanje usera iz kompanije (veza vise-vise)
        $company->members()->detach($user->id);

        return response()->json(['message' => 'User removed from company']);
    }

    public function getUsersByCompany($companyName)
    {
        // Pretrpostavlja da je 'companyName' jedinstveno i da moze da se nadje kompanija po imenu
        $company = Company::where('name', $companyName)->first();

        $this->authorize('view', $company);
        $company->load('members'); // Pretpostavka da je 'users' veza u Company modelu

        return response()->json($company);
    }
}
