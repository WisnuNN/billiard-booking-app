<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Seed billiard tables with operating schedules.
     */
    public function run(): void
    {
        $tables = [
            // Standard Tables
            ['name' => 'Meja Standard 1', 'table_number' => 'STD-01', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard dengan peralatan lengkap.', 'is_active' => true],
            ['name' => 'Meja Standard 2', 'table_number' => 'STD-02', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard dengan peralatan lengkap.', 'is_active' => true],
            ['name' => 'Meja Standard 3', 'table_number' => 'STD-03', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard dengan pencahayaan optimal.', 'is_active' => true],
            ['name' => 'Meja Standard 4', 'table_number' => 'STD-04', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard area umum.', 'is_active' => true],
            ['name' => 'Meja Standard 5', 'table_number' => 'STD-05', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard dekat pintu masuk.', 'is_active' => true],
            ['name' => 'Meja Standard 6', 'table_number' => 'STD-06', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard sudut.', 'is_active' => true],
            ['name' => 'Meja Standard 7', 'table_number' => 'STD-07', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard nyaman.', 'is_active' => true],
            ['name' => 'Meja Standard 8', 'table_number' => 'STD-08', 'type' => 'standard', 'price_per_hour' => 50000, 'description' => 'Meja billiard standard luas.', 'is_active' => true],

            // VIP Tables
            ['name' => 'Meja VIP 1', 'table_number' => 'VIP-01', 'type' => 'VIP', 'price_per_hour' => 100000, 'description' => 'Meja billiard VIP dengan ruangan privat dan AC.', 'is_active' => true],
            ['name' => 'Meja VIP 2', 'table_number' => 'VIP-02', 'type' => 'VIP', 'price_per_hour' => 100000, 'description' => 'Meja billiard VIP premium dengan fasilitas lengkap.', 'is_active' => true],
            ['name' => 'Meja VIP 3', 'table_number' => 'VIP-03', 'type' => 'VIP', 'price_per_hour' => 100000, 'description' => 'Meja billiard VIP eksklusif lantai dua.', 'is_active' => true],
            ['name' => 'Meja VIP 4', 'table_number' => 'VIP-04', 'type' => 'VIP', 'price_per_hour' => 100000, 'description' => 'Meja billiard VIP dengan sofa nyaman.', 'is_active' => true],

            // VIP Tables (Premium)
            ['name' => 'Meja VIP 1 (Presidential)', 'table_number' => 'VVIP-01', 'type' => 'VIP', 'price_per_hour' => 250000, 'description' => 'Meja billiard VIP premium dengan layanan butler, makanan gratis, dan ruang karaoke.', 'is_active' => true],
            ['name' => 'Meja VIP 2 (Executive)', 'table_number' => 'VVIP-02', 'type' => 'VIP', 'price_per_hour' => 200000, 'description' => 'Meja billiard VIP eksklusif dengan fasilitas hiburan terlengkap.', 'is_active' => true],
        ];

        foreach ($tables as $tableData) {
            $table = Table::updateOrCreate(
                ['table_number' => $tableData['table_number']],
                $tableData
            );

            // Create schedules for each day (Monday-Sunday)
            // Weekdays: 10:00 - 23:00
            // Weekends: 09:00 - 24:00
            for ($day = 0; $day <= 6; $day++) {
                $isWeekend = in_array($day, [0, 6]); // Sunday = 0, Saturday = 6

                Schedule::updateOrCreate(
                    [
                        'table_id' => $table->id,
                        'day_of_week' => $day,
                    ],
                    [
                        'open_time' => $isWeekend ? '09:00' : '10:00',
                        'close_time' => $isWeekend ? '00:00' : '23:00',
                        'is_available' => true,
                    ]
                );
            }
        }
    }
}
