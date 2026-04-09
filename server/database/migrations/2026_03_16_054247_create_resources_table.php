<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResourcesTable extends Migration
{
    public function up()
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('course');
            $table->string('title');
            $table->string('semester');
            $table->string('type');
            $table->string('file_path');
            $table->timestamps();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->integer('rating_sum')->default(0);
            $table->integer('rating_count')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('resources');
    }
}