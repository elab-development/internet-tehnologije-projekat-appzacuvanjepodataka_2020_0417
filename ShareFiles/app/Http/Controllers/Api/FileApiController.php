<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Models\File;
use App\Models\Company;
use Google\Client as Google_Client;
use Google\Service\Drive as Google_Service_Drive;

class FileApiController extends Controller
{
    /*
    private $driveService;

    
    public function __construct()
    {
        $client = new Google_Client();
        $client->setAuthConfig(storage_path('app/google/credentials.json'));
        $client->addScope(Google_Service_Drive::DRIVE);
        $this->driveService = new Google_Service_Drive($client);
    }
    */
    // Izlistaj sve fajlove za kompaniju
    public function listFiles($companyName)
    {
        $company = Company::where('name', $companyName)->first();

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json([$company->files]);
    }

    // Upload-ovanje fajla za kompaniju
    public function uploadFile(Request $request, $companyName)
    {
        $company = Company::where('name', $companyName)->firstOrFail();
        $this->authorize('view', $company);

        $request->validate([
            'file' => 'required|file',
        ]);

        // Id foldera iz okruzenja
        $folderId = env('GOOGLE_DRIVE_FOLDER_ID');

        // Upload na Google Drive
        $file = $request->file('file');

        $fileName = $file->getClientOriginalName();
        $googleDriveFileId = Storage::disk('google')->putFileAs($folderId, $file, $fileName);

        /*
        $fileMetadata = new \Google_Service_Drive_DriveFile([
            'name' => $file->getClientOriginalName(),
            'parents' => [$folderId]
        ]);

        $uploadedFile = $this->driveService->files->create(
            $fileMetadata,
            [
                'data' => file_get_contents($file->getPathname()),
                'mimeType' => $file->getMimeType(),
                'uploadType' => 'multipart'
            ]
        );
        */
        
        // Cuvanje detalja fajla u memoriju
        File::create([
            'company_id' => $company->id,
            'name' => $file->getClientOriginalName(),
            'google_drive_id' => $googleDriveFileId,
            'uploaded_by' => auth()->id(),
            'permissions' => [], // Dodavanje logike za dozvole
        ]);

        return response()->json(['message' => 'File uploaded successfully.'], 201);
    }

    // Skidanje fajla za kompaniju
    public function downloadFile($companyName, $fileName)
    {
        $company = Company::where('name', $companyName)->firstOrFail();
        $file = File::where('name', $fileName)->firstOrFail();

        $this->authorize('view', $company);

        $fileContent = Storage::disk('google')->get($file->google_drive_id);

        return response($fileContent)
            ->header('Content-Type', 'application/octet-stream')
            ->header('Content-Disposition', 'attachment; filename="'.$file->name.'"');
  
    }

    // Brisanje fajla za kompaniju
    public function removeFile($companyName, $fileName)
    {
        $company = Company::where('name', $companyName)->firstOrFail();
        $file = File::where('name', $fileName)->firstOrFail();

        //$this->authorize('manage', $company);

         // Osigurati da fajlovi pripadaju kompaniji
         if ($file->company_id !== $company->id) {
            abort(403, 'Unauthorized action.');
        }

        // Brisanje fajlova sa Google Drive
        $disk = Storage::disk('google');

        if ($disk->exists($file->google_drive_id)) {
            $disk->delete($file->google_drive_id);
        } else {
            return redirect()->route('companies.show', $company)->with('error', 'File not found on Google Drive.');
        }

        // Brisanje fajlova sacuvanih na memoriji
        $file->delete();

        return response()->json(['message'=>'File removed successfully.']);
    }
}
