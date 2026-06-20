# CLAUDE.md

This file guides Claude Code when working in this repo.

## Project overview

Earthquake & Recovery — a React + MUI single-page app with an Express backend that displays live earthquake data from the USGS API on a Leaflet map. Educational content covers earthquake safety, recovery resources, historical quakes, and a quiz.

## Commands

```bash
# Install all dependencies (both app + api)
npm run install:all

# Development (run in separate terminals)
npm run dev:app          # Vite frontend on :5173
npm run dev:api          # Express backend on :3001 (nodemon)

# Production build
npm run build            # Builds frontend → app/dist/
```

Each folder has its own `package.json` — you can also `cd` directly:

```bash
cd app && npm run dev    # Frontend only
cd api && npm run dev    # Backend only
```

## Architecture

```
earthquake-recovery/
├── app/                            # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/assets/              # Images (team, donate, logo)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── theme.js
│       ├── components/             # Layout, Navbar, Map, etc.
│       ├── context/                # AuthContext
│       ├── data/                   # siteSearchData, emergencyPhones
│       └── pages/                  # Home, About, Recovery, etc.
│
├── api/                            # Backend (Express :3001)
│   ├── server.js                   # POST /api/subscribe, /api/contact
│   ├── middleware/auth.js          #   GET /api/recent, /api/health
│   ├── data/                       #   POST /api/auth/*, GET /api/auth/me
│   └── .env.example                # JSON file storage (users, subscribers, messages)
│
├── slides/                         # Presentation pitch
├── ch-3/                           # Report content
├── screenshot.js                   # Puppeteer screenshot utility
└── .mcp.json                       # Context7 MCP config
```

Vite proxies `/api/*` to Express during dev. In production, frontend deploys to Netlify, backend to Render.

## Key dependencies

- **@mui/material** v7, **@mui/icons-material** — UI components
- **react-leaflet** v5 + **leaflet** v1.9 — interactive map
- **framer-motion** — page/component animations
- **react-router-dom** v7 — client-side routing
- **axios** — HTTP requests to backend
- **express** + **cors** — backend API

## Map data sources

- USGS hourly feed: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- Tectonic plates: `https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json`

See `.claude/skills/earthquake-api.md` for the full USGS API reference.

## Navbar features

### 🔍 SiteSearch (`app/src/components/SiteSearch.jsx`)
Search box in the navbar that indexes all website content. Users can search for topics like "drop cover", "Bago", "tsunami", "recovery", "quiz". Results show matching pages with section tags — click to navigate. Data lives in `app/src/data/siteSearchData.js`.

### 📞 EmergencyPhones (`app/src/components/EmergencyPhones.jsx`)
Red phone icon button in the navbar. Opens a dialog with a city dropdown (13 Myanmar cities). Select a city to see emergency numbers (fire, ambulance, police, hospital, Red Cross). Data lives in `app/src/data/emergencyPhones.js`.

## Theme

MUI theme supports dark/light mode toggle. `app/src/theme.js` defines the palette, typography (Poppins font), and component overrides. Cards have hover lift + shadow transitions.

## Style conventions

- Components are functional with hooks
- Pages are in `app/src/pages/`, shared components in `app/src/components/`, data in `app/src/data/`
- framer-motion `motion.div` with variants for staggered animations
- Use MUI `sx` prop for styling (no separate CSS files for components)
- Responsive: `{ xs: ..., md: ... }` breakpoints in sx props
