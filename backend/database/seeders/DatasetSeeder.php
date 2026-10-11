<?php

/**
 * ============================================================================
 * SEEDER: DatasetSeeder (Pengisian Data Master dari CSV)
 * ============================================================================
 * 
 * FUNGSI FILE:
 * Mengimpor berkas dataset CSV benchmark Anteraja (resi, kurir, pivot penugasan,
 * checkpoint riwayat, telemetri IoT, dan narasi baseline AI) dari direktori `docs/`
 * ke dalam tabel-tabel database secara otomatis.
 * 
 * SEKILAS LOGIKA SEEDER:
 * 1. TRUNCATE CASCADE: Mengosongkan seluruh tabel terkait sebelum pengisian agar
 *    tidak terjadi duplikasi Primary Key atau inkonsistensi saat dijalankan ulang.
 * 2. File Parsing: Membaca baris demi baris file CSV dengan `fgetcsv()`, mencocokkan
 *    header kolom dengan nilai baris.
 * 3. Type Casting: Mengonversi string kosong menjadi `null` dan string boolean
 *    ('true'/'false') menjadi nilai boolean PHP native.
 * 4. Chunk Insert: Membagi baris data menjadi batch berukuran 200 baris menggunakan
 *    `array_chunk()` untuk menjaga efisiensi memori dan kecepatan eksekusi DB.
 * ============================================================================
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatasetSeeder extends Seeder
{
    /**
     * Jalankan proses seeding dataset CSV ke dalam basis data.
     */
    public function run(): void
    {
        $docsPath = base_path('docs');
        
        $files = [
            'shipments' => 'shipments.csv',
            'couriers' => 'couriers.csv',
            'shipment_couriers' => 'shipment_couriers.csv',
            'tracking_events' => 'tracking_events.csv',
            'telemetry_data' => 'telemetry_data.csv',
            'ai_narratives' => 'ai_narratives.csv'
        ];
        
        // Kosongkan seluruh tabel dataset agar seeder aman dijalankan berulang
        // (tabel dengan PK auto-increment akan terduplikasi bila tidak di-truncate).
        DB::statement('TRUNCATE TABLE ' . implode(', ', array_keys($files)) . ' RESTART IDENTITY CASCADE');

        foreach ($files as $table => $filename) {
            $csvPath = $docsPath . '/' . $filename;
            
            if (!file_exists($csvPath)) {
                $this->command->error("File {$filename} tidak ditemukan di {$csvPath}");
                continue;
            }
            
            $handle = fopen($csvPath, 'r');
            $header = fgetcsv($handle);
            if (!$header) {
                fclose($handle);
                continue;
            }

            $rows = [];
            while (($row = fgetcsv($handle)) !== false) {
                if (count($row) !== count($header)) continue;

                $insertData = [];
                foreach ($header as $j => $column) {
                    $val = $row[$j];
                    if ($val === '') {
                        $val = null;
                    } elseif (strtolower($val) === 'true') {
                        $val = true;
                    } elseif (strtolower($val) === 'false') {
                        $val = false;
                    }
                    $insertData[$column] = $val;
                }
                $rows[] = $insertData;
            }
            fclose($handle);

            foreach (array_chunk($rows, 200) as $chunk) {
                DB::table($table)->insert($chunk);
            }
            
            $this->command->info("Seeded table {$table} from {$filename} (" . count($rows) . " rows)");
        }
    }
}
