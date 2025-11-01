<?php

namespace App\Models\MySQL;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class PaymentTransactions extends Model
{
    const STATUS = [
        'PENDING' => 0,
        'COMPLETE' => 1,
        'REJECT' => 2,
    ];

    protected $connection = 'mysql';
    protected $table = 'payment_transactions';

    protected $fillable = [
        'user_id',
        'check_out_id',
        'payment_method_id',
        'amount',
        'amount_vnd',
        'currency',
        'transaction_id',
        'payment_date',
        'creator_id',
        'charge_id',
        'active_plan_date',
        'note', // kế toán node
        'system_note', // hệ thống cảnh báo khi lỗi
        'status',
    ];

    public function checkout()
    {
        return $this->belongsTo(CheckOuts::class, 'check_out_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethods::class, 'payment_method_id');
    }

    public function charge()
    {
        return $this->belongsTo(Charges::class, 'charge_id');
    }

    public function scopeFilterPlanName($query, $request)
    {
        if (isset($request['planName']) && $request['planName'] != '') {
            $query->whereHas('checkout', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request['planName'] . '%');
            });
        }
        return $query;
    }

    public function scopeFilterUserId($query, $request)
    {
        if (isset($request['userId']) && $request['userId'] != '') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('id', $request['userId']);
            });
        }
        return $query;
    }

    public function scopeFilterPaymentMethod($query, $request)
    {
        if (isset($request['paymentMethodId']) && $request['paymentMethodId'] != '') {
            $query->where('payment_method_id', $request['paymentMethodId']);
        }
        return $query;
    }

    public function scopeFilterPlanType($query, $request)
    {
        if (isset($request['planType']) && $request['planType'] != '') {
            $query->whereHas('checkout', function ($q) use ($request) {
                $q->where('type', (int) $request['planType']);
            });
        }
        return $query;
    }

    public function scopeFilterPlanId($query, $request)
    {
        if (isset($request['planId']) && $request['planId'] != '') {
            $query->where('plan_id', $request['planId']);
        }
        return $query;
    }

    public function scopeFilterStatus($query, $request)
    {
        if (isset($request['status']) && $request['status'] != '') {
            $query->where('status', (int) $request['status']);
        }
        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        try {
            if (!empty($request['createdDateStart'])) {
                $start = Carbon::parse($request['createdDateStart'])->startOfDay();
                $query->where('created_at', '>=', $start);
            }

            if (!empty($request['createdDateEnd'])) {
                $end = Carbon::parse($request['createdDateEnd'])->endOfDay();
                $query->where('created_at', '<=', $end);
            }
        } catch (\Exception $e) {
        }

        return $query;
    }

    public function scopeFilterExpirationDate($query, $request)
    {
        try {
            if (empty($request['expirationDateStart']) && empty($request['expirationDateEnd'])) {
                return $query;
            }
            
            $query->whereHas('charge', function ($q) use ($request) {
                if (!empty($request['expirationDateStart'])) {
                    $start = Carbon::parse($request['expirationDateStart'])->startOfDay();
                    $q->where('expires_on', '>=', $start);
                }

                if (!empty($request['expirationDateEnd'])) {
                    $end = Carbon::parse($request['expirationDateEnd'])->endOfDay();
                    $q->where('expires_on', '<=', $end);
                }
            });
        } catch (\Exception $e) {
        }

        return $query;
    }
}
