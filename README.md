# Smart AI Shipment Tracking Widget Anteraja

React migration of the Anteraja shipment tracking prototype. The interface is built with React, React Router, Vite, and Tailwind CSS. The active React application lives in `frontend/`; its tracking widget can use the configured Laravel API while the other route pages retain local demo data.

## Run locally

```bash
cd frontend
npm ci
npm run dev
```

Create and preview a production build:

```bash
cd frontend
npm run build
npm run preview
```

## Project structure

```text
.
├── frontend/                   # React, Vite, and Tailwind CSS application
│   ├── index.html              # Vite document shell; mounts the React app
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Shared layout, state provider, and routes
│   │   ├── components/         # Categorized reusable UI and tracking components
│   │   ├── context/            # Shared shipment and user state
│   │   ├── hooks/              # Tracking and calculator business logic
│   │   ├── services/           # API clients
│   │   ├── utils/              # FRD formatters and constants
│   │   ├── data/               # Local demo shipment data and route lookup
│   │   └── pages/              # React page for each user-facing route
│   ├── package.json
│   └── vite.config.js
├── php-api/                    # Backend PHP latihan dari Modul PHP Extended Guide
├── prototype/                  # Preserved HTML/CSS archive; not loaded by the React app
├── database/                   # Database schema and sample data documentation
└── docs/                       # PRD, FRD, UI references, and project documents
```

`prototype/` is retained as a design and implementation archive outside `frontend/src/`. The React app does not import its HTML, CSS, or JavaScript. Vite starts at `frontend/index.html` and loads only `frontend/src/main.jsx`; the archive is not included in the React runtime.

## Routes

| Route | React page | Purpose |
| --- | --- | --- |
| `/` | `HomePage` | Landing page and shipment lookup entry point |
| `/lacak` | `LacakPage` | Single or batch shipment lookup |
| `/tracking-normal` | `TrackingNormalPage` | In-transit shipment status |
| `/tracking-live` | `TrackingLivePage` | Live telemetry shipment status |
| `/tracking` | `TrackingWarningPage` | Operational warning and rerouted shipment status |
| `/bantuan` | `BantuanPage` | Help search, topics, FAQs, and contact options |
| `/delivered` | `DeliveredPage` | Delivered shipment status |
| `/canceled` | `CanceledPage` | Canceled shipment status |
| `/ai-fallback` | `AiFallbackPage` | Fallback shipment explanation |
| `/not-found` | `NotFoundPage` | Unknown shipment result |
| `/validation-error` | `ValidationErrorPage` | Invalid shipment number |
| `/service-error` | `ServiceErrorPage` | Temporary tracking service error |
| `/loading` | `LoadingPage` | Search progress state |
| `/smart-widget` | `SmartWidgetPage` | Interactive tracking widget and demo controls |
| `/php-tracking-lab` | `PhpTrackingLabPage` | Latihan integrasi React dengan endpoint PHP Asep |

Shipment search and demo links use `src/data/shipmentsData.js` to select the matching status route. The five demo chips open their matching status pages. Valid resi numbers with no matching demo record open the AI fallback page; invalid formats open the validation error page. Header and footer are shared by `App` across routes.

## Component layout

```text
App
├── Header
├── Route page
│   ├── HomePage / LacakPage / BantuanPage
│   ├── TrackingNormalPage / TrackingLivePage / TrackingWarningPage
│   └── DeliveredPage / CanceledPage / error and loading pages
└── Footer

SmartWidgetPage
├── SearchBox
├── DynamicETABadge
├── OperationalWarningBanner
├── AINarrativeBox
├── VisualMilestoneStepper
├── ShipmentList
│   ├── ShipmentCard
│   └── EmptyState
├── ShipmentSummary
└── ShippingCalculator
```

Pages and components are JSX. Visual styling uses Tailwind utility classes; `frontend/src/index.css` loads Tailwind v4, defines theme tokens, and sets small document-wide defaults. There are no page-specific CSS files in the React runtime. The CSS files under `prototype/` remain archived and are not imported.

## State and data

- `frontend/src/App.jsx` owns the shared header, footer, shipment provider, and route configuration.
- Each route page owns its local form and interaction state.
- Tracking and lookup pages own their local input state and use the shared `getRouteForResi` lookup before navigation.
- `SmartWidgetPage` owns the shipment status filter and connects search to the async tracking hook; child components receive data through props.
- `useShippingCalculator` owns calculator state and computes the demo cost and ETA.
- `frontend/src/data/shipmentsData.js` maps demo waybills to routes and validates supported legacy formats: 13–14 numeric digits or 32 alphanumeric characters. The Smart Widget follows F-01's exact 32-character alphanumeric validation.
- `frontend/src/data/mockShipments.js` provides detailed local records for route demos.

All shipment information, ETA calculations, and telemetry messages are simulations for the frontend prototype.

## PHP module — Asep

Bagian Asep dari **Modul PHP Extended Guide** telah diterapkan dalam folder [`php-api/`](php-api/):

- Hari 1: `statusRamah()` menerjemahkan `MANIFESTED`, `ARRIVED_AT_HUB`, dan `OUT_FOR_DELIVERY` menjadi bahasa pelanggan.
- Hari 2: class `TrackingWidget` menyusun data tracking per resi tanpa mencetak HTML.
- `shipment-history.php`, `tracking-widget.php`, dan `tracking.php` menyediakan endpoint GET JSON. `feedback.php` menerima POST JSON dan mencatat feedback sederhana, sedangkan `tracking-download.php` mengunduh riwayat sebagai `.txt`.
- Route React `/php-tracking-lab` menunjukkan penggunaan `fetch()` untuk mengambil riwayat, membuka widget, dan mengirim feedback.

Jalankan backend dari root proyek:

```bash
php -S localhost:8000 -t php-api
```

Untuk mengaktifkan halaman latihan PHP, atur URL PHP terpisah di `frontend/.env`, lalu jalankan ulang Vite:

```env
VITE_PHP_API_URL=http://localhost:8000
```

Dokumentasi endpoint dan alternatif XAMPP tersedia di [`php-api/README.md`](php-api/README.md).
