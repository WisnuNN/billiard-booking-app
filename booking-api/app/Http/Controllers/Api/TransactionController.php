<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TransactionController extends Controller
{
    #[OA\Get(
        path: '/api/transactions',
        summary: 'Get list of transactions (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Transactions'],
        parameters: [
            new OA\Parameter(name: 'limit', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'payment_status', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['unpaid', 'paid', 'refunded'])),
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
                            items: new OA\Items(ref: '#/components/schemas/TransactionResource')
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
        $query = Transaction::with(['booking.user', 'booking.table']);

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('booking', function ($q) use ($request) {
                $q->whereBetween('booking_date', [$request->start_date, $request->end_date]);
            });
        }

        $transactions = $query->latest()->paginate($request->get('limit', 15));

        return response()->json([
            'success' => true,
            'data' => TransactionResource::collection($transactions),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'limit' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/transactions/{id}',
        summary: 'Get transaction information (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Transactions'],
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
                        new OA\Property(property: 'data', ref: '#/components/schemas/TransactionResource')
                    ]
                )
            ),
        ]
    )]
    public function show(Transaction $transaction): JsonResponse
    {
        $transaction->load(['booking.user', 'booking.table']);

        return response()->json([
            'success' => true,
            'data' => new TransactionResource($transaction),
        ]);
    }

    #[OA\Patch(
        path: '/api/transactions/{id}',
        summary: 'Update transaction payment status (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Transactions'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['payment_status'],
                properties: [
                    new OA\Property(property: 'payment_status', type: 'string', enum: ['unpaid', 'paid', 'refunded']),
                    new OA\Property(property: 'payment_method', type: 'string'),
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
                        new OA\Property(property: 'message', type: 'string', example: 'Status transaksi berhasil diperbarui.'),
                        new OA\Property(property: 'data', ref: '#/components/schemas/TransactionResource')
                    ]
                )
            ),
        ]
    )]
    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'payment_method' => 'nullable|string'
        ]);
        
        if ($validated['payment_status'] === 'paid' && $transaction->payment_status !== 'paid') {
            $validated['paid_at'] = now();
        }

        $transaction->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi berhasil diperbarui.',
            'data' => new TransactionResource($transaction->fresh(['booking.user', 'booking.table'])),
        ]);
    }

    #[OA\Delete(
        path: '/api/transactions/{id}',
        summary: 'Delete a transaction (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Transactions'],
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
                        new OA\Property(property: 'message', type: 'string', example: 'Transaksi berhasil dihapus.')
                    ]
                )
            ),
        ]
    )]
    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        if (Transaction::count() === 0) {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE transactions AUTO_INCREMENT = 1');
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus.',
        ]);
    }

    #[OA\Delete(
        path: '/api/transactions',
        summary: 'Delete all transactions (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Transactions'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Successful operation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Semua transaksi berhasil dihapus.')
                    ]
                )
            ),
        ]
    )]
    public function destroyAll(): JsonResponse
    {
        Transaction::query()->delete();
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE transactions AUTO_INCREMENT = 1');

        return response()->json([
            'success' => true,
            'message' => 'Semua transaksi berhasil dihapus dan urutan ID di-reset.',
        ]);
    }
}
