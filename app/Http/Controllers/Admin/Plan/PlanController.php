<?php

namespace App\Http\Controllers\Admin\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Plan\PlanRequest;
use App\Models\MySQL\Plans;
use App\Services\Plan\PlanService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PlanController extends Controller
{
    protected $planService;

    public function __construct(PlanService $planService)
    {
        $this->planService = $planService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('plan_view')) {
        //     return abort(403);
        // }

        return Inertia::render('Plan/index', [
            'plans' => fn() => $this->planService->getForTable($request),
            'statusConst' => fn() => [
                Plans::STATUS['ACTIVE'] => 'Active',
                Plans::STATUS['INACTIVE'] => 'Inactive',
            ],
            "typeConst" => fn() => $this->planService->getSelectTypePlan(),
            "detailPlan" => Inertia::optional(fn() => $this->planService->getById(id: $request->input('id'))),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(PlanRequest $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('plan_create')) {
        //     return abort(403);
        // }

        try {
            $data = $request->validated();
            $type = $data['type'];
            if ($type == Plans::TYPE['DEFAULT']) {
                $plansDefaultType = $this->planService->getDefaultPlans();
                if ($plansDefaultType->isNotEmpty()) {
                    throw ValidationException::withMessages([
                        'type' => ['Default plan already exists. Only one Default type plan is allowed']
                    ]);
                }
            }
            $this->planService->createPlan($data);
            return back()->with('success', 'Plan added successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, [
                'ip' => $request->ip(),
                'user_id' => auth(config('guard.admin'))->id() ?? null
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PlanRequest $request, string $id)
    {
        // if (auth(config('guard.admin'))->user()->cannot('plan_update')) {
        //     return abort(403);
        // }

        try {
            $data = $request->validated();
            $plan = $this->planService->getById($id);

            if (!$plan) {
                return back()->with('error', 'Plan not found');
            }

            $type = $data['type'];
            if ($plan?->type != Plans::TYPE['DEFAULT'] && $type == Plans::TYPE['DEFAULT']) {
                $plansDefaultType = $this->planService->getDefaultPlans();
                if ($plansDefaultType->isNotEmpty()) {
                    throw ValidationException::withMessages([
                        'type' => ['Default plan already exists. Only one Default type plan is allowed']
                    ]);
                }
            }
            $this->planService->updatePlan($plan, $data);
            return back()->with('success', 'Plan updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, [
                'ip' => $request->ip(),
                'user_id' => auth(config('guard.admin'))->id() ?? null
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function duplicatePlan(string $id)
    {
        // if (auth(config('guard.admin'))->user()->cannot('plan_create')) {
        //     return abort(403);
        // }

        try {
            $plan = $this->planService->getById($id);

            if (!$plan) {
                return back()->with('error', 'Plan not found');
            }

            $this->planService->duplicatePlan($plan);

            return back()->with('success', 'Plan duplicated successfully');
        } catch (\Exception $e) {
            \Log::error($e, [
                'ip' => request()->ip(),
                'user_id' => auth(config('guard.admin'))->id() ?? null
            ]);
            return back()->with('error', $e->getMessage());
        }
    }
}
