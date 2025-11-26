<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectPayment;
use App\Models\ProjectPaymentLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;


class ProjectController extends Controller
{
    function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'string'],
            'project_id' => ['nullable', 'string'],
            'transaction_date' => ['nullable', 'array'],
            'transaction_date.from' => ['nullable', 'date'],
            'transaction_date.to' => ['nullable', 'date']
        ]);

        if ($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = ProjectPayment::with([
            'project:id,name'
        ])->when($request->search, function ($query, $search) {
            return $query->where('notes', 'like', '%' . $search . '%');
        })->when($request->transaction_date, function ($query, $dates) {
            return $query->where('project_payment_date', '>=', Carbon::parse($dates['from']))
                ->where('project_payment_date', '<=', Carbon::parse($dates['to']));
        })
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->project_id, function ($query, $project) {
                return $query->where('type', $project);
            })
            ->whereNull('deleted_at')
            ->where('user_id', $request->user()->id)
            ->orderBy($request->sort_by ?? 'project_payment_date', $request->sort_direction ?? 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        $projects = Project::select('id', 'name')->where('user_id', $request->user()->id)->whereNull('deleted_at')->get();

        return Inertia::render('Transaction/Project', [
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
                    "title" => 'List Finance Project',
                    "href" => '#'
                ]
            ]
        ]);
    }

    function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'notes' => ['nullable', 'string', 'max:200'],
            'amount' => ['required', 'numeric'],
            'type' => ['required', 'string'],
            'project_id' => ['required', 'string'],
            'project_payment_date' => ['required', 'date']
        ]);

        if ($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());


        $project = Project::where('id', $request->project_id)->where('user_id', $request->user()->id)->first();

        if(!$project) return redirect()->back()->with('error', 'Project not found');

        $startAmount = ProjectPaymentLog::where('project_id', $request->project_id)->latest()->value('end_amount') ?? 0;
        
        $projectPayment = ProjectPayment::create([
            'user_id' => $request->user()->id,
            'notes' => $request->notes,
            'amount' => $request->amount,
            'type' => $request->type,
            'project_id' => $project->id,
            'project_payment_date' => $request->project_payment_date,
        ]);
        
        if($request->type === '00'){
            $projectPayment->projectPaymentLog()->create([
                'amount' => $request->amount,
                'start_amount' => $startAmount,
                'end_amount' => $startAmount - $request->amount,
                'project_id' => $project->id,
                'created_at' => now()
            ]);
        }else{
            $projectPayment->projectPaymentLog()->create([
                'amount' => $request->amount,
                'start_amount' => $startAmount,
                'end_amount' => $startAmount + $request->amount,
                'project_id' => $project->id,
                'created_at' => now()
            ]);
            $project->update([
                'total_amount' => $startAmount + $request->amount
            ]);
        }

        return redirect()->back()->with('success', 'Data Created Successfuly');
    }

    function destroy($id) {
        $projectPayment = ProjectPayment::where('id', $id)->whereNull('deleted_at')->first();
        if(!$projectPayment) return redirect()->back()->with('error', 'Data not found');

        $projectPayment->update([
            'deleted_at' => now()
        ]);

        $startAmount = ProjectPaymentLog::where('project_id', $projectPayment->project_id)->latest()->value('end_amount') ?? 0;

        if($projectPayment->type == '00'){
            $projectPayment->projectPaymentLog()->create([
                'amount' => $projectPayment->amount,
                'start_amount' => $startAmount,
                'end_amount' => $startAmount + $projectPayment->amount,
                'project_id' => $projectPayment->project_id,
                'created_at' => now()
            ]);
        }else{
            $projectPayment->projectPaymentLog()->create([
                'amount' => $projectPayment->amount,
                'start_amount' => $startAmount,
                'end_amount' => $startAmount - $projectPayment->amount,
                'project_id' => $projectPayment->project_id,
                'created_at' => now()
            ]);

            $projectPayment->project()->update([
                'total_amount' => $startAmount - $projectPayment->amount
            ]);
        }
        return redirect()->back()->with('success', 'Data Deleted Successfully');
    }

}
