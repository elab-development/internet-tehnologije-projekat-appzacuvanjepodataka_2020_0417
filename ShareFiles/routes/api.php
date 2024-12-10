<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\Api\CompanyApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\FileApiController;



Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/companies', [CompanyApiController::class, 'index']);        // Izlistaj sve kompanije
    Route::get('/companies/{company}', [CompanyApiController::class, 'show']); // Prikazi jednu kompaniju
    Route::post('/companies', [CompanyApiController::class, 'store']);        // Kreiraj novu kompaniju
    Route::put('/companies/{company}', [CompanyApiController::class, 'update']); // Azuriraj kompaniju
    Route::delete('/companies/{company}', [CompanyApiController::class, 'destroy']); // Izbrisi kompaniju

    // User-povezane rute
    Route::post('/companies/{companyName}/add-user', [UserApiController::class, 'addUser']); 
    Route::delete('/companies/{companyName}/remove-user/{userId}', [UserApiController::class, 'removeUser']);
    Route::get('/companies/{companyName}/users', [UserApiController::class, 'getUsersByCompany']);

    // File-povezane rute
    Route::get('/companies/{companyName}/files', [FileApiController::class, 'listFiles']);
    Route::post('/companies/{companyName}/upload', [FileApiController::class, 'uploadFile']);
    Route::get('/companies/{companyName}/files/{fileName}', [FileApiController::class, 'downloadFile']);
    Route::delete('/companies/{companyName}/files/{fileName}', [FileApiController::class, 'removeFile']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



