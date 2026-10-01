<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'waybill_number' => [
                'required',
                'string',
                'regex:/^[a-zA-Z0-9]{32}$/',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'waybill_number' => $this->route('waybill_number'),
        ]);
    }

    public function messages(): array
    {
        return [
            'waybill_number.required' => 'Nomor resi wajib diisi.',
            'waybill_number.regex' => 'Nomor resi harus berupa 32 karakter alfanumerik.',
        ];
    }
}
