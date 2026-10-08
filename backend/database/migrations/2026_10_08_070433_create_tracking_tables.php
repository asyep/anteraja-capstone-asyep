<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->string('waybill_number', 32)->primary();
            $table->string('service_type', 50);
            $table->string('sender_name', 100);
            $table->string('sender_address', 255);
            $table->string('receiver_name', 100);
            $table->string('receiver_address', 255);
            $table->decimal('weight_kg', 8, 2);
            $table->decimal('volume_m3', 8, 3)->nullable();
            $table->boolean('insurance_status')->default(false);
            $table->string('insurance_type', 50)->nullable();
            $table->boolean('is_free_shipping')->default(false);
            $table->boolean('has_sla_guarantee')->default(false);
            $table->string('shipment_status', 30);
            $table->timestampTz('purchase_date')->nullable();
            $table->timestampTz('estimated_delivery_date');
            $table->timestampTz('delivered_date')->nullable();
            $table->timestampsTz();
        });

        Schema::create('couriers', function (Blueprint $table) {
            $table->string('courier_id', 32)->primary();
            $table->string('courier_name', 100);
            $table->string('courier_phone', 20)->nullable();
            $table->text('courier_photo_url')->nullable();
            $table->string('vehicle_type', 50)->nullable();
            $table->string('vehicle_plate', 20)->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent()->nullable();
        });

        Schema::create('shipment_couriers', function (Blueprint $table) {
            $table->string('waybill_number', 32);
            $table->string('courier_id', 32);
            $table->timestampTz('assigned_at')->useCurrent();
            $table->boolean('is_active')->default(true);
            
            $table->primary(['waybill_number', 'courier_id']);
            $table->foreign('waybill_number')->references('waybill_number')->on('shipments')->onDelete('cascade');
            $table->foreign('courier_id')->references('courier_id')->on('couriers')->onDelete('cascade');
        });

        Schema::create('tracking_events', function (Blueprint $table) {
            $table->id('event_id');
            $table->string('waybill_number', 32);
            $table->string('event_code', 40);
            $table->string('milestone_stage', 30)->nullable();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->string('facility_name', 120)->nullable();
            $table->timestampTz('event_at');
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent()->nullable();
            
            $table->foreign('waybill_number')->references('waybill_number')->on('shipments')->onDelete('cascade');
            $table->index(['waybill_number', 'event_at']);
        });

        Schema::create('telemetry_data', function (Blueprint $table) {
            $table->id('telemetry_id');
            $table->string('waybill_number', 32)->unique();
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->decimal('speed_kmh', 5, 1)->nullable();
            $table->string('location_name', 150)->nullable();
            $table->decimal('accuracy_percentage', 5, 2)->nullable();
            $table->boolean('is_gps_active')->default(true);
            $table->string('logistics_delay_reason', 150)->nullable();
            $table->string('traffic_status', 50)->nullable();
            $table->string('weather_condition', 50)->nullable();
            $table->integer('waiting_time_minutes')->default(0);
            $table->timestampTz('observed_at')->useCurrent();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent()->nullable();
            
            $table->foreign('waybill_number')->references('waybill_number')->on('shipments')->onDelete('cascade');
        });

        Schema::create('ai_narratives', function (Blueprint $table) {
            $table->id('narrative_id');
            $table->string('waybill_number', 32);
            $table->string('ai_title', 100)->nullable();
            $table->string('ai_subtitle', 150)->nullable();
            $table->text('narrative_text');
            $table->boolean('is_fallback')->default(false);
            $table->string('provider', 40)->default('gemini');
            $table->string('generation_status', 20);
            $table->timestampTz('generated_at')->useCurrent();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent()->nullable();
            
            $table->foreign('waybill_number')->references('waybill_number')->on('shipments')->onDelete('cascade');
            $table->index(['waybill_number', 'generated_at']);
        });

        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->string('resi');
            $table->boolean('membantu');
            $table->string('catatan')->nullable();
            $table->timestamps();
        });

        DB::statement("
            CREATE OR REPLACE VIEW tracking_summary AS
            SELECT s.waybill_number, s.shipment_status, s.service_type, 
                   s.sender_name, s.sender_address, 
                   s.receiver_name, s.receiver_address, 
                   s.estimated_delivery_date,
                   t.latitude, t.longitude, t.speed_kmh, t.location_name,
                   t.traffic_status, t.weather_condition, t.logistics_delay_reason,
                   a.narrative_text
            FROM shipments s
            LEFT JOIN telemetry_data t ON t.waybill_number = s.waybill_number
            LEFT JOIN ai_narratives a ON a.waybill_number = s.waybill_number;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS tracking_summary");
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('ai_narratives');
        Schema::dropIfExists('telemetry_data');
        Schema::dropIfExists('tracking_events');
        Schema::dropIfExists('shipment_couriers');
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('shipments');
    }
};
