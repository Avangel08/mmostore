<?php

namespace App\Services\PaymentMethod;

use App\Models\MySQL\PaymentMethods;

/**
 * Class PaymentMethodService
 * @package App\Services
 */
class PaymentMethodService
{
    public function updateOrCreate($data)
    {
        return PaymentMethods::updateOrCreate([
            'user_id' => $data['user_id'],
            'user_type' => $data['user_type'],
            'type' => $data['type'],
            'key' => $data['key']
        ], $data);
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
    
    public function findActiveById($id)
    {
        return PaymentMethods::where('id', $id)->where('status', PaymentMethods::STATUS['ACTIVE'])->first();
    }

    public function findActiveById($id)
    {
        return PaymentMethods::where('id', $id)->where('status', PaymentMethods::STATUS['ACTIVE'])->first();
    }

    public function findByUserId($userId)
    {
        return PaymentMethods::where('user_id', $userId)
            ->where('type', PaymentMethods::TYPE['BANK'])
            ->where('status', PaymentMethods::STATUS['ACTIVE'])
            ->first();
    }

    public function listActive()
    {
        return PaymentMethods::where('status', PaymentMethods::STATUS['ACTIVE'])->get();
    }

    public function getListPaymentMethod($searchTerm = '', int $page = 1, int $perPage = 10)
    {
        $query = PaymentMethods::select(['id', 'name', 'key']);

        if (!empty($searchTerm)) {
            $query->where('name', 'like', '%' . $searchTerm . '%')
                ->orWhere('key', 'like', '%' . $searchTerm . '%');
        }

        $paginatedResults = $query->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        $listPaymentMethod = collect([]);
        if ($page == 1 && empty($searchTerm)) {
            $listPaymentMethod->push([
                'value' => '',
                'label' => __('All'),
            ]);
        }

        $statusData = $paginatedResults->map(
            fn($item) => [
                'value' => $item->id,
                'label' => $item->name . ' - ' . $item->key,
            ]
        );

        $listPaymentMethod = $listPaymentMethod->merge($statusData);

        return [
            'results' => $listPaymentMethod,
            'has_more' => $paginatedResults->hasMorePages(),
        ];
    }
}
