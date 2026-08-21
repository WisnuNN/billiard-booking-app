<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    #[OA\Get(
        path: '/api/reports/overview',
        summary: 'Get dashboard overview statistics (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'today_bookings', type: 'integer'),
                                new OA\Property(property: 'active_customers', type: 'integer'),
                                new OA\Property(property: 'monthly_revenue', type: 'number'),
                            ]
                        )
                    ]
                )
            ),
        ]
    )]
    public function overview(Request $request): JsonResponse
    {
        $today = now()->format('Y-m-d');
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $todayBookings = Booking::whereDate('booking_date', $today)->count();
        
        $activeCustomers = User::where('role', 'customer')
            ->whereHas('bookings', function($q) use ($currentMonth, $currentYear) {
                $q->whereMonth('booking_date', $currentMonth)
                  ->whereYear('booking_date', $currentYear);
            })->count();
            
        $monthlyRevenue = Transaction::where('payment_status', 'paid')
            ->whereMonth('paid_at', $currentMonth)
            ->whereYear('paid_at', $currentYear)
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'today_bookings' => $todayBookings,
                'active_customers' => $activeCustomers,
                'monthly_revenue' => (float) $monthlyRevenue,
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/reports/bestsellers',
        summary: 'Get most booked tables (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        parameters: [
            new OA\Parameter(name: 'limit', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'start_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date')),
            new OA\Parameter(name: 'end_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'table', type: 'string'),
                                    new OA\Property(property: 'type', type: 'string'),
                                    new OA\Property(property: 'total_bookings', type: 'integer'),
                                    new OA\Property(property: 'total_revenue', type: 'number'),
                                ]
                            )
                        )
                    ]
                )
            ),
        ]
    )]
    public function bestsellers(Request $request): JsonResponse
    {
        $query = Booking::query()
            ->select('table_id', DB::raw('count(*) as total_bookings'), DB::raw('sum(total_price) as total_revenue'))
            ->whereIn('status', ['completed', 'confirmed']);
            
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('booking_date', [$request->start_date, $request->end_date]);
        }

        $bestsellers = $query->groupBy('table_id')
            ->orderByDesc('total_bookings')
            ->with('table')
            ->limit($request->get('limit', 10))
            ->get();
            
        $data = $bestsellers->map(function ($item) {
            return [
                'table' => $item->table->name,
                'type' => $item->table->type,
                'total_bookings' => $item->total_bookings,
                'total_revenue' => (float) $item->total_revenue,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[OA\Get(
        path: '/api/reports/busiest-schedules',
        summary: 'Get busiest schedules (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        parameters: [
            new OA\Parameter(name: 'limit', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'start_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date')),
            new OA\Parameter(name: 'end_date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'day_name', type: 'string'),
                                    new OA\Property(property: 'start_time', type: 'string', format: 'time'),
                                    new OA\Property(property: 'total_bookings', type: 'integer'),
                                ]
                            )
                        )
                    ]
                )
            ),
        ]
    )]
    public function busiestSchedules(Request $request): JsonResponse
    {
        $query = Booking::query()
            ->select(DB::raw('DAYNAME(booking_date) as day_name'), 'start_time', DB::raw('count(*) as total_bookings'))
            ->whereIn('status', ['completed', 'confirmed']);
            
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('booking_date', [$request->start_date, $request->end_date]);
        }
        
        $busiest = $query->groupBy(DB::raw('DAYNAME(booking_date)'), 'start_time')
            ->orderByDesc('total_bookings')
            ->limit($request->get('limit', 10))
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $busiest,
        ]);
    }
}
