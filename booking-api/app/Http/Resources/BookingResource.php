<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'BookingResource',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user', ref: '#/components/schemas/UserResource', nullable: true),
        new OA\Property(property: 'table', ref: '#/components/schemas/TableResource', nullable: true),
        new OA\Property(property: 'booking_date', type: 'string', format: 'date'),
        new OA\Property(property: 'start_time', type: 'string', format: 'time'),
        new OA\Property(property: 'end_time', type: 'string', format: 'time'),
        new OA\Property(property: 'duration_hours', type: 'number'),
        new OA\Property(property: 'total_price', type: 'number'),
        new OA\Property(property: 'total_price_formatted', type: 'string'),
        new OA\Property(property: 'status', type: 'string'),
        new OA\Property(property: 'notes', type: 'string', nullable: true),
        new OA\Property(property: 'transaction', ref: '#/components/schemas/TransactionResource', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'table' => new TableResource($this->whenLoaded('table')),
            'booking_date' => $this->booking_date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'duration_hours' => (float) $this->duration_hours,
            'total_price' => (float) $this->total_price,
            'total_price_formatted' => 'Rp '.number_format($this->total_price, 0, ',', '.'),
            'status' => $this->status,
            'notes' => $this->notes,
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
