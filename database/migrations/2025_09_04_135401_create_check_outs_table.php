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
        Schema::create('check_outs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->integer('plan_id');
            $table->integer('payment_method_id')->nullable();
            $table->tinyInteger('type');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->smallInteger('interval');
            $table->smallInteger('interval_type');
            $table->text('feature');
            $table->tinyInteger('status');
            $table->bigInteger('creator_id');
            $table->text('feature')->nullable()->change();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_outs');
    }
};
