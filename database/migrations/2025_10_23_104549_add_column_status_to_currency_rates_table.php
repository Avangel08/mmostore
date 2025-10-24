<?php

use App\Models\MySQL\CurrencyRates;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mysql')->table('currency_rates', function (Blueprint $table) {
            $table->string('status')->default(CurrencyRates::STATUS['INACTIVE'])->after('date');
            $table->decimal('to_vnd', 15, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('currency_rates', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->decimal('to_vnd', 10, 2)->change();
        });
    }
};
