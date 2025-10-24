<?php

namespace App\Services\Plan;

use App\Models\MySQL\Plans;
use Carbon\Carbon;

/**
 * Class PlanService
 * @package App\Services
 */
class PlanService
{
    public function adminGetForTable($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Plans::filterName($request)
            ->filterType($request)
            ->filterStatus($request)
            ->filterShowPublic($request)
            ->filterPriceRange($request)
            ->filterCreatedDate($request)
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getById($id, $select = ['*'])
    {
        return Plans::select($select)->where('id', $id)->first();
    }

    public function createPlan(array $data)
    {
        $planData = [
            'name' => (string) $data['planName'],
            'type' => (int) $data['type'],
            'price' => (float) $data['price'],
            'price_origin' => (float) $data['priceOrigin'],
            'off' => (int) ($data['sale'] ?? 0),
            'interval' => (int) $data['intervalDay'],
            'interval_type' => (int) $data['intervalMonth'],
            'status' => (int) ($data['type'] == Plans::TYPE['DEFAULT'] ? Plans::STATUS['ACTIVE'] : $data['status']),
            'best_choice' => (int) ($data['bestChoice'] ? Plans::BEST_CHOICE['true'] : Plans::BEST_CHOICE['false']),
            'show_public' => (int) ($data['showPublic'] ? Plans::SHOW_PUBLIC['true'] : Plans::SHOW_PUBLIC['false']),
            'sub_description' => !empty($data['shortDescription']) ? (string) $data['shortDescription'] : null,
            'description' => !empty($data['description']) ? (string) $data['description'] : null,
            'creator_id' => auth(config('guard.admin'))->id(),
        ];

        return Plans::create($planData);
    }

    public function updatePlan(Plans $plan, array $data)
    {
        $dataToUpdate = [
            'name' => (string) $data['planName'],
            'type' => (int) $data['type'],
            'price' => (float) $data['price'],
            'price_origin' => (float) $data['priceOrigin'],
            'off' => (int) ($data['sale'] ?? 0),
            'interval' => (int) $data['intervalDay'],
            'interval_type' => (int) $data['intervalMonth'],
            'status' => (int) ($data['type'] == Plans::TYPE['DEFAULT'] ? Plans::STATUS['ACTIVE'] : $data['status']),
            'best_choice' => (int) ($data['bestChoice'] ? Plans::BEST_CHOICE['true'] : Plans::BEST_CHOICE['false']),
            'show_public' => (int) ($data['showPublic'] ? Plans::SHOW_PUBLIC['true'] : Plans::SHOW_PUBLIC['false']),
            'sub_description' => !empty($data['shortDescription']) ? (string) $data['shortDescription'] : null,
            'description' => !empty($data['description']) ? (string) $data['description'] : null,
        ];

        return $plan->update($dataToUpdate);
    }

    public function deletePlan(Plans $plan)
    {
        return $plan->delete();
    }

    public function deleteMultiple(array $ids)
    {
        return Plans::whereIn('id', $ids)->delete();
    }

    public function getDefaultPlans($select = ['*'], $relation = [])
    {
        return Plans::select($select)->where('type', Plans::TYPE['DEFAULT'])->with($relation)->get();
    }

    public function getSelectTypePlan()
    {
        $selectType = [
            Plans::TYPE['NORMAL'] => 'Normal',
        ];

        $defaultPlans = $this->getDefaultPlans(['id']);
        if ($defaultPlans->isEmpty()) {
            $selectType[Plans::TYPE['DEFAULT']] = 'Default';
        }
        return $selectType;
    }

    public function duplicatePlan(Plans $plan)
    {
        $newPlan = $plan->replicate();
        $newPlan->name = $plan->name . ' (Copy_' . Carbon::now()->getTimestamp(). ')';
        $newPlan->status = Plans::STATUS['INACTIVE'];
        $newPlan->type = $newPlan?->type == Plans::TYPE['DEFAULT'] ? Plans::TYPE['NORMAL'] : $newPlan->type;
        $newPlan->creator_id = auth(config('guard.admin'))->id();
        $newPlan->created_at = now();
        $newPlan->updated_at = now();
        $newPlan->save();

        return $newPlan;
    }

    public function sellerGetAllPlans($select = ['*'], $relation = [])
    {
        return Plans::select($select)
            ->where('status', Plans::STATUS['ACTIVE'])
            ->where('show_public', Plans::SHOW_PUBLIC['true'])
            ->where('type', '!=', Plans::TYPE['DEFAULT'])
            ->with($relation)
            ->get();
    }
}
