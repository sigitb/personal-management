<?php

namespace App\Http\Controllers\MasterData\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProjectBoardController extends Controller
{
    function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
            'project_id' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = ProjectBoard::with(['project:id,name'])->when($request->search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%');
        })
            ->when($request->project_id, function ($query, $project_id) {
                return $query->where('project_id', $project_id);
            })
            ->whereNull('deleted_at')
            ->where('user_id', $request->user()->id)
            ->orderBy($request->sort_by ?? 'created_at', $request->sort_direction ?? 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        $projects = Project::select('id', 'name')->whereNull('deleted_at')->where('user_id', $request->user()->id)->get();

        return Inertia::render('MasterData/Project/ProjectBoard', [
            'projects' => $projects,
            'data' => $data->items(),
            'pagination'  => [
                'current_page' => $data->currentPage(),
                'from' => $data->firstItem(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'to' => $data->lastItem(),
                'total' => $data->count()
            ],
            'filters' => $request->only(['search']),
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
                    "title" => 'List Project Board',
                    "href" => '#'
                ]
            ]
        ]);
    }

    function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'project_id' => ['required', 'string', 'max:100'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(ProjectBoard::where('name', $request->name)->where('project_id', $request->project_id)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        ProjectBoard::create([
            'name' => $request->name,
            'project_id' => $request->project_id,
            'user_id' => $request->user()->id
        ]);
        return redirect()->back()->with('success', 'Data Created Successfuly');
    }

    function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'project_id' => ['required', 'string', 'max:100'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(ProjectBoard::where('name', $request->name)->where('project_id', $request->project_id)->where('id', '!=', $id)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        $data = ProjectBoard::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data Not Found');
        $data->update([
            'name' => $request->name,
            'project_id' => $request->project_id,
        ]);
        return redirect()->back()->with('success', 'Data Updated Successfuly');
    }

    function destroy($id) {
        $data = ProjectBoard::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data Not Found');
        $data->update([
            'deleted_at' => now()
        ]);
        return redirect()->back()->with('success', 'Data Deleted Successfuly');
    }
}
