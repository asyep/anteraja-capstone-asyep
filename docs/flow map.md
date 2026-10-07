# Flow Map

```text
[ USER ACT ]                  [ SYSTEM / BACKEND PROCESS ]             [ STATE / UI OUTPUT ]

 ┌──────────┐
 │  START   │
 └────┬─────┘
      │
      ▼
┌───────────┐                  ┌──────────────────────────┐             ┌─────────────────────────┐
│ User Opens│ ───────────────► │ Render Initial Widget    │ ──────────► │ STATE 0: IDLE           │
│ Tracking  │                  │ - Search Input Empty     │             │ - Form Input Ready      │
│ Widget    │                  │ - Reset Component State  │             │ - Empty Placeholder     │
└───────────┘                  └──────────────────────────┘             └─────────────────────────┘
      │
      ▼
┌───────────┐
│ Input     │
│ Waybill   │
│ Number    │
└────┬──────┘
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│ [DECISION 1] Client-Side Regex Validation (React)       │
│ Apakah waybill_number == Alphanumeric 32 Karakter?      │
└────┬───────────────────────────────────────────────┬────┘
     │ (TIDAK)                                       │ (YA)
     ▼                                               ▼
┌─────────────────────────┐             ┌──────────────────────────┐    ┌─────────────────────────┐
│ STATE E1: VALIDATION ERR│             │ Set Loading State = true │ ─► │ STATE 1: LOADING        │
│ - Show Red Text:        │             │ - Lock Search Button     │   │ - Skeleton Loader UI    │
│   "Resi harus 32 char"  │             │ - Trigger HTTP GET Request│   │ - Anti-Spam Lock        │
└─────────────────────────┘             └──────────────────────────┘   └────────────┬─────────────┘
                                                                                     │
                                                                                     ▼
                               ┌──────────────────────────────────────────┐
                               │ [DECISION 2] Redis Cache Lookup          │
                               │ Key: tracking:waybill:{waybill_number}   │
                               └────┬────────────────────────────────┬────┘
                                    │ (CACHE HIT - <20ms)            │ (CACHE MISS)
                                    │                                ▼
                                    │                           ┌─────────────────────────┐
                                    │                           │ Query PostgreSQL DB     │
                                    │                           │ JOIN 5 Main Tables      │
                                    │                           └────────────┬────────────┘
                                    │                                        │
                                    │            ┌───────────────────────────┴───────────────────────────┐
                                    │            │ [DECISION 3] Database Lookup Check                    │
                                    │            │ Apakah data resi ditemukan di PostgreSQL DB?          │
                                    │            └────┬─────────────────────────────────────────────┬────┘
                                    │                 │ (TIDAK FOUND)                               │ (FOUND)
                                    │                 ▼                                             ▼
                                    │    ┌─────────────────────────┐                   ┌─────────────────────────┐
                                    │    │ HTTP 404 Not Found      │                   │ Extract Logistics Data  │
                                    │    ├─────────────────────────┤                   │ - Timestamps & Context  │
                                    │    │ STATE E2: NOT FOUND     │                   │ - Cities & Freight      │
                                    │    │ - Render 404 Card UI    │                   └────────────┬────────────┘
                                    │    │ - Friendly Error Msg    │                                │
                                    │    └─────────────────────────┘                                ▼
                                    │                                           ┌───────────────────────────────────────┐
                                    │                                           │ [DECISION 4] Order Status Check       │
                                    │                                           │ Apakah status == 'canceled'?          │
                                    │                                           └────┬─────────────────────────────┬────┘
                                    │                                                │ (YA)                        │ (TIDAK)
                                    │                                                ▼                             ▼
                                    │                                   ┌─────────────────────────┐   ┌──────────────────────────┐
                                    │                                   │ STATE E3: CANCELED      │   │ Process 4-Stage Stepper  │
                                    │                                   │ - Red Warning Stepper   │   │ Map Timestamps WIB       │
                                    │                                   │ - Stop Stepper Progres  │   └────────────┬─────────────┘
                                    │                                   └─────────────────────────┘                │
                                    │                                                                              ▼
                                    │                                                   ┌───────────────────────────────────────┐
                                    │                                                   │ [DECISION 5] Operational Condition    │
                                    │                                                   │ Check delay_reason / traffic_status   │
                                    │                                                   └────┬─────────────────────────────┬────┘
                                    │                                                        │ (HAS DELAY)                 │ (CLEAR)
                                    │                                                        ▼                             ▼
                                    │                                           ┌─────────────────────────┐   ┌──────────────────────────┐
                                    │                                           │ Set has_delay = true    │   │ Set has_delay = false    │
                                    │                                           │ Recalculate ETA         │   │ Set Standard ETA         │
                                    │                                           └────────────┬────────────┘   └────────────┬─────────────┘
                                    │                                                        │                             │
                                    │                                                        └──────────────┬──────────────┘
                                    │                                                                       │
                                    │                                                                       ▼
                                    │                                                   ┌───────────────────────────────────────┐
                                    │                                                   │ AI Prompt Payload Construction        │
                                    │                                                   │ Trigger Gemini LLM API (Timeout 1.2s) │
                                    │                                                   └────┬─────────────────────────────┬────┘
                                    │                                                        │                              │
                                    │                                    ┌───────────────────┴───────────────┐              │
                                    │                                    │ [DECISION 6] LLM Response Check   │              │
                                    │                                    │ Apakah Gemini API Success <1.2s?  │              │
                                    │                                    └────┬─────────────────────────┬────┘              │
                                    │                                         │ (TIMEOUT / ERROR)       │ (SUCCESS)         │
                                    │                                         ▼                         ▼                   │
                                    │                            ┌─────────────────────────┐ ┌──────────────────────────┐   │
                                    │                            │ Rule-Based Fallback     │ │ Use Gemini AI Narrative  │   │
                                    │                            │ Set is_fallback = true  │ │ Set is_fallback = false │   │
                                    │                            └────────────┬────────────┘ └──────────┬───────────────┘   │
                                    │                                         │                         │                   │
                                    │                                         └────────────┬────────────┘                   │
                                    │                                                      │                                │
                                    │                                                      ▼                                │
                                    │                                           ┌─────────────────────────┐                 │
                                    │                                           │ Save Payload to Redis   │                 │
                                    │                                           │ (TTL = 300 Seconds)     │                 │
                                    │                                           └────────────┬────────────┘                 │
                                    │                                                        │                              │
                                    │◄───────────────────────────────────────────────────────┴──────────────────────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ HTTP 200 OK Response      │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STATE 2 / STATE 3: SUCCESSFUL TRACKING DISPLAY                                                                                 │
│                                                                                                                                │
│  [ F-05 Dynamic ETA Badge ]           ──► Displays "Estimasi Tiba: DD Month YYYY, Jam WIB" / "Tiba pada..."                    │
│  [ F-04 Operational Warning Banner ]  ──► Displays Orange Alert Box IF (has_delay == true) ELSE Hidden                         │
│  [ F-03 AI Status Narrative Box ]     ──► Displays AI/Fallback Sentence Text (Satria Assistant Avatar)                         │
│  [ F-02 Visual Milestone Stepper ]    ──► Displays 4-Stage Stepper (Order Created -> Pickup -> In Transit -> Delivered)        │
│  [ Supplementary Info Area ]          ──► Displays Sender/Receiver City, Shipping Service Name, Free Shipping Tag              │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌───────────┐
│   END     │
└───────────┘
```