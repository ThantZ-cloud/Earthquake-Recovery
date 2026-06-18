# 🌍 Earthquake & Recovery

Real-time earthquake tracking and educational platform built with React, MUI, and Leaflet. Stay informed about seismic activity, learn safety protocols, and discover recovery resources.

## ✨ Features

- **🗺️ Live Earthquake Map** — Real-time data from USGS with tectonic plate overlays and color-coded magnitude markers
- **🛡️ Safety Guide** — Drop, Cover, Hold On — essential steps explained visually
- **📚 Earthquake Knowledge** — Magnitude scales, seismic zones, plate tectonics
- **🏥 Recovery Resources** — Short-term, mid-term, and long-term recovery guidance
- **📜 Historical Earthquakes** — Interactive timeline of major quakes worldwide
- **💌 Alert Signup** — Subscribe for earthquake notifications by region
- **💰 Donate** — Crypto, mobile payment, and international donation options
- **🧠 Quiz** — Test your earthquake knowledge
- **🌓 Dark/Light Mode** — Full theme support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start frontend dev server (port 5173)
npm run dev

# Start backend server in another terminal (port 3001)
npm run server:dev
```

The Vite dev server proxies `/api/*` requests to the Express backend automatically.

## 📁 Project Structure

```
├── server.js              # Express API backend
├── data/                  # JSON file storage (subscribers, messages)
├── .mcp.json              # Claude Code MCP configuration
├── .claude/               # Claude skills & agents
│   ├── skills/
│   └── agents/
└── src/
    ├── components/        # Shared React components
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   └── EarthquakeMap.jsx
    └── pages/             # Route pages
        ├── Home.jsx       # Live map + alert signup
        ├── About.jsx      # Meet the team
        ├── Recovery.jsx   # Recovery resources
        ├── Donate.jsx     # Donation options
        ├── Quiz.jsx       # Knowledge quiz
        └── History.jsx    # Historical earthquakes timeline
```

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/subscribe` | Subscribe to earthquake alerts |
| `POST` | `/api/contact` | Send a contact message |
| `GET` | `/api/recent` | Get recent earthquakes (USGS proxy with cache) |
| `GET` | `/api/health` | Health check |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, MUI 7, Leaflet, Framer Motion |
| Backend | Express.js |
| Map Data | USGS Earthquake API, OpenStreetMap, MapTiler |
| Tools | Claude Code (MCP, Skills, Agents) |

## 📦 Deployment

- **Frontend**: Build with `npm run build`, deploy `dist/` to [Netlify](https://netlify.com)
- **Backend**: Deploy `server.js` to [Render](https://render.com) (free tier)

Set environment variables on Render:
```
PORT=3001
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

## 👥 Team

Built by 10 UTYCC students (13th batch, IST major). See the [About page](https://github.com/ThantZ-cloud/Earthquake-Recovery) for team profiles.

## 📄 Credits

- Earthquake data: [USGS](https://earthquake.usgs.gov/)
- Map tiles: [OpenStreetMap](https://openstreetmap.org), [MapTiler](https://maptiler.com), [ArcGIS](https://arcgis.com)
- Tectonic plates: [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
- Icons: [MUI Icons](https://mui.com/material-ui/icons/)
