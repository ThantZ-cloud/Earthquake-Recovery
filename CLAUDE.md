# CLAUDE.md

This file guides Claude Code when working in this repo.

## Project overview

Earthquake & Recovery — a React + MUI single-page app that displays live earthquake data from EMSC on a Leaflet map. Features Myanmar dams with fault-line risk assessment, real-time location-based alerts with emergency siren, Supabase auth, and educational content.

## Commands

```bash
# Install dependencies
cd app && npm install

# Development
cd app && npm run dev    # Vite frontend on :5173

# Production build
cd app && npm run build  # Builds frontend → app/dist/
```

No backend required — auth uses Supabase, earthquake data fetched directly from EMSC.

## Architecture

```
earthquake-recovery/
├── app/                            # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   ├── assets/                 # Images + alert-sound.mp3
│   │   ├── tectonicplates.json     # Global tectonic plate boundaries
│   │   └── myanmar_dams.geojson    # 254 Myanmar dam locations
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── theme.js
│       ├── lib/
│       │   └── supabase.js         # Supabase client config
│       ├── utils/
│       │   └── damRisk.js          # Turf.js distance + risk classification
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── EarthquakeMap.jsx   # Map with earthquakes, plates, dams
│       │   ├── SiteSearch.jsx
│       │   ├── EmergencyPhones.jsx
│       │   ├── AuthDialog.jsx      # Supabase login/register
│       │   └── LocationAlerts.jsx  # Real-time alerts + siren
│       ├── context/
│       │   └── AuthContext.jsx     # Supabase auth state
│       ├── data/                   # siteSearchData, emergencyPhones
│       └── pages/                  # Home, About, Recovery, etc.
│
├── supabase/
│   └── locations.sql               # Database schema for saved locations
│
└── .mcp.json                       # Context7 MCP config
```

## Map (`app/src/components/EarthquakeMap.jsx`)

### Data sources
- EMSC seismic portal: direct fetch (no backend proxy)
  - URL: `https://www.seismicportal.eu/fdsnws/event/1/query`
  - Params: last 7 days, M1+, limit 700
  - Refreshes every 5 seconds
- Tectonic plates: `app/public/tectonicplates.json` (GitHub raw URL blocked in some networks)
- Myanmar dams: `app/public/myanmar_dams.geojson` (from mmeqopendata, CC BY-SA 4.0)

### Rendering
- Earthquake markers: `CircleMarker` on `L.canvas()` renderer — fast pan/zoom
- Tectonic plates: `GeoJSON` with default SVG renderer (Canvas doesn't work with GeoJSON)
- Myanmar dams: `Marker` with CSS triangle `DivIcon` — colored by risk level
- Street tiles: CartoDB Positron (`basemaps.cartocdn.com`)

### Dam risk classification (`app/src/utils/damRisk.js`)
- Uses Turf.js `nearestPointOnLine` to calculate distance from each dam to nearest plate boundary
- Bounding box pre-filter to skip far-away plates (performance optimization)
- Risk levels:
  - 🔴 High Risk: 0–30 km from plate boundary
  - 🟠 Medium Risk: 30–80 km
  - 🟢 Low Risk: >80 km
- Uses wider thresholds because tectonic plates are coarse approximations, not precise fault lines

### Performance notes
- Don't use `L.divIcon` with SVG/IMG for hundreds of markers — too many DOM nodes
- Don't use `L.canvas()` renderer on GeoJSON — it doesn't render
- `fetchPlates` uses native `fetch`, not axios (absolute external URL)
- Dam classification uses `requestAnimationFrame` to avoid blocking render

## Navbar features

### 🔍 SiteSearch (`app/src/components/SiteSearch.jsx`)
Search box in the navbar that indexes all website content. Data lives in `app/src/data/siteSearchData.js`.

### 📞 EmergencyPhones (`app/src/components/EmergencyPhones.jsx`)
Red phone icon button in the navbar. Opens a dialog with a city dropdown (13 Myanmar cities). Data lives in `app/src/data/emergencyPhones.js`.

## Auth (`app/src/context/AuthContext.jsx`)
- Uses **Supabase** for authentication (no backend needed)
- Config in `app/src/lib/supabase.js`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Instant signup (email confirmation disabled in Supabase dashboard)

## Location Alerts (`app/src/components/LocationAlerts.jsx`)
- Real-time monitoring: checks every 5 seconds
- Uses browser geolocation (GPS)
- Can save/edit monitoring location in Supabase (locations table)
- Alert triggers for M3+ earthquakes within 50 km
- Emergency siren: 30-second MP3 (`app/public/assets/alert-sound.mp3`)
- Browser notifications via Notification API
- Demo "Test Alert" button for testing

## Supabase Schema
See `supabase/locations.sql` for the locations table + row-level security policies.

## Theme

MUI theme supports dark/light mode toggle. `app/src/theme.js` defines the palette, typography (Poppins font), and component overrides.

## Style conventions

- Components are functional with hooks
- Pages in `app/src/pages/`, shared components in `app/src/components/`
- framer-motion `motion.div` with variants for staggered animations
- Use MUI `sx` prop for styling (no separate CSS files)
- Responsive: `{ xs: ..., md: ... }` breakpoints in sx props
- Page routes (except Home) are lazy-loaded via `React.lazy()` in App.jsx
- Earthquake data cached with `@tanstack/react-query` (queryKey: `['earthquakes']`)
- `LocationAlerts` reads from react-query cache
