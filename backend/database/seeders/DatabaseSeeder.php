<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Migration users bawaan Laravel belum dijalankan pada database ini,
        // jadi seeding user dilewati selama tabelnya belum ada.
        if (Schema::hasTable('users')) {
            User::updateOrCreate(
                ['email' => 'test@example.com'],
                ['name' => 'Test User', 'password' => 'password'],
            );
        }

        $this->call([
            CourierSeeder::class,
            ShipmentSeeder::class,
            FeedbackSeeder::class,
        ]);
    }
}
