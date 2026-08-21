<?php

namespace App\Http\Requests;

use App\Models\Booking;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_id' => ['required', 'exists:tables,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->any()) {
                return;
            }

            $this->validateScheduleAvailability($validator);
            $this->validateNoConflict($validator);
        });
    }

    private function validateScheduleAvailability($validator): void
    {
        $bookingDate = Carbon::parse($this->booking_date);
        $dayOfWeek = $bookingDate->dayOfWeek;

        $schedule = Schedule::where('table_id', $this->table_id)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (! $schedule) {
            $validator->errors()->add('booking_date', 'Meja tidak tersedia pada hari tersebut.');

            return;
        }

        $startTime = Carbon::parse($this->start_time);
        $endTime = Carbon::parse($this->end_time);
        $openTime = Carbon::parse($schedule->open_time);
        $closeTime = Carbon::parse($schedule->close_time);

        if ($closeTime->format('H:i') === '00:00' || $closeTime->format('H:i') < $openTime->format('H:i')) {
            $closeTime->addDay();
        }

        if ($endTime->format('H:i') === '00:00' || $endTime->format('H:i') < $startTime->format('H:i')) {
            $endTime->addDay();
        }

        if ($startTime->lt($openTime) || $endTime->gt($closeTime)) {
            $openFmt = Carbon::parse($schedule->open_time)->format('H:i');
            $closeFmt = Carbon::parse($schedule->close_time)->format('H:i');
            $validator->errors()->add(
                'start_time',
                "Jam booking harus dalam jam operasional ({$openFmt} - {$closeFmt})."
            );
        }
    }

    private function validateNoConflict($validator): void
    {
        $conflicting = Booking::where('table_id', $this->table_id)
            ->where('booking_date', $this->booking_date)
            ->active()
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('start_time', '<', $this->end_time)
                        ->where('end_time', '>', $this->start_time);
                });
            })
            ->exists();

        if ($conflicting) {
            $validator->errors()->add(
                'start_time',
                'Jadwal bentrok dengan booking lain. Silakan pilih waktu lain.'
            );
        }
    }

    public function messages(): array
    {
        return [
            'table_id.required' => 'Meja wajib dipilih.',
            'table_id.exists' => 'Meja tidak ditemukan.',
            'booking_date.required' => 'Tanggal booking wajib diisi.',
            'booking_date.after_or_equal' => 'Tanggal booking tidak boleh di masa lalu.',
            'start_time.required' => 'Jam mulai wajib diisi.',
            'start_time.date_format' => 'Format jam mulai harus HH:mm.',
            'end_time.required' => 'Jam selesai wajib diisi.',
            'end_time.date_format' => 'Format jam selesai harus HH:mm.',
            'end_time.after' => 'Jam selesai harus setelah jam mulai.',
        ];
    }
}
