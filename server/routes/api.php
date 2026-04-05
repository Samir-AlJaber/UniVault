<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\ResourceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/semesters', [SemesterController::class, 'index']);
Route::get('/courses/{semester}', [ResourceController::class, 'getCourses']);
Route::get('/resources/{course}', [ResourceController::class, 'getResources']);

Route::post('/upload', [ResourceController::class, 'upload']);
Route::delete('/delete/{id}', [ResourceController::class, 'delete']);
Route::get('/my-resources/{user_id}', [ResourceController::class, 'getUserResources']);