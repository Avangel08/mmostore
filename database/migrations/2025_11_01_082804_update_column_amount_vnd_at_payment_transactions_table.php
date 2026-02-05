<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mysql')->table('payment_transactions', function (Blueprint $table) {
            $table->decimal('amount_vnd', 15, 2)->nullable()->after('amount')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('payment_transactions', function (Blueprint $table) {
             $table->decimal('amount_vnd', 10, 2)->nullable()->after('amount')->change();
        });
    }
};
