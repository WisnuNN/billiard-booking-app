<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'TransactionResource',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'booking_id', type: 'integer'),
        new OA\Property(property: 'amount', type: 'number'),
        new OA\Property(property: 'amount_formatted', type: 'string'),
        new OA\Property(property: 'payment_method', type: 'string', nullable: true),
        new OA\Property(property: 'payment_status', type: 'string'),
        new OA\Property(property: 'paid_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'booking', ref: '#/components/schemas/BookingResource', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'amount' => (float) $this->amount,
            'amount_formatted' => 'Rp '.number_format($this->amount, 0, ',', '.'),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'paid_at' => $this->paid_at?->toISOString(),
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
