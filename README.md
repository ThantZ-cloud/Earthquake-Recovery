# 🌍 Earthquake & Recovery

A bilingual (Myanmar / English) single-page app for real-time earthquake tracking, safety education, and recovery resources. Live seismic data from EMSC, Myanmar dam risk assessment, GPS-based alerting with an emergency siren, and Supabase-powered accounts — all in one place.

---

## ✨ Features

- **🗺️ Full-Screen Live Earthquake Map** — The home page is a full-bleed Leaflet map with real-time EMSC data (last 7 days, M1+, refreshed every 5 seconds), color/size-coded magnitude markers rendered on canvas for smooth pan & zoom
- **🧭 Tectonic Plate Overlay** — Global plate boundary lines rendered as SVG GeoJSON
- **🇲🇲 Myanmar Dam Risk Assessment** — 254 dams shown with risk levels (red/orange/green) computed via Turf.js distance-to-nearest-plate-boundary analysis
- **📍 Location-Based Earthquake Alerts** — Navbar bell drawer with GPS or saved-location monitoring: alerts on M3+ quakes within 50 km with a 60-second emergency siren, browser notifications, and mobile vibration
  - **Test Alert** button to demo the siren, **Stop Sound** control that actually sticks, and **Reassign Location** (use live GPS position or manual coordinates)
  - Built-in **"How Earthquake Alerts Work"** explainer (P-wave vs S-wave, warning-time physics)
- **🔔 Emergency Phone Directory** — City-based emergency contacts across 13 Myanmar cities
- **📚 Learn** — Dedicated education page: what earthquakes are, how they're measured, safety guides, and before/during/after checklists (Drop, Cover, Hold On)
- **🏥 Recovery Resources** — Short-term, mid-term, and long-term recovery guidance with actionable checklists
- **📜 Historical Earthquakes** — Interactive timeline of major quakes worldwide with images and impact stats
- **🧠 Quiz** — 30-question interactive earthquake knowledge test with instant scoring
- **💰 Donate** — Crypto, mobile payment, and international donation options with step-by-step guides
- **👥 About** — Project story, animated stats, tech stack, and team member profiles
- **🔐 User Accounts** — Register/login with Supabase (instant signup)
- **🌐 Bilingual i18n** — Full Myanmar (default) / English translations, persisted in `localStorage`
- **🌓 Dark/Light Mode** — Full MUI theme toggle
- **📱 Responsive** — Mobile drawer navigation, adaptive toolbar, and map legend overlay

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
| **Knowledge quiz** — 30-question interactive earthquake test | **Historical earthquakes** — Major quakes timeline |

---

## 🚀 Quick Start

```bash
# Install dependencies
cd app && npm install

# Start dev server (port 5173)
npm run dev

# Production build → app/dist/
npm run build
```

Create `app/.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Enable instant signup in Supabase: **Authentication → Settings → Email → Toggle off "Confirm email"**

> No backend is required — auth uses Supabase and earthquake data is fetched directly from the EMSC public API.

---

## 🏗️ Project Structure

```
earthquake-recovery/
├── app/                            # Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   ├── assets/                 # Images + alert-sound.mp3
│   │   ├── tectonicplates.json     # Global tectonic plate boundaries
│   │   └── myanmar_dams.json       # 254 Myanmar dam locations
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Routes (lazy-loaded pages)
│       ├── theme.js                # MUI theme (dark/light palette)
│       ├── index.css               # Global styles + Leaflet overrides
│       ├── i18n/
│       │   ├── index.jsx           # Language context (my default, localStorage)
│       │   ├── en.json             # English translations
│       │   └── my.json             # Myanmar translations
│       ├── components/
│       │   ├── Layout.jsx          # App shell with navbar + footer
│       │   ├── Navbar.jsx          # Sticky nav, mobile drawer, theme/lang/auth
│       │   ├── Footer.jsx
│       │   ├── EarthquakeMap.jsx   # Full-screen Leaflet map — quakes, plates, dams
│       │   ├── LocationAlertsNav.jsx # Navbar bell + drawer (alert settings + knowledge)
│       │   ├── LocationAlerts.jsx  # GPS monitoring, siren, notifications, reassign
│       │   ├── EmergencyPhones.jsx # City-based emergency phone directory
│       │   ├── AuthDialog.jsx      # Supabase login/register dialog
│       │   ├── HomeSkeleton.jsx    # Loading skeleton for home page
│       │   ├── PageSkeleton.jsx    # Loading skeleton for other pages
│       │   ├── SafetyGuide.jsx     # Drop, Cover, Hold On visual guide
│       │   ├── SafetyCharacter.jsx # Animated safety illustration
│       │   ├── BeforeEarthquake.jsx    # Preparedness checklist
│       │   ├── DuringEarthquake.jsx    # Emergency response steps
│       │   ├── AfterEarthquake.jsx     # Post-quake safety
│       │   ├── WhatIsEarthquake.jsx    # Educational intro to quakes
│       │   ├── HowToMeasure.jsx        # Seismographs & magnitude scales
│       │   ├── AnimatedPage.jsx        # Framer Motion page transition wrapper
│       │   └── FeedbackButton.jsx      # In-app feedback form
│       ├── lib/
│       │   └── supabase.js         # Supabase client config
│       ├── utils/
│       │   └── damRisk.js          # Turf.js distance + risk classification
│       ├── context/
│       │   ├── AuthContext.jsx     # Supabase auth state provider
│       │   └── ThemeContext.jsx    # Dark/light mode provider
│       ├── data/
│       │   └── emergencyPhones.js  # 13-city emergency contacts
│       └── pages/
│           ├── Home.jsx            # Full-screen live earthquake map
│           ├── Learn.jsx           # Earthquake education hub
│           ├── Recovery.jsx        # Recovery resources
│           ├── Donate.jsx          # Donation options + guides
│           ├── Quiz.jsx            # 30-question interactive quiz
│           ├── History.jsx         # Historical earthquakes timeline
│           └── About.jsx           # Story, stats, tech stack, team
│
├── supabase/
│   └── locations.sql               # Database schema + RLS policies
│
├── screenshots/                    # App screenshots
└── CLAUDE.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, MUI 7, React Router 7 |
| Data fetching | TanStack React Query (5s-polled earthquake cache) |
| Maps | Leaflet + react-leaflet 5, CartoDB Positron tiles |
| Spatial Analysis | Turf.js (nearest-point-on-line distance calculation, risk zones) |
| Auth & Storage | Supabase (auth + locations table, RLS) |
| Animations | Framer Motion (page transitions, staggered reveals) |
| Sound | HTML5 Audio (emergency siren MP3) |
| i18n | Custom context + JSON dictionaries (my/en) |

---

## 🗺️ Map Features

- **Data refresh**: Fetches last 7 days of M1+ earthquakes from EMSC every 5 seconds via TanStack Query (shared with the alert monitor)
- **Rendering**: Canvas-based `CircleMarker` for quakes (fast pan/zoom), SVG GeoJSON for tectonic plates
- **Tiles**: Always-light CartoDB Positron street tiles (dark mode only affects the UI chrome)
- **Dam markers**: CSS triangle `DivIcon` colored by risk level (High / Medium / Low)
- **Risk algorithm**: Turf.js `nearestPointOnLine` with bounding-box pre-filter for performance; classification runs on `requestAnimationFrame` to avoid blocking render
- **Risk thresholds**: High ≤30 km, Medium ≤80 km, Low >80 km from plate boundary (wider thresholds because plate data is a coarse approximation)

---

## 🔔 Location Alerts

- **Trigger**: M3+ earthquakes within 50 km of your GPS position or a saved Supabase location
- **Polling**: Reads the shared TanStack Query earthquake cache every 5 seconds
- **Alerting**: Warning snackbar + browser notification + mobile vibration + 60-second looping siren
- **Stop control**: "Stop Sound" permanently stops the current episode — siren only re-arms for a genuinely new event (quake >60 s after the last alerted one)
- **Reassign Location**: Use live GPS position or enter manual coordinates; saved to Supabase with a label
- **Demo mode**: "Test Alert" button plays the full siren flow without a real quake

---

## 🌐 i18n

- Myanmar (`my`) is the default language; English (`en`) available via the navbar toggle
- Choice is persisted in `localStorage`; the `<html lang>` attribute updates automatically
- All UI strings live in `app/src/i18n/en.json` / `my.json` and are accessed via a dot-path `t()` helper

---

## 🔐 Auth & Data

- **Supabase** handles all authentication — no backend server required
- **Instant signup** with email confirmation disabled
- **Locations table** (`supabase/locations.sql`) stores saved monitoring locations with row-level security policies

---

## 📄 Data Sources & Credits

- **Earthquake data**: [EMSC](https://www.seismicportal.eu/) (real-time seismic monitoring)
- **Myanmar dams**: [mmeqopendata](https://github.com/akzedevops/mmeqopendata) — Open Development Mekong / IFC / WLE ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))
- **Tectonic plates**: [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
- **Map tiles**: [OpenStreetMap](https://openstreetmap.org), [CartoDB](https://carto.com/)
- **UI components**: [MUI](https://mui.com/) + [MUI Icons](https://mui.com/material-ui/icons/)
- **Alert sound**: [Pixabay](https://pixabay.com/sound-effects/) — Emergency Warning System
