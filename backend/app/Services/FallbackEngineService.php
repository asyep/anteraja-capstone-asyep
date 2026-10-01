<?php

declare(strict_types=1);

namespace App\Services;

class FallbackEngineService
{
    public function generate(array $shipment): array
    {
        $destination = $this->safeValue($shipment['customer_city'] ?? 'alamat tujuan', 40);
        $status = strtolower((string) ($shipment['order_status'] ?? ''));
        $text = match ($status) {
            'delivered' => "Paket Anda sudah diterima di {$destination}. Terima kasih telah mempercayakan pengiriman kepada Anteraja. Jika paket belum diterima langsung oleh Anda, silakan tanyakan kepada penerima di alamat tujuan.",
            'canceled' => 'Pengiriman paket Anda saat ini dibatalkan. Untuk mengetahui alasan pembatalan atau mengatur pengiriman kembali, silakan hubungi penjual atau layanan pelanggan Anteraja dengan menyebutkan nomor resi.',
            default => $this->inTransitNarrative($shipment, $destination),
        };

        return [
            'text' => $text,
            'is_fallback' => true,
            'provider' => 'fallback',
            'generated_at' => now()->toIso8601String(),
        ];
    }

    private function inTransitNarrative(array $shipment, string $destination): string
    {
        if (($shipment['has_delay'] ?? false) === true) {
            $reason = $this->safeValue(
                $shipment['logistics_delay_reason'] ?? 'kondisi operasional',
                35,
            );

            return "Kiriman Anda menuju {$destination}. Perjalanan sedikit berubah karena {$reason}. Satria Anteraja terus memantau situasi dan menjaga paket tetap aman. Estimasi dapat berubah mengikuti kondisi lapangan. Kami akan memberi kabar saat ada pembaruan berikutnya.";
        }

        return "Paket Anda sedang dalam perjalanan menuju {$destination}. Tim Satria Anteraja terus memantau proses pengiriman dan memastikan kiriman ditangani dengan aman. Status akan diperbarui saat paket tiba di titik berikutnya.";
    }

    private function safeValue(string $value, int $maxLength): string
    {
        $cleanValue = trim(strip_tags($value));

        return mb_substr($cleanValue === '' ? 'alamat tujuan' : $cleanValue, 0, $maxLength);
    }
}
