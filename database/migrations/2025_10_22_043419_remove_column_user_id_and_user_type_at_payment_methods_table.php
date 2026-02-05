<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mysql')->table('payment_methods', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->dropColumn('user_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('payment_methods', function (Blueprint $table) {
            $table->integer('user_id')->nullable();
            $table->smallInteger('user_type')->nullable();
        });
    }
};
