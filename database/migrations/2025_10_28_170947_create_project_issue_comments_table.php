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
        Schema::create('project_issue_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('comment');
            $table->foreignUuid('project_issue_id')->references('id')->on('project_issues');
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
        Schema::dropIfExists('project_issue_comments');
    }
};
