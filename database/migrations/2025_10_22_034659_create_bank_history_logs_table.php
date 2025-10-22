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
        Schema::connection('mysql')->create('bank_history_logs', function (Blueprint $table) {
            $table->string('bank');
            $table->bigInteger('user_id');
            $table->mediumText('content_bank');
            $table->decimal('amount', 15, 2);
            $table->string('date');
            $table->longText('description');
            $table->string('key_unique');
            $table->json('json');
            $table->json('error_info');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_history_logs');
    }
};
