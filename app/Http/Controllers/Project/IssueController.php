<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectBoard;
use App\Models\ProjectIssue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class IssueController extends Controller
{
    function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
            'project_board_id' => ['nullable', 'string', 'exists:project_boards,id'],
            'project_id' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = ProjectIssue::with([
            'project:id,name',
            'projectBoard:id,name'
        ])->when($request->search, function ($query, $search) {
            return $query->where('title', 'like', '%' . $search . '%');
        })
            ->when($request->project_board_id, function ($query, $project_board_id) {
                return $query->where('project_board_id', $project_board_id);
            })
            ->when($request->project_id, function ($query, $project) {
                return $query->where('project_id', $project);
            })
            ->whereNull('deleted_at')
            ->where('user_id', $request->user()->id)
            ->orderBy($request->sort_by ?? 'project_payment_date', $request->sort_direction ?? 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        $projects = Project::select('id', 'name')->where('user_id', $request->user()->id)->whereNull('deleted_at')->get();

        return Inertia::render('Project/Issue', [
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
                    "title" => 'List Project Issue',
                    "href" => '#'
                ]
            ]
        ]);
    }
}
