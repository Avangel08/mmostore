<?php

namespace App\Services\Customer;

use App\Models\Mongo\Customers;

/**
 * Class CustomerService
 * @package App\Services
 */
class CustomerService
{
    public function findByIdentifier($identifier)
    {
        return Customers::where('identifier', $identifier)->first();
    }

    public function findById($id)
    {
        return Customers::where('_id', $id)->first();
    }

    public function create($data)
    {
        return Customers::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }
    
    public function delete($id)
    {
        return Customers::where('_id', $id)->delete();
    }
}
