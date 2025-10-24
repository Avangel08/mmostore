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
        Schema::connection('mysql')->table('check_outs', function (Blueprint $table) {
            $table->longText('description')->nullable()->after('feature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('check_outs', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
