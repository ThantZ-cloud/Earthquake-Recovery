# 🌍 Earthquake & Recovery

Real-time earthquake tracking and educational platform. Stay informed about seismic activity, learn safety protocols, and discover recovery resources.

---

## 📖 The Story Behind This Project

This project began in my second year at **UTYCC** as a group frontend assignment. Together with nine friends, we built the first version using just **HTML, CSS, JavaScript, Bootstrap, and the Leaflet mapping library**. It was a simple static website — a single page packed with earthquake information, safety guides, a live USGS map, historical data, and a donation section. Each team member contributed their own section, and we stitched everything together into one `index.html`.

It worked. But it was exactly what you'd expect from a second-year project — inline styles everywhere, inconsistent layouts, cramped text, no responsive design, and no backend.

A year later, I decided to give it a second life. With **Claude Code** as my pair programmer, I rebuilt the entire project from the ground up:

- The **frontend** was completely rewritten in **React 19** with **Material UI (MUI 7)**, replacing every inline style with a consistent component library. Each section became its own route with smooth page transitions via **Framer Motion**.
- The **backend** — which didn't exist before — was built with **Express.js**, adding real API endpoints for user authentication, earthquake alerts, contact forms, and a cached proxy to the **EMSC earthquake API** (which has far better coverage for Asia than USGS).
- New features were added that the original never had: **website-wide search**, an **emergency phone directory** (20+ contacts per city across 13 Myanmar cities), a **12-question interactive quiz**, **user registration and login** with JWT authentication, and **location-based earthquake alerts** that watch your position and notify you if a quake strikes within 50 kilometers.
- The **About Us** page was redesigned from a cramped 3D carousel into a modern team profile gallery with individual detail dialogs and staggered entrance animations.

What started as a classroom exercise is now a fully functional web application that I'm proud to show — and it keeps improving.

---

## ✨ Features

- **🗺️ Live Earthquake Map** — Real-time data from EMSC with tectonic plate overlays and color-coded magnitude markers
- **🔍 Website Search** — Search across all pages and topics (safety tips, historical quakes, recovery resources, etc.)
- **📞 Emergency Phone Directory** — 20+ contacts per city across 13 Myanmar cities, with in-sidebar search
- **📍 Location-Based Alerts** — Login, grant location access, and get notified if an earthquake happens near you
- **🛡️ Safety Guide** — Drop, Cover, Hold On — essential steps explained visually
- **📚 Earthquake Knowledge** — Magnitude scales, seismic zones, plate tectonics
- **🏥 Recovery Resources** — Short-term, mid-term, and long-term recovery guidance with tabbed navigation
- **📜 Historical Earthquakes** — Interactive timeline of major quakes worldwide with magnitude filtering
- **💰 Donate** — Crypto, mobile payment, and international donation options
- **🧠 Quiz** — 12-question interactive earthquake knowledge test
- **🔐 User Accounts** — Register, login, and logout with JWT authentication
- **🌓 Dark/Light Mode** — Full theme support

---

## 🚀 Quick Start

```bash
# Install all dependencies (both frontend + backend)
npm run install:all

# Start frontend dev server (port 5173)
npm run dev:app

# Start backend server in another terminal (port 3001)
npm run dev:api
```

The Vite dev server proxies `/api/*` requests to the Express backend automatically.

You can also run commands directly from each folder:

```bash
cd app && npm run dev    # Frontend only
cd api && npm run dev    # Backend only
```

---

## 📁 Project Structure

```
├── app/                           # Frontend (React + Vite)
│   ├── index.html                 # Vite entry point
│   ├── vite.config.js             # Vite config + API proxy
│   ├── public/assets/             # Images (team, donate, logo)
│   └── src/
│       ├── components/            # Shared React components
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── EarthquakeMap.jsx
│       │   ├── SiteSearch.jsx     # Website content search
│       │   ├── EmergencyPhones.jsx # Emergency number lookup
│       │   ├── AuthDialog.jsx     # Login/Register dialog
│       │   └── LocationAlerts.jsx # Location-based quake monitoring
│       ├── data/                  # Static data
│       │   ├── siteSearchData.js  # Search index
│       │   └── emergencyPhones.js # Phone numbers by city
│       ├── context/               # React context
│       │   └── AuthContext.jsx    # Auth state management
│       └── pages/                 # Route pages
│           ├── Home.jsx           # Live map + location alert
│           ├── About.jsx          # Meet the team (10 members)
│           ├── Recovery.jsx       # Recovery resources (tabbed)
│           ├── Donate.jsx         # Donation options (tabbed)
│           ├── Quiz.jsx           # 12-question knowledge quiz
│           └── History.jsx        # Historical earthquakes timeline
│
├── api/                           # Backend (Express.js)
│   ├── server.js                  # API server
│   ├── middleware/auth.js         # JWT auth middleware
│   ├── data/                      # JSON file storage (users, subscribers, messages)
│   └── .env.example               # Environment variable template
│
├── .mcp.json              # Claude Code MCP configuration
├── .claude/               # Claude skills & agents
├── CLAUDE.md              # Claude Code guidance
└── plan.md                # Project plan & progress tracker
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/me` | Get current user (requires token) |
| `POST` | `/api/subscribe` | Subscribe to earthquake alerts |
| `POST` | `/api/contact` | Send a contact message |
| `GET` | `/api/recent` | Get recent earthquakes (EMSC proxy with 5min cache) |
| `GET` | `/api/health` | Health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, MUI 7, Leaflet, Framer Motion, React Router v7 |
| Backend | Node.js, Express.js, JWT (jsonwebtoken + bcryptjs) |
| Map Data | EMSC Earthquake API, OpenStreetMap, MapTiler, ArcGIS |
| Dev Tools | Claude Code (MCP, Skills, Agents), ESLint, Nodemon |

---

## 📦 Deployment

- **Frontend**: `cd app && npm run build`, deploy `app/dist/` to [Netlify](https://netlify.com)
- **Backend**: Deploy the `api/` folder to [Render](https://render.com) (free tier)

Set environment variables on Render:
```
PORT=3001
JWT_SECRET=your-random-secret-here
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

---

## 👥 Team

Originally built by 10 UTYCC students (13th batch, IST Major) as a second-year frontend project. Upgraded and maintained by **Thant Zin Htun** with the help of Claude Code.

See the [About page](https://thantz-cloud.github.io/Earthquake-Recovery/about) for individual team profiles.

---

## 📄 Credits

- Earthquake data: [EMSC](https://www.seismicportal.eu/)
- Map tiles: [OpenStreetMap](https://openstreetmap.org), [MapTiler](https://maptiler.com), [ArcGIS](https://arcgis.com), [OpenTopoMap](https://opentopomap.org)
- Tectonic plates: [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
- UI components: [MUI](https://mui.com/)
- Icons: [MUI Icons](https://mui.com/material-ui/icons/)


<img width="2674" height="1556" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/8047b65b-f5f3-4505-863d-903f6b7ef504" />

