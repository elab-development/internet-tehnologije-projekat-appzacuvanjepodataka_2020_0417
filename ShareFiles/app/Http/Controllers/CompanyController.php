<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;

class CompanyController extends Controller
{
    /**
     * Prikazi listu kompanija
     */
    public function index()
    {
        $companies = auth()->user()->companies;
        return view('companies.index', compact('companies'));
    }

    /**
     * Prikazivanje forme za kreiranje nove kompanije
     */
    public function create()
    {
        return view('companies.create');
    }

    /**
     * Smestanje nove kompanije u bazu
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $company = Company::create([
            'name' => $request->name,
            'admin_id' => auth()->id(),
        ]);

        // Povezivanje admina sa kompanijom
        $company->members()->attach(auth()->id());

        return redirect()->route('companies.index')->with('status', 'Company created successfully.');
    }

    /**
     * Brisanje kompanije iz memorije
     */
    public function destroy(Company $company)
    {
        $this->authorize('manage', $company);

        $company->delete();

        return redirect()->route('companies.index')->with('status', 'Company removed successfully.');
    }

     /**
     *  Prikazivanje kompanije i njene usere
     */
    public function show(Company $company)
    {
        $this->authorize('view', $company); // User moze da vidi kompaniju

        $users = User::all(); // User moze da doda/izbrise usere
        $files = $company->files;

        return view('companies.show', compact('company', 'users', 'files'));
    }

     /**
     * Dodavanje usera u kompaniju
     */
    public function addUser(Request $request, Company $company)
    {
        $this->authorize('manage', $company); // User moze da upravlja kompanijom

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $company->members()->attach($request->user_id);

        return redirect()->route('companies.show', $company)->with('status', 'User added successfully.');
    }

    /**
     * Usklanjanje usera iz kompanije
     */
    public function removeUser(Company $company, User $user)
    {
        $this->authorize('manage', $company); // User moze da upravlja kompanijom

        $company->members()->detach($user->id);

        return redirect()->route('companies.show', $company)->with('status', 'User removed successfully.');
    }

    public function uploadFile(Request $request, Company $company)
    {
        $this->authorize('view', $company);

        $request->validate([
            'file' => 'required|file',
        ]);

        // Folder id iz okruzenja
        $folderId = env('GOOGLE_DRIVE_FOLDER_ID');

        // Upload na Google Drive
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $googleDriveFileId = Storage::disk('google')->putFileAs($folderId, $file, $fileName);

        // Skradisti podatke u bazu
        File::create([
            'company_id' => $company->id,
            'name' => $fileName,
            'google_drive_id' => $googleDriveFileId,
            'uploaded_by' => auth()->id(),
            'permissions' => [], // Dodaj logiku za dozvole ako je potrebno
        ]);

        return redirect()->route('companies.show', $company)->with('status', 'File uploaded successfully.');
    }

    public function downloadFile(File $file)
    {
        $this->authorize('view', $file->company);

        $fileContent = Storage::disk('google')->get($file->google_drive_id);

        return response($fileContent)
            ->header('Content-Type', 'application/octet-stream')
            ->header('Content-Disposition', 'attachment; filename="'.$file->name.'"');
    }

    public function destroyFile(Company $company, File $file)
    {
        $this->authorize('manage', $company);

        // Omoguciti da fajlovi pripadaju kompaniji
        if ($file->company_id !== $company->id) {
            abort(403, 'Unauthorized action.');
        }

        // Brisanje fajlova iz baze
        $file->delete();

        // Brisanje fajlova sa Google Drive
        $disk = Storage::disk('google');

        if ($disk->exists($file->google_drive_id)) {
            $disk->delete($file->google_drive_id);
        } else {
            return redirect()->route('companies.show', $company)->with('error', 'File not found on Google Drive.');
        }

        

        return redirect()->route('companies.show', $company)->with('status', 'File removed successfully.');
    }
}