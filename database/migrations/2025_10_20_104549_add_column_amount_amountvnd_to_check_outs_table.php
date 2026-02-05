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
        Schema::connection('mysql')->table('check_outs', function (Blueprint $table) {
            $table->decimal('amount_vnd', 15, 2)->default(0)->after('price');
            $table->renameColumn('price', 'amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('check_outs', function (Blueprint $table) {
            $table->dropColumn('amount_vnd');
            $table->renameColumn('amount', 'price');
        });
    }
};
