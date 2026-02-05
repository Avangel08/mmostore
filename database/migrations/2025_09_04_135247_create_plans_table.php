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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->integer('type');
            $table->string('name', 255);
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('price_origin', 15, 2)->default(0);
            $table->string('off')->nullable();
            $table->integer('interval');
            $table->integer('interval_type');
            $table->string('description', 500)->nullable();
            $table->tinyInteger('best_choice')->default(0);
            $table->tinyInteger('show_public')->default(1);
            $table->text('sub_description')->nullable();
            $table->text('feature')->nullable();
            $table->integer('status');
            $table->integer('creator_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
