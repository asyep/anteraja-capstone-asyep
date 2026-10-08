# Frontend Anteraja Smart AI Tracking

React and Vite application for the Smart AI Shipment Tracking Widget.

## Run locally

```bash
npm ci
npm run dev
```

Create and preview a production build with `npm run build` and `npm run preview`.

## API configuration

Set `VITE_API_URL` to the tracking API base URL. The default is
`http://localhost:8000/api/v1`, and the widget requests
`GET {VITE_API_URL}/tracking/{waybill_number}`. The FRD contract expects a
response payload in `data` with English field names; the API adapter also
normalizes the current Laravel response field names for shipment values.

The current Laravel routes are mounted at `/api/tracking/{resi}` rather than
`/api/v1/tracking/{waybill_number}`. Set `VITE_API_URL=http://localhost:8000/api`
when using those routes until the backend route is aligned with the FRD.
`VITE_PHP_API_URL` separately configures the legacy PHP training page.

## Source layout

- `src/components/`: common, layout, tracking, narrative, calculator, and lab UI
- `src/context/`: active shipment, search history, and user state
- `src/hooks/`: shipment requests and shipping estimate calculation
- `src/services/`: Laravel tracking client and legacy PHP client
- `src/utils/`: FRD constants, validation, and formatters
- `src/data/` and `src/pages/`: existing demo data and routes

Tailwind CSS v4 theme tokens live in `src/index.css` using `@theme`; the project
does not use a separate `tailwind.config.js`.
