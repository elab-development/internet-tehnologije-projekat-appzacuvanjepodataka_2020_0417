<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Company;
use App\Models\File;


class CompanyApiController extends Controller
{
     // Sve kompanije koje user ima prisustvo
     public function index()
     {
         $companies = auth()->user()->companies;
         return response()->json($companies);
     }
 
     // Prikazi jednu kompaniju i njene fajlove
     public function show(Company $company)
     {
         $this->authorize('view', $company);
         $company->load('files'); // Pretpostavlja da su fajlovi u vezi sa COmpany modelom
 
         return response()->json($company);
     }
 
     // Kreiranje nove kompanije
     public function store(Request $request)
     {
         $request->validate([
             'name' => 'required|string|max:255',
         ]);
 
         $company = Company::create([
             'name' => $request->name,
             'admin_id' => auth()->id(),
             'created_by' => auth()->id(),
         ]);
         
         // Kacenje admina za kompaniju
        $company->members()->attach(auth()->id());
 
         return response()->json([
             'message' => 'Company created successfully',
             'company' => $company,
         ], 201);
     }

     // Azuriranje postojece kompanije
    public function update(Request $request, Company $company)
    {
        $this->authorize('manage', $company);
        
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $company->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Company updated successfully',
            'company' => $company,
        ]);
    }

    // Brisanje kompanije
    public function destroy(Company $company)
    {
        $this->authorize('manage', $company);

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }

}
