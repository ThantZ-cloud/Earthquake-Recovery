# CLAUDE.md

This file guides Claude Code when working in this repo.

## Project overview

Earthquake & Recovery — a React + MUI single-page app with an Express backend that displays live earthquake data from the USGS API on a Leaflet map. Educational content covers earthquake safety, recovery resources, historical quakes, and a quiz.

## Commands

```bash
npm install              # Install all dependencies
npm run dev              # Vite dev server on :5173
npm run server:dev       # Express backend on :3001 (nodemon)
npm run build            # Production build → dist/
npm run preview          # Preview production build
```

## Architecture

```
Frontend (React + Vite)           Backend (Express :3001)
src/                              server.js
├── components/                   ├── POST /api/subscribe
│   ├── Layout.jsx               ├── POST /api/contact
│   ├── Navbar.jsx               ├── GET  /api/recent (USGS proxy)
│   ├── Footer.jsx               └── GET  /api/health
│   └── EarthquakeMap.jsx
└── pages/                        data/  (JSON file storage)
    ├── Home.jsx                  .mcp.json  (Context7 MCP)
    ├── About.jsx                 .claude/skills/
    ├── Recovery.jsx              .claude/agents/
    ├── Donate.jsx
    ├── Quiz.jsx
    └── History.jsx
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

## Theme

MUI theme supports dark/light mode toggle. `src/theme.js` defines the palette, typography (Poppins font), and component overrides. Cards have hover lift + shadow transitions.

## Style conventions

- Components are functional with hooks
- Pages are in `src/pages/`, shared components in `src/components/`
- framer-motion `motion.div` with variants for staggered animations
- Use MUI `sx` prop for styling (no separate CSS files for components)
- Responsive: `{ xs: ..., md: ... }` breakpoints in sx props
