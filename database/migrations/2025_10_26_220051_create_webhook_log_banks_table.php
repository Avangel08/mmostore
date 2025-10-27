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
        Schema::create('webhook_log_banks', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('gateway');
            $table->string('transaction');
            $table->json('data');
            $table->dateTime('date_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_log_banks');
    }
};
