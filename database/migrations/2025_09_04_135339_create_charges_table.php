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
        Schema::create('charges', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->tinyInteger('type');
            $table->string('name');
            $table->smallInteger('shop_number');
            $table->smallInteger('interval');
            $table->smallInteger('interval_type');
            $table->text('feature')->nullable();
            $table->dateTime('active_on');
            $table->dateTime('expires_on');
            $table->integer('check_out_id');
            $table->integer('creator_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('charges');
    }
};
