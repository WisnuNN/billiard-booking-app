<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'table_number' => ['sometimes', 'string', 'max:50', Rule::unique('tables')->ignore($this->route('table'))],
            'type' => ['sometimes', 'in:standard,VIP,premium'],
            'price_per_hour' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'table_number.unique' => 'Nomor meja sudah digunakan.',
            'type.in' => 'Tipe meja harus standard, VIP, atau premium.',
            'price_per_hour.numeric' => 'Harga per jam harus berupa angka.',
            'price_per_hour.min' => 'Harga per jam tidak boleh negatif.',
        ];
    }
}
