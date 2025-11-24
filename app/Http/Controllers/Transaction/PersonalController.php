<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\FinanceCategory;
use App\Models\FinanceTransaction;
use App\Models\FinanceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PersonalController extends Controller
{
    function index(Request $request) {
        $validator = Validator::make($request->all(), [
            'search' => ['nullable', 'string', 'max:100'],
            'finance_category_id' => ['nullable', 'array'],
            'finance_type_id' => ['nullable', 'array']
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = FinanceTransaction::with([
            'financeType:id,name',
            'financeCategory:id,name'
        ])->when($request->search, function ($query, $search) {
            return $query->where('notes', 'like', '%' . $search . '%');
        })
        ->when($request->finance_category_id, function($query, $category){
            return $query->whereIn('finance_category_id', $category);
        })
        ->when($request->finance_type_id, function($query, $type){
            return $query->whereIn('finance_type_id', $type);
        })
        ->whereNull('deleted_at')
        ->where('user_id', $request->user()->id)
        ->orderBy($request->sort_by ?? 'finance_transaction_date', $request->sort_direction ?? 'desc')
        ->paginate($request->per_page ?? 10)
        ->withQueryString();
        $financeType = FinanceType::select('id', 'name')->where('user_id', $request->user()->id)->whereNull('deleted_at')->get();
        $financeCategory = FinanceCategory::select('id', 'name')->where('user_id', $request->user()->id)->whereNull('deleted_at')->get();

        return Inertia::render('Transaction/Personal', [
            'financeType' => $financeType,
            'financeCategory' => $financeCategory,
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
                    "title" => 'List Finance Personal',
                    "href" => '#'
                ]
            ]
        ]);
    }

    function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'notes' => ['required', 'string', 'max:200'],
            'finance_category_id' => ['required', 'string', 'exists:finance_categories,id'],
            'finance_type_id' => ['required', 'string', 'exists:finance_types,id'],
            'amount' => ['required', 'numeric'],
            'finance_transaction_date' => ['required', 'date']
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        FinanceTransaction::create([
            'user_id' => $request->user()->id,
            'notes' => $request->notes,
            'finance_type_id' => $request->finance_type_id,
            'finance_category_id' => $request->finance_category_id,
            'finance_transaction_date' => $request->finance_transaction_date,
            'amount' => $request->amount
        ]);
        return redirect()->back()->with('success', 'Data Created Successfuly');
    }

    function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'notes' => ['required', 'string', 'max:200'],
            'finance_category_id' => ['required', 'string', 'exists:finance_categories,id'],
            'finance_type_id' => ['required', 'string', 'exists:finance_types,id'],
            'amount' => ['required', 'numeric'],
            'finance_transaction_date' => ['required', 'date']
        ]);

        if($validator->fails()) return redirect()->back()->with('error', $validator->errors()->first());

        $data = FinanceTransaction::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data not found');

        $data->update([
            'notes' => $request->notes,
            'finance_type_id' => $request->finance_type_id,
            'finance_category_id' => $request->finance_category_id,
            'finance_transaction_date' => $request->finance_transaction_date,
            'amount' => $request->amount
        ]);
        return redirect()->back()->with('success', 'Data Updated Successfuly');
    }

    function destroy($id) {
        $data = FinanceTransaction::where('id', $id)->whereNull('deleted_at')->first();
        if(!$data) return redirect()->back()->with('error', 'Data not found');
        $data->update([
            'deleted_at' => now()
        ]);
        return redirect()->back()->with('success', 'Data Deleted Successfuly');
    }
}
