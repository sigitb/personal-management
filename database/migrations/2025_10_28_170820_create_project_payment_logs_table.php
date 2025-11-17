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
        Schema::create('project_payment_logs', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 20, 2);
            $table->decimal('start_amount', 20, 2);
            $table->decimal('end_amount', 20, 2);
            $table->foreignUuid('project_payment_id')->references('id')->on('project_payments');
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_payment_logs');
    }
};
