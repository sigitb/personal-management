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
        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('notes');
            $table->foreignUuid('finance_category_id')->references('id')->on('finance_categories');
            $table->foreignUuid('finance_type_id')->references('id')->on('finance_types');
            $table->decimal('amount', 20, 2);
            $table->date('finance_transaction_date');
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
        Schema::dropIfExists('finance_transactions');
    }
};
