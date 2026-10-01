<?php

namespace Tests\Feature;

use App\Jobs\NotifikasiFeedbackKurang;
use App\Models\Feedback;
use App\Services\FallbackEngineService;
use App\Services\GeminiAIService;
use App\Services\MilestoneMapperService;
use App\Services\TrackingWidget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class TrackingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_invalid_waybill_is_rejected_before_tracking_lookup(): void
    {
        $response = $this->getJson('/api/v1/tracking/12345');

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('waybill_number')
            ->assertHeader('X-Waktu-Ms');
    }

    public function test_missing_shipment_returns_the_frd_not_found_message(): void
    {
        $this->mock(TrackingWidget::class)
            ->shouldReceive('dataWidget')
            ->once()
            ->with('ffffffffffffffffffffffffffffffff')
            ->andReturnNull();

        $this->getJson('/api/v1/tracking/ffffffffffffffffffffffffffffffff')
            ->assertNotFound()
            ->assertJsonPath(
                'message',
                'Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi yang Anda masukkan.',
            )
            ->assertHeader('X-Waktu-Ms');
    }

    public function test_tracking_response_contains_mapped_milestones_eta_and_is_cached(): void
    {
        $waybill = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
        $this->mock(TrackingWidget::class)
            ->shouldReceive('dataWidget')
            ->once()
            ->with($waybill)
            ->andReturn([
                'waybill_number' => $waybill,
                'order_status' => 'in_transit',
                'seller_city' => 'Jakarta',
                'customer_city' => 'Bandung',
                'order_purchase_timestamp' => '2026-09-28T08:00:00+00:00',
                'order_delivered_carrier_date' => '2026-09-28T14:00:00+00:00',
                'order_delivered_customer_date' => null,
                'order_estimated_delivery_date' => '2026-10-02',
                'waiting_time_minutes' => 30,
                'logistics_delay_reason' => 'None',
                'has_delay' => false,
                'events' => [],
            ]);

        $this->mock(GeminiAIService::class)
            ->shouldReceive('generate')
            ->once()
            ->andReturn([
                'text' => str_repeat('Paket aman menuju alamat tujuan. ', 5),
                'is_fallback' => true,
                'provider' => 'fallback',
            ]);

        $firstResponse = $this->getJson('/api/v1/tracking/'.$waybill);
        $secondResponse = $this->getJson('/api/v1/tracking/'.$waybill);

        $firstResponse
            ->assertOk()
            ->assertJsonPath('data.current_milestone_stage', 'IN_TRANSIT')
            ->assertJsonPath('data.has_delay', false)
            ->assertJsonPath('data.order_estimated_delivery_date', '2026-10-02T18:30:00+07:00')
            ->assertJsonPath('data.formatted_eta', '02 Oktober 2026, 18:30 WIB')
            ->assertJsonCount(4, 'data.milestone_stages')
            ->assertHeader('X-Waktu-Ms')
            ->assertHeader('Cache-Control')
            ->assertHeader('ETag');
        $secondResponse->assertOk();
    }

    public function test_gemini_http_errors_use_a_character_limited_fallback(): void
    {
        config(['services.gemini.api_key' => 'test-key']);
        Http::fake(['*' => Http::response(['error' => 'unavailable'], 503)]);

        $narrative = app(GeminiAIService::class)->generate([
            'order_status' => 'in_transit',
            'customer_city' => 'Bandung',
            'has_delay' => true,
            'logistics_delay_reason' => 'Weather',
            'formatted_eta' => '02 Oktober 2026, 18:30 WIB',
        ]);

        $this->assertTrue($narrative['is_fallback']);
        $this->assertGreaterThanOrEqual(150, mb_strlen($narrative['text']));
        $this->assertLessThanOrEqual(250, mb_strlen($narrative['text']));
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('x-goog-api-key', 'test-key')
            && str_contains($request->url(), 'generateContent')
        );
    }

    public function test_gemini_connection_timeout_uses_fallback(): void
    {
        config(['services.gemini.api_key' => 'test-key']);
        Http::fake(['*' => Http::failedConnection()]);

        $narrative = app(GeminiAIService::class)->generate([
            'order_status' => 'in_transit',
            'customer_city' => 'Bandung',
            'has_delay' => false,
        ]);

        $this->assertTrue($narrative['is_fallback']);
        $this->assertGreaterThanOrEqual(150, mb_strlen($narrative['text']));
        $this->assertLessThanOrEqual(250, mb_strlen($narrative['text']));
        Http::assertSentCount(1);
    }

    public function test_vite_origin_is_allowed_for_cors_preflight(): void
    {
        $this->withHeaders([
            'Origin' => 'http://localhost:5173',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/v1/tracking/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6')
            ->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }

    public function test_feedback_is_saved_and_negative_feedback_dispatches_notification(): void
    {
        Queue::fake();
        $waybill = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

        $response = $this->postJson('/api/v1/feedback', [
            'resi' => $waybill,
            'membantu' => false,
            'catatan' => 'Informasi estimasi belum jelas.',
        ]);

        $response->assertCreated()->assertJsonPath('ok', true);
        $this->assertDatabaseHas('feedback', [
            'resi' => $waybill,
            'membantu' => false,
            'catatan' => 'Informasi estimasi belum jelas.',
        ]);

        $feedback = Feedback::query()->firstOrFail();
        Queue::assertPushed(NotifikasiFeedbackKurang::class, fn (NotifikasiFeedbackKurang $job): bool => $job->feedbackId === $feedback->id
            && $job->tries === 3
            && $job->backoff === [10, 60]
        );
    }

    public function test_helpful_feedback_does_not_dispatch_notification(): void
    {
        Queue::fake();

        $this->postJson('/api/v1/feedback', [
            'resi' => 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            'membantu' => true,
        ])->assertCreated();

        Queue::assertNotPushed(NotifikasiFeedbackKurang::class);
    }

    public function test_rule_based_fallback_covers_tracking_statuses(): void
    {
        $fallback = app(FallbackEngineService::class);

        foreach (['in_transit', 'delivered', 'canceled'] as $status) {
            $narrative = $fallback->generate([
                'order_status' => $status,
                'customer_city' => 'Bandung',
            ]);

            $this->assertTrue($narrative['is_fallback']);
            $this->assertGreaterThanOrEqual(150, mb_strlen($narrative['text']));
            $this->assertLessThanOrEqual(250, mb_strlen($narrative['text']));
        }
    }

    public function test_status_translation_uses_the_configured_cs_copy(): void
    {
        $this->assertSame(
            'Paket sudah dicatat, menunggu diambil kurir.',
            app(TrackingWidget::class)->statusRamah('MANIFESTED'),
        );
    }

    public function test_heavy_traffic_sets_the_operational_delay_flag(): void
    {
        $mapped = app(MilestoneMapperService::class)->map([
            'order_status' => 'in_transit',
            'logistics_delay_reason' => 'None',
            'traffic_status' => 'Heavy',
        ]);

        $this->assertTrue($mapped['has_delay']);
    }
}
