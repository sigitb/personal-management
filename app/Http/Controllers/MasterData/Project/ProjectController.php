<?php

namespace App\Http\Controllers\MasterData\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    function index(Request $request) {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'array', Rule::in(['00', '01', '02'])],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = Project::when($request->search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%');
        })
        ->when($request->status, function ($query, $status) {
            $query->whereIn('status', $status);
        })
        ->whereNull('deleted_at')
        ->where('user_id', $request->user()->id)
        ->orderBy($request->sort_by ?? 'created_at', $request->sort_direction ?? 'desc')
        ->paginate($request->per_page ?? 10)
        ->withQueryString();

        return Inertia::render('MasterData/Project/Project', [
            'data' => $data->items(),
            'pagination'  => [
                 'current_page' => $data->currentPage(),
                'from' => $data->firstItem(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'to' => $data->lastItem(),
                'total' => $data->count()
            ],
            'filters' => $request->only(['search', 'status']),
            'sort' => [
                'column' => $request->get('sort_by', ''),
                'direction' => $request->get('sort_direction', 'asc'),
            ],
            'breadcrumbs' => [
                [
                    "title" => 'Dashboard',
                    "href" => '/admin-panel/dashboard'
                ],
                [
                    "title" => 'List Project',
                    "href" => '#'
                ]
            ]
        ]);
    }

    function store(Request $request) {
         $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:200'],
            'total_amount' => ['required', 'numeric'],
            'status' => ['required', 'string', Rule::in(['00', '01', '02'])],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(Project::where('name', $request->name)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'total_amount' => $request->total_amount,
            'status' => $request->status,
            'user_id' => $request->user()->id
        ]);
        return redirect()->back()->with('success', 'Data Created Successfuly');
    }

    function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:200'],
            'total_amount' => ['required', 'numeric'],
            'status' => ['required', 'string', Rule::in(['00', '01', '02'])],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(Project::where('name', $request->name)->where('id', '!=', $id)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        $data = Project::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data Not Found');
        $data->update([
            'name' => $request->name,
            'description' => $request->description,
            'total_amount' => $request->total_amount,
            'status' => $request->status
        ]);
        return redirect()->back()->with('success', 'Data Updated Successfuly');
    }
}
