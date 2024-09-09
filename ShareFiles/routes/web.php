<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

use Google\Client as Google_Client;
use Google\Service\Drive as Google_Service_Drive;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

 

// Breeze-ove rutine za laravelov interfejsa dashboarda, login, register ... 
/*
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

*/


 //Stranica kompanije i funkcionalnosti za nju create, destroy, store...

 /*
Route::middleware(['auth'])->group(function () {
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::get('/companies/create', [CompanyController::class, 'create'])->name('companies.create');
    Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
});
*/

//Manage na stranici company, usera i dodavanje brisanje fajlova 
/*
Route::middleware(['auth'])->group(function () {
    Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
    Route::post('/companies/{company}/users', [CompanyController::class, 'addUser'])->name('companies.addUser');
    Route::delete('/companies/{company}/users/{user}', [CompanyController::class, 'removeUser'])->name('companies.removeUser');

    Route::post('/companies/{company}/files', [CompanyController::class, 'uploadFile'])->name('companies.uploadFile');
    Route::get('/files/{file}/download', [CompanyController::class, 'downloadFile'])->name('companies.downloadFile');
    Route::delete('/companies/{company}/files/{file}', [CompanyController::class, 'destroyFile'])->name('companies.destroyFile');
});
*/

//Rute za dobijanje Google API tokena 


Route::get('oauth/google', function () {
    $client = new Google_Client();
    $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
    $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
    $client->setRedirectUri('http://localhost:8001/oauth/google/callback');
    $client->addScope(Google_Service_Drive::DRIVE);

    return redirect()->away($client->createAuthUrl());
});

Route::get('oauth/google/callback', function () {
    $client = new Google_Client();
    $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
    $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
    $client->setRedirectUri('http://localhost:8001/oauth/google/callback');

    $client->fetchAccessTokenWithAuthCode(request('code'));
    $token = $client->getAccessToken();

    dd($token); // Save the 'refresh_token' from this output to your .env file.
});

Route::get('/{any}', function () {
    return view('react-app');
})->where('any', '.*');

