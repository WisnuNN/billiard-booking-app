<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'table_number' => ['required', 'string', 'max:50', 'unique:tables'],
            'type' => ['required', 'in:standard,VIP,premium'],
            'price_per_hour' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama meja wajib diisi.',
            'table_number.required' => 'Nomor meja wajib diisi.',
            'table_number.unique' => 'Nomor meja sudah digunakan.',
            'type.required' => 'Tipe meja wajib diisi.',
            'type.in' => 'Tipe meja harus standard, VIP, atau premium.',
            'price_per_hour.required' => 'Harga per jam wajib diisi.',
            'price_per_hour.numeric' => 'Harga per jam harus berupa angka.',
            'price_per_hour.min' => 'Harga per jam tidak boleh negatif.',
        ];
    }
}
