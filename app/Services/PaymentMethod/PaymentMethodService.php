<?php

namespace App\Services\PaymentMethod;

use App\Models\MySQL\PaymentMethods;

/**
 * Class PaymentMethodService
 * @package App\Services
 */
class PaymentMethodService
{
    public function getForTable($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;
        return PaymentMethods::filterSearch($request)
            ->filterCreatedDate($request)
            ->where('type', '!=', PaymentMethods::TYPE['NO_BANK'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function updateOrCreate($data)
    {
        return PaymentMethods::updateOrCreate([
            'type' => $data['type'],
            'key' => $data['key']
        ], $data);
    }

    public function create($data)
    {
        return PaymentMethods::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }

    public function delete($id)
    {
        return PaymentMethods::find($id)->delete();
    }

    public function findById($id)
    {
        return PaymentMethods::find($id);
    }

    public function findByKey($key)
    {
        return PaymentMethods::where('key', $key)->where('status', PaymentMethods::STATUS['ACTIVE'])->first();
    }

    public function renderLinkWebhook($host)
    {
        $endPoint = "api/v1/webhook/sepay-admin";
        return $host . "/" . $endPoint;
    }

    public function findActiveById($id)
    {
        return PaymentMethods::where('id', $id)->where('status', PaymentMethods::STATUS['ACTIVE'])->first();
    }

    public function listActive()
    {
        return PaymentMethods::where('type', '!=', PaymentMethods::TYPE['NO_BANK'])->where('status', PaymentMethods::STATUS['ACTIVE'])->get();
    }

    public function findNoBankMethod()
    {
        return PaymentMethods::firstOrCreate([
            'type' => PaymentMethods::TYPE['NO_BANK'],
        ], [
            'name' => 'No Bank',
            'key' => 'no_bank',
            'title' => 'No Bank',
            'status' => PaymentMethods::STATUS['ACTIVE']
        ]);
    }

    public function getListPaymentMethod($searchTerm = '', int $page = 1, int $perPage = 10, $includeAll = true)
    {
        $this->findNoBankMethod();
        $query = PaymentMethods::select(['id', 'name', 'key', 'type', 'details']);

        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('key', 'like', '%' . $searchTerm . '%')
                    ->orWhere('details->account_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('details->account_number', 'like', '%' . $searchTerm . '%');
            });
        }

        $paginatedResults = $query->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        $listPaymentMethod = collect([]);
        if ($includeAll && $page == 1 && empty($searchTerm)) {
            $listPaymentMethod->push([
                'value' => '',
                'label' => __('All'),
            ]);
        }

        $typeMap = array_flip(PaymentMethods::TYPE);

        $statusData = $paginatedResults->map(
            fn($item) => [
                'value' => $item->id,
                'label' => $item->name . ' - ' . $item->key,
                'type' => $typeMap[$item->type] ?? $item->type,
                'account_name' => $item?->details['account_name'] ?? '',
                'account_number' => $item?->details['account_number'] ?? '',
            ]
        );

        $listPaymentMethod = $listPaymentMethod->merge($statusData);

        return [
            'results' => $listPaymentMethod,
            'has_more' => $paginatedResults->hasMorePages(),
        ];
    }
}
