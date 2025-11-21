<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return redirect('auth/login')->with('success', 'test');
});
Route::prefix('auth')->name('auth')->group(function(){
    Route::get('/login', function(){
        return Inertia::render('Auth/Login');
    });
    Route::get('/register', function(){
        return Inertia::render('Auth/Register');
    });
});

Route::get('/dashboard',[TestController::class,'index']);

