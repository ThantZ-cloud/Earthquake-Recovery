# CLAUDE.md

## Project overview

Earthquake & Recovery — React + MUI SPA displaying live EMSC earthquake data on a Leaflet map. Features Myanmar dams with fault-line risk assessment, real-time location-based alerts with emergency siren, Supabase auth, and educational content.

## Commands

```bash
cd app && npm install    # Install dependencies
cd app && npm run dev    # Dev server on :5173
cd app && npm run build  # Build to app/dist/
```

No backend required — Supabase for auth, EMSC data fetched directly.

## Key files

```
app/src/
├── components/
│   ├── EarthquakeMap.jsx   # Map with earthquakes, plates, dams
│   ├── LocationAlerts.jsx  # Real-time alerts + siren
│   └── ...
├── utils/damRisk.js        # Turf.js distance + risk classification
├── context/AuthContext.jsx  # Supabase auth state
└── lib/supabase.js         # Supabase client config

app/public/
├── tectonicplates.json     # Plate boundaries
└── myanmar_dams.geojson    # 254 Myanmar dam locations
```

## Map (`EarthquakeMap.jsx`)

**Data sources:**
- EMSC: `https://www.seismicportal.eu/fdsnws/event/1/query` (7 days, M1+, limit 700, refresh 5s)
- Plates: `tectonicplates.json` (GitHub raw URL blocked in some networks)
- Dams: `myanmar_dams.geojson` (mmeqopendata, CC BY-SA 4.0)

**Rendering:**
- Earthquake markers: `CircleMarker` on `L.canvas()` renderer
- Tectonic plates: `GeoJSON` with SVG renderer
- Dams: `Marker` with `DivIcon` colored by risk level
- Tiles: CartoDB Positron

**Dam risk** (`utils/damRisk.js`):
- Turf.js `nearestPointOnLine` to plate boundaries
- High: 0–30km | Medium: 30–80km | Low: >80km
- Uses bounding box pre-filter for performance

**Performance rules:**
- Never use `L.divIcon` with SVG/IMG for hundreds of markers
- Never use `L.canvas()` renderer on GeoJSON
- Dam classification uses `requestAnimationFrame`

## Features

- **SiteSearch**: Content indexing from `siteSearchData.js`
- **EmergencyPhones**: Dialog with 13 Myanmar cities from `emergencyPhones.js`
- **Auth**: Supabase, env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **LocationAlerts**: Browser geolocation, checks every 5s, M3+ within 50km triggers siren (alert-sound.mp3), browser notifications
- **Schema**: `supabase/locations.sql` for locations table + RLS

## Conventions

- Functional components with hooks
- framer-motion for animations
- MUI `sx` prop styling (no CSS files)
- Responsive breakpoints: `{ xs: ..., md: ... }`
- Routes lazy-loaded via `React.lazy()` except Home
- React-query for earthquake data caching
- MUI theme supports dark/light mode in `theme.js`
