<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterData\Finance\FinanceTypeController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect()->route('auth.login');
});

Route::get('/login', function () {
    return redirect()->route('auth.login');
})->name('login');

Route::prefix('auth')->name('auth.')->controller(AuthController::class)->group(function(){
    Route::get('/login', 'login')->name('login');
    Route::post('login', 'processLogin')->name('process.login');
    Route::get('/register', 'register')->name('register');
    Route::post('register', 'processRegister')->name('process.register');
    Route::get('logout', 'logout')->middleware('auth')->name('logout');
});

Route::middleware(['auth'])->prefix('admin-panel')->name('admin_panel.')->group(function(){
    Route::get('/dashboard',[TestController::class,'index'])->name('dashboard');

    // master-data
    // finance type
    Route::prefix('finance')->name('finance.')->group(function(){
        Route::resource('type', FinanceTypeController::class);
    });

});


