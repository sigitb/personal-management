<?php

namespace App\Http\Controllers\MasterData\Finance;

use App\Http\Controllers\Controller;
use App\Models\FinanceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FinanceTypeController extends Controller
{
    function index(Request $request) {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = FinanceType::when($request->search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%');
        })
        ->whereNull('deleted_at')
        ->where('user_id', $request->user()->id)
        ->orderBy($request->sort_by ?? 'name', $request->sort_direction ?? 'desc')
        ->paginate($request->per_page ?? 10)
        ->withQueryString();

        return Inertia::render('MasterData/Finance/FinanceType', [
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
                    "title" => 'List Finance Type',
                    "href" => '#'
                ]
            ]
        ]);
    }

    function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(FinanceType::where('name', $request->name)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        FinanceType::create([
            'name' => $request->name,
            'user_id' => $request->user()->id
        ]);
        return redirect()->back()->with('success', 'Data Created Successfuly');
    }

    function update(Request $request, $id) {
         $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        if(FinanceType::where('name', $request->name)->where('id', '!=', $id)->exists()) return redirect()->back()->with('error', 'Data Already Exists');

        $data = FinanceType::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data Not Found');
        $data->update([
            'name' => $request->name
        ]);
        return redirect()->back()->with('success', 'Data Updated Successfuly');
    }

    function destroy($id) {
        $data = FinanceType::where('id',$id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data Not Found');
        $data->update([
            'deleted_at' => now()
        ]);
        return redirect()->back()->with('success', 'Data Deleted Successfuly');
    }
}
