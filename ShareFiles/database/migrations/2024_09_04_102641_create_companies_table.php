<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pokretanje migracija
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('admin_id');
            $table->timestamps();

            // Spoljni kljuc za povezivanje admin_id sa users tabelom
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Pivot tabela za user-companies
        Schema::create('company_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        
        // Spoljni kljuc za povezivanje company_id i user_id
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        
        // Jedan user ne moze pripadati istoj kompaniji vise puta
            $table->unique(['company_id', 'user_id']);
        });        
    }

    /**
     * Gasenje tabele
     */
    public function down(): void
    {
        Schema::dropIfExists('company_user');
        Schema::dropIfExists('companies');
    }
};
