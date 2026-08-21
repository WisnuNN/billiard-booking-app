<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@billiard.com'],
            [
                'name' => 'Admin Billiard',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'phone' => '081234567890',
            ]
        );

        // Create a sample customer
        User::updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Customer',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'phone' => '089876543210',
            ]
        );
    }
}
