# Smart AI Shipment Tracking Widget Anteraja

React migration of the Anteraja shipment tracking prototype. The interface is built with React, React Router, Vite, and Tailwind CSS. Tracking and service information currently uses local demo data; it is not connected to a live shipping API.

## Run locally

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
.
├── index.html                 # Vite document shell; mounts the React app
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Shared layout and route table
│   ├── index.css               # Tailwind import, theme tokens, and browser defaults
│   ├── components/             # Reusable React UI and tracking components
│   ├── data/                   # Local demo shipment data and route lookup
│   └── pages/                  # React page for each user-facing route
├── prototype/                  # Preserved HTML/CSS archive; not loaded by the React app
├── database/                   # Database schema and sample data documentation
└── docs/                       # PRD, FRD, UI references, and project documents
```

`prototype/` is retained as a design and implementation archive outside `src/`. The React app does not import its HTML, CSS, or JavaScript. Vite starts at the root `index.html` and loads only `src/main.jsx`; the archive is not included in the React runtime.

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
├── ShipmentForm
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

Pages and components are JSX. Visual styling uses Tailwind utility classes; `src/index.css` only loads Tailwind, defines theme tokens, and sets small document-wide defaults. There are no page-specific CSS files in the React runtime. The CSS files under `prototype/` remain archived and are not imported.

## State and data

- `App.jsx` owns the shared header, footer, and route configuration.
- Each route page owns its local form and interaction state.
- Tracking and lookup pages own their local input state and use the shared `getRouteForResi` lookup before navigation.
- `SmartWidgetPage` owns the selected shipment, search state, loading feedback, and shipment status filter; it passes data to child components using props.
- `ShippingCalculator` owns its weight and service inputs locally and calculates a demo cost and ETA.
- `src/data/shipmentsData.js` maps demo waybills to routes and validates supported formats: 13–14 numeric digits or 32 alphanumeric characters. Other valid-format resi numbers are handled by AI fallback.
- `src/data/mockShipments.js` provides the separate detailed records used by the widget demo.

All shipment information, ETA calculations, and telemetry messages are simulations for the frontend prototype.
