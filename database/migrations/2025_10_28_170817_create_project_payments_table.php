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
        Schema::create('project_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('type', 2)->default('00')->comment('00 = payment, 01 = additional');
            $table->date('project_payment_date');
            $table->decimal('amount', 20, 2);
            $table->foreignUuid('project_id')->references('id')->on('projects');
            $table->foreignUuid('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_payments');
    }
};
