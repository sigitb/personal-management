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
        Schema::create('project_issue_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_board_id')->references('id')->on('project_boards');
            $table->foreignUuid('project_issue_id')->references('id')->on('project_issues');
            $table->foreignUuid('user_id')->references('id')->on('users');
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_issue_logs');
    }
};
