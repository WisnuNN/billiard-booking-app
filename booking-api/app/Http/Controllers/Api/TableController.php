<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TableController extends Controller
{
    #[OA\Get(
        path: '/api/tables',
        summary: 'Get list of tables',
        tags: ['Tables'],
        parameters: [
            new OA\Parameter(name: 'limit', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'type', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
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
                            items: new OA\Items(ref: '#/components/schemas/TableResource')
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
        $query = Table::query();

        if (! $request->user() || ! $request->user()->isAdmin()) {
            $query->active();
        } elseif ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $tables = $query->with('schedules')
            ->orderBy('table_number')
            ->paginate($request->get('limit', 10));

        return response()->json([
            'success' => true,
            'data' => TableResource::collection($tables),
            'meta' => [
                'current_page' => $tables->currentPage(),
                'last_page' => $tables->lastPage(),
                'limit' => $tables->perPage(),
                'total' => $tables->total(),
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/tables/{id}',
        summary: 'Get table information',
        tags: ['Tables'],
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
                        new OA\Property(property: 'data', ref: '#/components/schemas/TableResource')
                    ]
                )
            ),
        ]
    )]
    public function show(Table $table): JsonResponse
    {
        $table->load('schedules');

        return response()->json([
            'success' => true,
            'data' => new TableResource($table),
        ]);
    }

    #[OA\Post(
        path: '/api/tables',
        summary: 'Create a new table (Admin)',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['table_number', 'name', 'type', 'price_per_hour'],
                properties: [
                    new OA\Property(property: 'table_number', type: 'string'),
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'type', type: 'string'),
                    new OA\Property(property: 'capacity', type: 'integer'),
                    new OA\Property(property: 'price_per_hour', type: 'number'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'is_active', type: 'boolean'),
                ]
            )
        ),
        tags: ['Tables'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Meja berhasil ditambahkan.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/TableResource')
                    ]
                )
            ),
        ]
    )]
    public function store(StoreTableRequest $request): JsonResponse
    {
        $table = Table::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil ditambahkan.',
            'data' => new TableResource($table),
        ], 201);
    }

    #[OA\Put(
        path: '/api/tables/{id}',
        summary: 'Update existing table (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Tables'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'table_number', type: 'string'),
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'type', type: 'string'),
                    new OA\Property(property: 'capacity', type: 'integer'),
                    new OA\Property(property: 'price_per_hour', type: 'number'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'is_active', type: 'boolean'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Meja berhasil diperbarui.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/TableResource')
                    ]
                )
            ),
        ]
    )]
    public function update(UpdateTableRequest $request, Table $table): JsonResponse
    {
        $table->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil diperbarui.',
            'data' => new TableResource($table),
        ]);
    }

    #[OA\Delete(
        path: '/api/tables/{id}',
        summary: 'Delete a table (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Tables'],
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
                        new OA\Property(property: 'message', type: 'string', example: 'Meja berhasil dihapus.')
                    ]
                )
            ),
        ]
    )]
    public function destroy(Table $table): JsonResponse
    {
        $table->delete();

        // Jika data meja sudah kosong semua, reset auto increment kembali ke 1
        if (Table::count() === 0) {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE tables AUTO_INCREMENT = 1');
        }

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil dihapus.',
        ]);
    }

    #[OA\Get(
        path: '/api/tables/monitor',
        summary: 'Monitor live table status (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Tables'],
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
                                    new OA\Property(property: 'id', type: 'integer'),
                                    new OA\Property(property: 'table_number', type: 'string'),
                                    new OA\Property(property: 'name', type: 'string'),
                                    new OA\Property(property: 'type', type: 'string'),
                                    new OA\Property(property: 'is_occupied', type: 'boolean'),
                                    new OA\Property(property: 'time_remaining_minutes', type: 'integer'),
                                    new OA\Property(
                                        property: 'active_booking',
                                        type: 'object',
                                        nullable: true,
                                        properties: [
                                            new OA\Property(property: 'id', type: 'integer'),
                                            new OA\Property(property: 'customer_name', type: 'string'),
                                            new OA\Property(property: 'start_time', type: 'string', format: 'time'),
                                            new OA\Property(property: 'end_time', type: 'string', format: 'time'),
                                        ]
                                    )
                                ]
                            )
                        )
                    ]
                )
            ),
        ]
    )]
    public function monitor(Request $request): JsonResponse
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $now = \Carbon\Carbon::now();
        $date = $now->format('Y-m-d');

        $tables = Table::active()->orderBy('table_number')->get()->map(function ($table) use ($date, $now) {
            $activeBooking = $table->bookings()
                ->with('user')
                ->where('booking_date', $date)
                ->whereIn('status', ['pending', 'confirmed'])
                ->get()
                ->first(function ($booking) use ($now) {
                    $start = \Carbon\Carbon::parse($booking->start_time);
                    $end = \Carbon\Carbon::parse($booking->end_time);
                    if ($end->lte($start)) {
                        $end->addDay();
                    }
                    return $now->between($start, $end);
                });

            $timeRemaining = 0;
            if ($activeBooking) {
                $end = \Carbon\Carbon::parse($activeBooking->end_time);
                $start = \Carbon\Carbon::parse($activeBooking->start_time);
                if ($end->lte($start)) {
                    $end->addDay();
                }
                $timeRemaining = $now->diffInMinutes($end);
            }

            return [
                'id' => $table->id,
                'table_number' => $table->table_number,
                'name' => $table->name,
                'type' => $table->type,
                'price_per_hour' => $table->price_per_hour,
                'is_occupied' => $activeBooking ? true : false,
                'time_remaining_minutes' => $timeRemaining,
                'active_booking' => $activeBooking ? [
                    'id' => $activeBooking->id,
                    'customer_name' => $activeBooking->notes && str_starts_with($activeBooking->notes, 'Walk-in: ')
                        ? str_replace('Walk-in: ', '', $activeBooking->notes)
                        : ($activeBooking->user ? $activeBooking->user->name : 'Walk-in'),
                    'start_time' => \Carbon\Carbon::parse($activeBooking->start_time)->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($activeBooking->end_time)->format('H:i'),
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $tables,
        ]);
    }
}
