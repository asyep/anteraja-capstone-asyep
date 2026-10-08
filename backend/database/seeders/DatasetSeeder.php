<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
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
