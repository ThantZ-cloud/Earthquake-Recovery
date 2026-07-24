# 🌍 Earthquake & Recovery

Real-time earthquake tracking and educational platform. Stay informed about seismic activity, learn safety protocols, and discover recovery resources.

---

## ✨ Features

- **🗺️ Live Earthquake Map** — Real-time seismic data from EMSC with tectonic plate overlays and color-coded magnitude markers
- **🇲🇲 Myanmar Dam Risk Assessment** — 254 dams displayed with risk levels (red/orange/green) based on Turf.js distance-to-fault-line analysis
- **📍 Real-Time Location Alerts** — GPS-based monitoring with **30-second emergency siren** and browser notifications when M3+ earthquakes strike within 50 km
- **📞 Emergency Phone Directory** — 20+ contacts per city across 13 Myanmar cities
- **🛡️ Safety Guides** — Comprehensive quake preparedness: what to do before, during, and after an earthquake (Drop, Cover, Hold On)
- **📚 Earthquake Knowledge** — What causes earthquakes, magnitude scales, seismic zones, and how seismographs measure quakes
- **🏥 Recovery Resources** — Short-term, mid-term, and long-term recovery guidance with actionable checklists
- **📜 Historical Earthquakes** — Interactive timeline of major quakes worldwide with educational insights
- **💰 Donate** — Crypto, mobile payment, and international donation options with step-by-step guides
- **🧠 Quiz** — 12-question interactive earthquake knowledge test with instant scoring
- **🔐 User Accounts** — Register and login with Supabase authentication (instant signup)
- **🌓 Dark/Light Mode** — Full MUI theme toggle with animated transitions
- **💬 Feedback Button** — In-app feedback form for user input

---

## 📸 Screenshots

| | |
|---|---|
| ![Live earthquake map with tectonic plates](screenshots/Screenshot%20(45).png) | ![Myanmar dam risk markers](screenshots/Screenshot%20(46).png) |
| **Live earthquake map** — Real-time EMSC data with tectonic boundaries | **Dam risk assessment** — Color-coded markers by proximity to fault lines |
| ![Earthquake Alert demo](screenshots/Screenshot%20(50).png) | ![Recovery section](screenshots/Screenshot%20(57).png) |
| **Location-based alerts** — Real-time monitoring with emergency siren | **Recovery resources** — Short, mid, and long-term guidance |
| ![Donation section](screenshots/Screenshot%20(60).png) | ![Donation guide](screenshots/Screenshot%20(61).png) |
| **Donation options** — Crypto, mobile, and international payments | **How to donate** — Step-by-step donation guides |
| ![Earthquake quiz](screenshots/Screenshot%20(62).png) | ![Historical earthquakes](screenshots/Screenshot%20(64).png) |
| **Knowledge quiz** — 12-question interactive earthquake test | **Historical earthquakes** — Major quakes timeline |

---

## 🚀 Quick Start

```bash
# Install dependencies
cd app && npm install

# Start dev server (port 5173)
npm run dev
```

Create `app/.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Enable instant signup in Supabase: **Authentication → Settings → Email → Toggle off "Confirm email"**

---

## 🏗️ Project Structure

```
earthquake-recovery/
├── app/                           # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   ├── assets/                # Images + alert-sound.mp3
│   │   ├── tectonicplates.json    # Global tectonic plate boundaries
│   │   └── myanmar_dams.geojson   # 254 Myanmar dam locations
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── theme.js               # MUI theme (dark/light mode)
│       ├── components/
│       │   ├── Layout.jsx         # App shell with navbar + footer
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── EarthquakeMap.jsx  # Leaflet map — earthquakes, plates, dams
│       │   ├── SiteSearch.jsx     # Full-site search from navbar
│       │   ├── EmergencyPhones.jsx# City-based emergency phone directory
│       │   ├── LocationAlerts.jsx # GPS monitoring + siren + notifications
│       │   ├── AuthDialog.jsx     # Supabase login/register dialog
│       │   ├── HomeSkeleton.jsx   # Loading skeleton for home page
│       │   ├── PageSkeleton.jsx   # Loading skeleton for other pages
│       │   ├── SafetyGuide.jsx    # Drop, Cover, Hold On visual guide
│       │   ├── SafetyCharacter.jsx# Animated safety illustration
│       │   ├── BeforeEarthquake.jsx   # Preparedness checklist
│       │   ├── DuringEarthquake.jsx   # Emergency response steps
│       │   ├── AfterEarthquake.jsx    # Post-quake safety
│       │   ├── WhatIsEarthquake.jsx   # Educational intro to quakes
│       │   ├── HowToMeasure.jsx       # Seismographs & magnitude scales
│       │   ├── AnimatedPage.jsx       # Framer Motion page transition wrapper
│       │   └── FeedbackButton.jsx     # In-app feedback form
│       ├── lib/
│       │   └── supabase.js       # Supabase client config
│       ├── utils/
│       │   └── damRisk.js        # Turf.js distance + risk classification
│       ├── context/
│       │   └── AuthContext.jsx   # Supabase auth state provider
│       ├── data/
│       │   ├── siteSearchData.js
│       │   └── emergencyPhones.js
│       └── pages/
│           ├── Home.jsx          # Landing page with map + safety overview
│           ├── About.jsx         # Earthquake knowledge hub
│           ├── Recovery.jsx      # Recovery resources
│           ├── Donate.jsx        # Donation options + guides
│           ├── Quiz.jsx          # Interactive quiz
│           └── History.jsx       # Historical earthquakes timeline
│
├── supabase/
│   └── locations.sql             # Database schema + RLS policies
│
├── screenshots/                  # App screenshots
├── .claude/                      # Claude Code config
└── CLAUDE.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, MUI 7, Leaflet, Framer Motion, React Router v7, TanStack React Query |
| Auth | Supabase (free tier) |
| Map Data | EMSC Earthquake API, OpenStreetMap, CartoDB, MapTiler, ArcGIS |
| Spatial Analysis | Turf.js (nearest-point-on-line distance calculation, risk zones) |
| Sound | Web Audio API / HTML5 Audio |
| Animations | Framer Motion (page transitions, staggered reveals, skeleton loaders) |

---

## 🗺️ Map Features

- **Data refresh**: Fetches last 7 days of M1+ earthquakes from EMSC every 5 seconds
- **Rendering**: Canvas-based `CircleMarker` for quakes (fast pan/zoom), SVG GeoJSON for tectonic plates
- **Dam markers**: CSS triangle `DivIcon` colored by risk level (High / Medium / Low)
- **Risk algorithm**: Turf.js `nearestPointOnLine` with bounding-box pre-filter for performance
- **Risk thresholds**: High ≤30 km, Medium ≤80 km, Low >80 km from plate boundary

---

## 🔐 Auth & Data

- **Supabase** handles all authentication — no backend server required
- **Instant signup** with email confirmation disabled
- **Locations table** (`supabase/locations.sql`) stores saved monitoring locations with row-level security

---

## 📄 Data Sources & Credits

- **Earthquake data**: [EMSC](https://www.seismicportal.eu/) (real-time seismic monitoring)
- **Myanmar dams**: [mmeqopendata](https://github.com/akzedevops/mmeqopendata) — Open Development Mekong / IFC / WLE ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))
- **Tectonic plates**: [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
- **Map tiles**: [OpenStreetMap](https://openstreetmap.org), [CartoDB](https://carto.com/), [MapTiler](https://maptiler.com), [ArcGIS](https://arcgis.com), [OpenTopoMap](https://opentopomap.org)
- **UI components**: [MUI](https://mui.com/)
- **Icons**: [MUI Icons](https://mui.com/material-ui/icons/)
- **Alert sound**: [Pixabay](https://pixabay.com/sound-effects/) — Emergency Warning System

