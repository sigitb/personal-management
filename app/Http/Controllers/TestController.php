<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    public function index(Request $request)
    {
        $users = [
            [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'KZ0dX@example.com',
                'created_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'Jane Doe 1',
                'email' => 'janeKZ0dX@example.com',
                'created_at' => now()->subDay(1)
            ],
            [
                'id' => 3,
                'name' => 'John Doe2',
                'email' => 'KZ0dX@example.com',
                'created_at' => now()->subDay(2)
            ],
            [
                'id' => 4,
                'name' => 'Jane Doe 3',
                'email' => 'janeKZ0dX@example.com',
                'created_at' => now()->subDay(3)
            ],
        ];

        return Inertia::render('User', [
            'users' => $users,
            'pagination' => [
                'current_page' => 1,
                'from' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'to' => 4,
                'total' => count($users)
            ],
            'filters' => $request->only(['email', 'name']),
            'sort' => [
                'column' => $request->get('sort_by', ''),
                'direction' => $request->get('sort_direction', 'asc'),
            ],
        ]);
    }
}
