# 🌍 Earthquake & Recovery

Real-time earthquake tracking and educational platform. Stay informed about seismic activity, learn safety protocols, and discover recovery resources.

---

## 📖 The Story Behind This Project

This project began in my second year at **UTYCC** as a group frontend assignment. Together with nine friends, we built the first version using just **HTML, CSS, JavaScript, Bootstrap, and the Leaflet mapping library**. It was a simple static website — a single page packed with earthquake information, safety guides, a live USGS map, historical data, and a donation section. Each team member contributed their own section, and we stitched everything together into one `index.html`.

It worked. But it was exactly what you'd expect from a second-year project — inline styles everywhere, inconsistent layouts, cramped text, no responsive design, and no backend.

A year later, I decided to give it a second life. With **Claude Code** as my pair programmer, I rebuilt the entire project from the ground up:

- The **frontend** was completely rewritten in **React 19** with **Material UI (MUI 7)**, replacing every inline style with a consistent component library. Each section became its own route with smooth page transitions via **Framer Motion**.
- **Authentication** uses **Supabase** — real user accounts with instant signup, no backend required.
- **Earthquake data** is fetched directly from the **EMSC seismic portal** — no backend proxy needed.
- **Myanmar dams** are displayed on the map with **risk assessment** based on proximity to tectonic plate boundaries using **Turf.js**.
- **Real-time alerts** check for earthquakes every 5 seconds with a **30-second emergency siren** and **browser notifications**.
- Location-based alerts watch your position and notify you if a quake strikes within 50 kilometers.

What started as a classroom exercise is now a fully functional web application that I'm proud to show — and it keeps improving.

---

## ✨ Features

- **🗺️ Live Earthquake Map** — Real-time data from EMSC with tectonic plate overlays and color-coded magnitude markers
- **🇲🇲 Myanmar Dams** — 254 dams displayed with risk assessment (red/orange/green) based on distance to fault lines
- **📍 Location-Based Alerts** — Real-time monitoring with emergency siren sound and browser notifications
- **🔊 Emergency Siren** — 30-second alarm sound when earthquake detected near you
- **🔍 Website Search** — Search across all pages and topics
- **📞 Emergency Phone Directory** — 20+ contacts per city across 13 Myanmar cities
- **🛡️ Safety Guide** — Drop, Cover, Hold On — essential steps explained visually
- **📚 Earthquake Knowledge** — Magnitude scales, seismic zones, plate tectonics
- **🏥 Recovery Resources** — Short-term, mid-term, and long-term recovery guidance
- **📜 Historical Earthquakes** — Interactive timeline of major quakes worldwide
- **💰 Donate** — Crypto, mobile payment, and international donation options
- **🧠 Quiz** — 12-question interactive earthquake knowledge test
- **🔐 User Accounts** — Register and login with Supabase authentication
- **🌓 Dark/Light Mode** — Full theme support

---

## 🚀 Quick Start

```bash
# Install dependencies
cd app && npm install

# Start dev server (port 5173)
npm run dev
```

Create `app/.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Enable instant signup in Supabase: **Authentication → Settings → Email → Toggle off "Confirm email"**

---

## 📁 Project Structure

```
├── app/                           # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   ├── assets/                # Images + alert-sound.mp3
│   │   ├── tectonicplates.json    # Global tectonic plate boundaries
│   │   └── myanmar_dams.geojson   # 254 Myanmar dam locations
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── EarthquakeMap.jsx  # Map with earthquakes, plates, dams
│       │   ├── SiteSearch.jsx
│       │   ├── EmergencyPhones.jsx
│       │   ├── AuthDialog.jsx     # Supabase login/register
│       │   └── LocationAlerts.jsx # Real-time alerts + siren
│       ├── lib/
│       │   └── supabase.js        # Supabase client config
│       ├── utils/
│       │   └── damRisk.js         # Turf.js distance + risk classification
│       ├── context/
│       │   └── AuthContext.jsx    # Supabase auth state
│       ├── data/
│       │   ├── siteSearchData.js
│       │   └── emergencyPhones.js
│       └── pages/
│           ├── Home.jsx
│           ├── About.jsx
│           ├── Recovery.jsx
│           ├── Donate.jsx
│           ├── Quiz.jsx
│           └── History.jsx
│
├── supabase/
│   └── locations.sql              # Database schema for saved locations
│
├── .claude/                       # Claude Code config
└── CLAUDE.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, MUI 7, Leaflet, Framer Motion, React Router v7 |
| Auth | Supabase (free tier) |
| Map Data | EMSC Earthquake API, OpenStreetMap, MapTiler, ArcGIS |
| Spatial Analysis | Turf.js (distance calculation, risk zones) |
| Sound | Web Audio API / HTML5 Audio |

---

## 📄 Data Sources & Credits

- **Earthquake data**: [EMSC](https://www.seismicportal.eu/) (real-time seismic monitoring)
- **Myanmar dams**: [mmeqopendata](https://github.com/akzedevops/mmeqopendata) (Open Development Mekong / IFC / WLE, CC BY-SA 4.0)
- **Tectonic plates**: [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
- **Map tiles**: [OpenStreetMap](https://openstreetmap.org), [MapTiler](https://maptiler.com), [ArcGIS](https://arcgis.com), [OpenTopoMap](https://opentopomap.org)
- **UI components**: [MUI](https://mui.com/)
- **Icons**: [MUI Icons](https://mui.com/material-ui/icons/)
- **Alert sound**: [Pixabay](https://pixabay.com/sound-effects/) (Emergency Warning System)

---

## 👥 Team

Originally built by 10 UTYCC students (13th batch, IST Major) as a second-year frontend project. Upgraded and maintained by **Thant Zin Htun** with the help of Claude Code.
