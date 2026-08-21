<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'TableResource',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'table_number', type: 'string'),
        new OA\Property(property: 'type', type: 'string'),
        new OA\Property(property: 'price_per_hour', type: 'number'),
        new OA\Property(property: 'price_per_hour_formatted', type: 'string'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'is_active', type: 'boolean'),
        new OA\Property(
            property: 'schedules',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/ScheduleResource'),
            nullable: true
        ),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
class TableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'table_number' => $this->table_number,
            'type' => $this->type,
            'price_per_hour' => (float) $this->price_per_hour,
            'price_per_hour_formatted' => 'Rp '.number_format($this->price_per_hour, 0, ',', '.'),
            'description' => $this->description,
            'is_active' => $this->is_active,
            'schedules' => ScheduleResource::collection($this->whenLoaded('schedules')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
