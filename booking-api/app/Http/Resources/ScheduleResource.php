<?php

namespace App\Http\Resources;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'ScheduleResource',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'table_id', type: 'integer'),
        new OA\Property(property: 'day_of_week', type: 'integer'),
        new OA\Property(property: 'day_name', type: 'string'),
        new OA\Property(property: 'open_time', type: 'string', format: 'time'),
        new OA\Property(property: 'close_time', type: 'string', format: 'time'),
        new OA\Property(property: 'is_available', type: 'boolean'),
    ]
)]
class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'table_id' => $this->table_id,
            'day_of_week' => $this->day_of_week,
            'day_name' => Schedule::DAY_NAMES[$this->day_of_week] ?? 'Unknown',
            'open_time' => $this->open_time,
            'close_time' => $this->close_time,
            'is_available' => $this->is_available,
        ];
    }
}
