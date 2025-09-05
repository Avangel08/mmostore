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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('check_out_id');
            $table->integer('payment_method_id');
            $table->decimal('amount', 10, 2);
            $table->decimal('amount_vnd', 10, 2)->nullable();
            $table->string('currency');
            $table->string('transaction_id');
            $table->dateTime('payment_date');
            $table->bigInteger('creator_id');
            $table->longText('note')->nullable();
            $table->text('system_note')->nullable();
            $table->bigInteger('charge_id')->nullable()->change();
            $table->dateTime('active_plan_date')->nullable()->change();
            $table->tinyInteger('status');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
