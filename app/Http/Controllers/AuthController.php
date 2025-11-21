<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{
    function login() {
        if(Auth::check()) return redirect()->route('admin_panel.dashboard');
        return Inertia::render('Auth/Login');
    }

    function processLogin(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required'],
            'remember' => ['required', 'boolean']
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(User::where('email', $request->email)->whereNull('deleted_at')->doesntExist()) return redirect()->back()->with('error', 'User not found');

        $credential = $request->only('email', 'password');
        $attempt = Auth::attempt($credential, $request->remember);

        return redirect()->route('admin_panel.dashboard')->with('success', 'Login Successfuly');
    }

    function register() {
        return Inertia::render('Auth/Register');
    }

    function processRegister(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());        

        if(User::where('email', $request->email)->exists()) return redirect()->back()->with('error', 'Email already exists');
        
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return redirect()->route('auth.login')->with('success', 'Registration Successfuly');
    }

    function logout() {
        Auth::logout();
        return redirect()->route('auth.login')->with('success', 'Logout Successfuly');
    }
}
