<?php

/**
 * ============================================================================
 * SEEDER UTAMA: DatabaseSeeder
 * ============================================================================
 * 
 * FUNGSI FILE:
 * Titik masuk utama (entrypoint) eksekusi database seeding Laravel ketika perintah
 * `php artisan db:seed` dijalankan.
 * 
 * SEKILAS LOGIKA SEEDER:
 * 1. User Default: Membuat user uji coba (`test@example.com`) secara idempoten
 *    dengan `firstOrCreate()` agar tidak gagal jika dijalankan berulang.
 * 2. Delegasi DatasetSeeder: Memanggil `DatasetSeeder::class` untuk mengisi
 *    seluruh dataset 6 tabel operasional pelacakan Anteraja dari CSV.
 * ============================================================================
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Jalankan seed utama basis data aplikasi.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
        
        $this->call(DatasetSeeder::class);
    }
}
