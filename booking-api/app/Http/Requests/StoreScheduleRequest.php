<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'open_time' => ['required', 'date_format:H:i'],
            'close_time' => ['required', 'date_format:H:i', 'after:open_time'],
            'is_available' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'day_of_week.required' => 'Hari wajib diisi.',
            'day_of_week.between' => 'Hari harus antara 0 (Minggu) sampai 6 (Sabtu).',
            'open_time.required' => 'Jam buka wajib diisi.',
            'open_time.date_format' => 'Format jam buka harus HH:mm.',
            'close_time.required' => 'Jam tutup wajib diisi.',
            'close_time.date_format' => 'Format jam tutup harus HH:mm.',
            'close_time.after' => 'Jam tutup harus setelah jam buka.',
        ];
    }
}
