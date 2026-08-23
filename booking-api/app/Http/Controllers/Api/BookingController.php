<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Table;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Events\TableStatusUpdated;
use OpenApi\Attributes as OA;

class BookingController extends Controller
{
    #[OA\Get(
        path: '/api/bookings',
        summary: 'Get list of bookings',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'limit', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'date', in: 'query', required: false, schema: new OA\Schema(type: 'string', format: 'date')),
            new OA\Parameter(name: 'table_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
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
                            items: new OA\Items(ref: '#/components/schemas/BookingResource')
                        ),
                        new OA\Property(
                            property: 'meta',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'current_page', type: 'integer'),
                                new OA\Property(property: 'last_page', type: 'integer'),
                                new OA\Property(property: 'limit', type: 'integer'),
                                new OA\Property(property: 'total', type: 'integer'),
                            ]
                        )
                    ]
                )
            ),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['user', 'table', 'transaction']);

        if (! $request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        if ($request->has('table_id')) {
            $query->where('table_id', $request->table_id);
        }

        if ($request->has('exclude_walk_in') && $request->boolean('exclude_walk_in')) {
            $query->where(function ($q) {
                $q->whereNull('notes')->orWhere('notes', 'not like', 'Walk-in:%');
            });
        }

        $bookings = $query->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->paginate($request->get('limit', 15));

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'limit' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/bookings',
        summary: 'Create a new booking',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['table_id', 'booking_date', 'start_time', 'end_time'],
                properties: [
                    new OA\Property(property: 'table_id', type: 'integer'),
                    new OA\Property(property: 'booking_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'start_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'end_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'notes', type: 'string'),
                ]
            )
        ),
        tags: ['Bookings'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking berhasil dibuat. Menunggu konfirmasi admin.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $table = Table::findOrFail($request->table_id);

        $startTime = Carbon::parse($request->start_time);
        $endTime = Carbon::parse($request->end_time);
        
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }
        
        $durationHours = abs(round($startTime->diffInMinutes($endTime) / 60, 1));
        $totalPrice = $durationHours * $table->price_per_hour;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'table_id' => $request->table_id,
            'booking_date' => $request->booking_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'duration_hours' => $durationHours,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        Transaction::create([
            'booking_id' => $booking->id,
            'amount' => $totalPrice,
            'payment_status' => 'unpaid',
        ]);

        $booking->load(['user', 'table', 'transaction']);
        TableStatusUpdated::dispatch($booking->table);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibuat. Menunggu konfirmasi admin.',
            'data' => new BookingResource($booking),
        ], 201);
    }

    #[OA\Get(
        path: '/api/bookings/{id}',
        summary: 'Get booking information',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function show(Request $request, Booking $booking): JsonResponse
    {

        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke booking ini.',
            ], 403);
        }

        $booking->load(['user', 'table', 'transaction']);

        return response()->json([
            'success' => true,
            'data' => new BookingResource($booking),
        ]);
    }

    #[OA\Patch(
        path: '/api/bookings/{id}/cancel',
        summary: 'Cancel a booking',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking berhasil dibatalkan.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function cancel(Request $request, Booking $booking): JsonResponse
    {

        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke booking ini.',
            ], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Booking sudah dibatalkan sebelumnya.',
            ], 422);
        }

        if ($booking->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Booking yang sudah selesai tidak dapat dibatalkan.',
            ], 422);
        }

        $booking->update(['status' => 'cancelled']);

        if ($booking->transaction && $booking->transaction->payment_status === 'paid') {
            $booking->transaction->update(['payment_status' => 'refunded']);
        }

        $booking->load(['user', 'table', 'transaction']);
        TableStatusUpdated::dispatch($booking->table);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan.',
            'data' => new BookingResource($booking),
        ]);
    }

    #[OA\Post(
        path: '/api/bookings/{id}/pay',
        summary: 'Process payment for a booking (Customer)',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Pembayaran berhasil diproses.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function pay(Request $request, Booking $booking): JsonResponse
    {
        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk membayar booking ini.',
            ], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini telah dibatalkan.',
            ], 422);
        }

        if (! $booking->transaction || $booking->transaction->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini sudah lunas atau tidak memiliki tagihan.',
            ], 422);
        }

        // Mock payment process - directly set to paid since Midtrans is removed
        $booking->transaction->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
            'payment_id' => 'MOCK-' . $booking->id . '-' . time(),
        ]);

        $booking->load(['table']);
        TableStatusUpdated::dispatch($booking->table);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dikonfirmasi secara manual.',
            'data' => new BookingResource($booking),
        ]);
    }

    #[OA\Patch(
        path: '/api/bookings/{id}/confirm',
        summary: 'Confirm a pending booking (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking berhasil dikonfirmasi.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function confirm(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking dengan status pending yang dapat dikonfirmasi.',
            ], 422);
        }

        $booking->update(['status' => 'confirmed']);
        $booking->load(['user', 'table', 'transaction']);
        TableStatusUpdated::dispatch($booking->table);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dikonfirmasi.',
            'data' => new BookingResource($booking),
        ]);
    }

    #[OA\Patch(
        path: '/api/bookings/{id}/complete',
        summary: 'Complete a booking (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking berhasil diselesaikan.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function complete(Request $request, Booking $booking): JsonResponse
    {
        if (! in_array($booking->status, ['confirmed', 'pending'])) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking aktif yang dapat diselesaikan.',
            ], 422);
        }

        $booking->update(['status' => 'completed']);
        $booking->load(['user', 'table', 'transaction']);
        TableStatusUpdated::dispatch($booking->table);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil diselesaikan.',
            'data' => new BookingResource($booking),
        ]);
    }

    #[OA\Post(
        path: '/api/bookings/walk-in',
        summary: 'Create a walk-in booking (Admin)',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['table_id', 'duration_hours', 'customer_name'],
                properties: [
                    new OA\Property(property: 'table_id', type: 'integer'),
                    new OA\Property(property: 'duration_hours', type: 'number'),
                    new OA\Property(property: 'customer_name', type: 'string'),
                ]
            )
        ),
        tags: ['Bookings'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking Walk-in berhasil dibuat.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/BookingResource')
                    ]
                )
            ),
        ]
    )]
    public function walkIn(Request $request): JsonResponse
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'table_id' => ['required', 'exists:tables,id'],
            'duration_hours' => ['required', 'numeric', 'min:0.5'],
            'customer_name' => ['required', 'string', 'max:255'],
            'pay_now' => ['sometimes', 'boolean'],
        ]);

        $table = Table::findOrFail($request->table_id);
        
        $now = Carbon::now();
        $startTime = $now->copy();
        $endTime = $now->copy()->addMinutes($request->duration_hours * 60);

        $totalPrice = $request->duration_hours * $table->price_per_hour;

        $payNow = $request->boolean('pay_now', false);

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'table_id' => $table->id,
            'booking_date' => $startTime->format('Y-m-d'),
            'start_time' => $startTime->format('H:i:s'),
            'end_time' => $endTime->format('H:i:s'),
            'duration_hours' => $request->duration_hours,
            'total_price' => $totalPrice,
            'status' => 'confirmed',
            'notes' => 'Walk-in: ' . $request->customer_name,
        ]);

        Transaction::create([
            'booking_id' => $booking->id,
            'amount' => $totalPrice,
            'payment_method' => 'cash',
            'payment_status' => $payNow ? 'paid' : 'unpaid',
            'paid_at' => $payNow ? Carbon::now() : null,
        ]);

        $booking->load(['user', 'table', 'transaction']);
        TableStatusUpdated::dispatch($booking->table);

        $message = $payNow 
            ? 'Booking Walk-in berhasil dibuat dan telah dibayar tunai.'
            : 'Booking Walk-in berhasil dibuat. Pembayaran belum dilakukan.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new BookingResource($booking),
        ], 201);
    }

    #[OA\Delete(
        path: '/api/bookings/{id}',
        summary: 'Delete a booking/transaction',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Booking berhasil dihapus.')
                    ]
                )
            ),
        ]
    )]
    public function destroy(Request $request, Booking $booking): JsonResponse
    {
        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus booking ini.',
            ], 403);
        }

        if ($booking->transaction) {
            $booking->transaction->delete();
        }

        $table = $booking->table;
        $booking->delete();

        if ($table) {
            TableStatusUpdated::dispatch($table);
        }

        if (Booking::count() === 0) {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE bookings AUTO_INCREMENT = 1');
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE transactions AUTO_INCREMENT = 1');
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dihapus.',
        ]);
    }
    #[OA\Get(
        path: '/api/bookings/{id}/ticket',
        summary: 'Get booking e-ticket',
        security: [['bearerAuth' => []]],
        tags: ['Bookings'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'E-Ticket berhasil diambil.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'booking_code', type: 'string'),
                                new OA\Property(property: 'customer_name', type: 'string'),
                                new OA\Property(property: 'table_name', type: 'string'),
                                new OA\Property(property: 'booking_date', type: 'string'),
                                new OA\Property(property: 'start_time', type: 'string'),
                                new OA\Property(property: 'end_time', type: 'string'),
                                new OA\Property(property: 'duration', type: 'string'),
                                new OA\Property(property: 'status', type: 'string'),
                                new OA\Property(property: 'total_price', type: 'number'),
                                new OA\Property(property: 'qr_data', type: 'string'),
                            ]
                        )
                    ]
                )
            ),
        ]
    )]
    public function ticket(Request $request, Booking $booking): JsonResponse
    {
        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke e-ticket ini.',
            ], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini telah dibatalkan.',
            ], 422);
        }

        $booking->load(['user', 'table']);

        $ticketData = [
            'booking_code' => 'BIL-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT),
            'customer_name' => $booking->user?->name,
            'table_name' => $booking->table?->name,
            'booking_date' => Carbon::parse($booking->booking_date)->format('d M Y'),
            'start_time' => Carbon::parse($booking->start_time)->format('H:i'),
            'end_time' => Carbon::parse($booking->end_time)->format('H:i'),
            'duration' => $booking->duration_hours . ' Jam',
            'status' => $booking->status,
            'total_price' => $booking->total_price,
            'qr_data' => base64_encode('BIL-' . $booking->id . '-' . $booking->user_id)
        ];

        return response()->json([
            'success' => true,
            'message' => 'E-Ticket berhasil diambil.',
            'data' => $ticketData,
        ]);
    }
}

