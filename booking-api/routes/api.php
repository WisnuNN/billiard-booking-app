<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        return response()->json([
            'status' => 'ok',
            'database' => 'connected',
            'tables_count' => count($tables),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'database' => 'connection_failed',
            'error_message' => $e->getMessage(),
            'db_config' => [
                'host' => config('database.connections.mysql.host'),
                'port' => config('database.connections.mysql.port'),
                'database' => config('database.connections.mysql.database'),
                'username' => config('database.connections.mysql.username'),
            ]
        ], 500);
    }
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/tables/monitor', [TableController::class, 'monitor']);
});

Route::get('/tables', [TableController::class, 'index']);
Route::get('/tables/{table}', [TableController::class, 'show']);
Route::get('/tables/{table}/schedules', [ScheduleController::class, 'index']);
Route::get('/tables/{table}/availability', [ScheduleController::class, 'checkAvailability']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::get('/bookings/{booking}/ticket', [BookingController::class, 'ticket']);
    Route::post('/bookings/{booking}/pay', [BookingController::class, 'pay']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    Route::middleware('admin')->group(function () {
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

        Route::post('/tables', [TableController::class, 'store']);
        Route::put('/tables/{table}', [TableController::class, 'update']);
        Route::delete('/tables/{table}', [TableController::class, 'destroy']);

        Route::post('/tables/{table}/schedules', [ScheduleController::class, 'store']);
        Route::put('/tables/{table}/schedules/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/tables/{table}/schedules/{schedule}', [ScheduleController::class, 'destroy']);

        Route::post('/bookings/walk-in', [BookingController::class, 'walkIn']);
        Route::patch('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
        Route::patch('/bookings/{booking}/complete', [BookingController::class, 'complete']);

        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::delete('/transactions', [TransactionController::class, 'destroyAll']); // Delete all
        Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
        Route::patch('/transactions/{transaction}', [TransactionController::class, 'update']);
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']); // Delete single

        Route::get('/reports/overview', [ReportController::class, 'overview']);
        Route::get('/reports/bestsellers', [ReportController::class, 'bestsellers']);
        Route::get('/reports/busiest-schedules', [ReportController::class, 'busiestSchedules']);
    });
});

