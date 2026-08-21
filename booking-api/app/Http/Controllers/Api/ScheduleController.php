<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Table;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ScheduleController extends Controller
{
    #[OA\Get(
        path: '/api/tables/{table}/schedules',
        summary: 'Get schedules for a table',
        tags: ['Schedules'],
        parameters: [
            new OA\Parameter(name: 'table', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
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
                            items: new OA\Items(ref: '#/components/schemas/ScheduleResource')
                        )
                    ]
                )
            ),
        ]
    )]
    public function index(Table $table): JsonResponse
    {
        $schedules = $table->schedules()
            ->orderBy('day_of_week')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ScheduleResource::collection($schedules),
        ]);
    }

    #[OA\Post(
        path: '/api/tables/{table}/schedules',
        summary: 'Add a new schedule to a table (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Schedules'],
        parameters: [
            new OA\Parameter(name: 'table', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['day_of_week', 'open_time', 'close_time'],
                properties: [
                    new OA\Property(property: 'day_of_week', type: 'integer'),
                    new OA\Property(property: 'open_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'close_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'is_available', type: 'boolean'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Jadwal berhasil ditambahkan.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/ScheduleResource')
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validation Error or duplicate schedule')
        ]
    )]
    public function store(StoreScheduleRequest $request, Table $table): JsonResponse
    {

        $existing = $table->schedules()
            ->where('day_of_week', $request->day_of_week)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal untuk hari tersebut sudah ada. Gunakan update untuk mengubahnya.',
            ], 422);
        }

        $schedule = $table->schedules()->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil ditambahkan.',
            'data' => new ScheduleResource($schedule),
        ], 201);
    }

    #[OA\Put(
        path: '/api/tables/{table}/schedules/{schedule}',
        summary: 'Update a schedule (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Schedules'],
        parameters: [
            new OA\Parameter(name: 'table', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'schedule', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'day_of_week', type: 'integer'),
                    new OA\Property(property: 'open_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'close_time', type: 'string', format: 'time'),
                    new OA\Property(property: 'is_available', type: 'boolean'),
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
                        new OA\Property(property: 'message', type: 'string', example: 'Jadwal berhasil diperbarui.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/ScheduleResource')
                    ]
                )
            ),
        ]
    )]
    public function update(StoreScheduleRequest $request, Table $table, Schedule $schedule): JsonResponse
    {
        $schedule->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil diperbarui.',
            'data' => new ScheduleResource($schedule),
        ]);
    }

    #[OA\Delete(
        path: '/api/tables/{table}/schedules/{schedule}',
        summary: 'Delete a schedule (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Schedules'],
        parameters: [
            new OA\Parameter(name: 'table', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'schedule', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Jadwal berhasil dihapus.')
                    ]
                )
            ),
        ]
    )]
    public function destroy(Table $table, Schedule $schedule): JsonResponse
    {
        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dihapus.',
        ]);
    }

    #[OA\Get(
        path: '/api/tables/{table}/availability',
        summary: 'Check table availability for a specific date',
        tags: ['Schedules'],
        parameters: [
            new OA\Parameter(name: 'table', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'date', in: 'query', required: true, schema: new OA\Schema(type: 'string', format: 'date')),
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
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'date', type: 'string', format: 'date'),
                                new OA\Property(property: 'day_name', type: 'string'),
                                new OA\Property(property: 'is_available', type: 'boolean'),
                                new OA\Property(property: 'message', type: 'string', nullable: true),
                                new OA\Property(property: 'open_time', type: 'string', format: 'time', nullable: true),
                                new OA\Property(property: 'close_time', type: 'string', format: 'time', nullable: true),
                                new OA\Property(
                                    property: 'slots',
                                    type: 'array',
                                    items: new OA\Items(
                                        type: 'object',
                                        properties: [
                                            new OA\Property(property: 'start_time', type: 'string', format: 'time'),
                                            new OA\Property(property: 'end_time', type: 'string', format: 'time'),
                                            new OA\Property(property: 'is_available', type: 'boolean')
                                        ]
                                    )
                                )
                            ]
                        )
                    ]
                )
            ),
        ]
    )]
    public function checkAvailability(Request $request, Table $table): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;

        $schedule = $table->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (! $schedule) {
            return response()->json([
                'success' => true,
                'data' => [
                    'date' => $date->format('Y-m-d'),
                    'day_name' => Schedule::DAY_NAMES[$dayOfWeek],
                    'is_available' => false,
                    'message' => 'Meja tidak tersedia pada hari ini.',
                    'slots' => [],
                ],
            ]);
        }

        $existingBookings = Booking::where('table_id', $table->id)
            ->where('booking_date', $date->format('Y-m-d'))
            ->active()
            ->orderBy('start_time')
            ->get(['start_time', 'end_time', 'status']);

        $openTime = Carbon::parse($schedule->open_time);
        $closeTime = Carbon::parse($schedule->close_time);
        
        if ($closeTime->lte($openTime)) {
            $closeTime->addDay();
        }

        $slots = [];

        $current = $openTime->copy();
        while ($current->lt($closeTime)) {
            $slotEnd = $current->copy()->addHour();
            if ($slotEnd->gt($closeTime)) {
                $slotEnd = $closeTime->copy();
            }

            $isBooked = $existingBookings->contains(function ($booking) use ($current, $slotEnd) {
                $bookingStart = Carbon::parse($booking->start_time);
                $bookingEnd = Carbon::parse($booking->end_time);

                if ($bookingEnd->lte($bookingStart)) {
                    $bookingEnd->addDay();
                }

                return $current->lt($bookingEnd) && $slotEnd->gt($bookingStart);
            });

            $slots[] = [
                'start_time' => $current->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
                'is_available' => ! $isBooked,
            ];

            $current->addHour();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date->format('Y-m-d'),
                'day_name' => Schedule::DAY_NAMES[$dayOfWeek],
                'is_available' => true,
                'open_time' => $schedule->open_time,
                'close_time' => $schedule->close_time,
                'slots' => $slots,
            ],
        ]);
    }
}
