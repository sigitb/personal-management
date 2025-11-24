<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterData\Finance\FinanceCategoryController;
use App\Http\Controllers\MasterData\Finance\FinanceTypeController;
use App\Http\Controllers\MasterData\Project\ProjectBoardController;
use App\Http\Controllers\MasterData\Project\ProjectController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Transaction\PersonalController;
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
    // finance
    Route::prefix('finance')->name('finance.')->group(function(){
        Route::resource('type', FinanceTypeController::class);
        Route::resource('category', FinanceCategoryController::class);
    });
    // project
    Route::prefix('project')->name('project.')->group(function(){
        Route::resource('base', ProjectController::class);
        Route::resource('board', ProjectBoardController::class);
    });
    // transactions
    Route::prefix('transaction')->name('transaction')->group(function(){
        Route::resource('personal', PersonalController::class);
    });

});


