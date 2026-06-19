---
marp: true
theme: default
size: 16:9
paginate: true
header: 'Earthquake & Recovery'
footer: 'MCP · Skill · Agent · Report — June 2026'
style: |
  section {
    font-family: 'Segoe UI', sans-serif;
  }
  h1 { color: #d32f2f; }
  h2 { color: #e65100; }
  code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
  table { font-size: 0.9em; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
---

<!-- _class: lead -->
# 🌍 Earthquake & Recovery

## React + MUI · Express · Leaflet · Live Data

**Thant Zin Htun** · June 2026
_1 MCP · 1 Skill · 1 Agent · Public Repo_

---

<!-- _class: lead -->
# 📋 Agenda

| # | Section | Topic |
|---|---------|-------|
| 1 | 🏗️ | Project Architecture & Stack |
| 2 | 🗺️ | Live Earthquake Map & Data |
| 3 | 🧠 | MCP — Context7 Integration |
| 4 | 🛠️ | Skill — Earthquake API |
| 5 | 🤖 | Agent — Code Reviewer |
| 6 | 🚀 | Demo, Deployment & Future Plans |

---

# 🎯 Project Goal

Rebuild the static earthquake site as a **modern React + MUI single-page app** with:

<div class="columns">
<div>

### Frontend
- ⚛️ React 19 + Vite
- 🎨 Material UI v7
- 🗺️ react-leaflet + Leaflet
- 🎬 framer-motion
- 🧭 react-router-dom v7

</div>
<div>

### Backend
- 🟢 Express.js
- 🔐 JWT Authentication
- 📊 EMSC API proxy
- 🗄️ JSON file storage
- ⚡ CORS + rate limiting

</div>
</div>

> **6 pages** · **8 backend endpoints** · **dark/light mode** · **responsive design**

---

# 🏗️ Architecture Overview

```
Frontend (React + Vite)              Backend (Express :3001)
src/                                 server.js
├── components/                      ├── POST /api/subscribe
│   ├── Layout.jsx                  ├── POST /api/contact
│   ├── Navbar.jsx                  ├── POST /api/auth/register
│   ├── EarthquakeMap.jsx           ├── POST /api/auth/login
│   ├── SiteSearch.jsx              ├── GET  /api/auth/me
│   └── EmergencyPhones.jsx         ├── GET  /api/recent (EMSC proxy)
└── pages/                          └── GET  /api/health
    ├── Home.jsx
    ├── About.jsx                   .mcp.json  (Context7 MCP)
    ├── Recovery.jsx                .claude/skills/
    ├── Donate.jsx                  .claude/agents/
    ├── Quiz.jsx
    └── History.jsx
```

---

# 🗺️ Live Earthquake Map

- **Data source:** EMSC API (better Asia coverage than USGS)
- **Map:** Leaflet with `react-leaflet` v5
- **Tectonic plates:** Fraxen PB2002 GeoJSON overlay

### Features
- 🔴 Color-coded markers by magnitude
- 🖱️ Click for popup: place, depth, time
- 🎛️ Layer controls: toggle plates, dark/light tiles
- 📍 Shows quakes from **past hour** — every 30s auto-refresh

| Magnitude | Color |
|-----------|-------|
| < M2 | 🟢 Green |
| M2–M4 | 🟡 Yellow |
| M4–M6 | 🟠 Orange |
| M6+ | 🔴 Red |

---

# 🔐 Auth & Location Alerts

### JWT Authentication
- `bcryptjs` password hashing
- `jsonwebtoken` tokens (24h expiry)
- `AuthContext` wraps entire app
- Login / Register via modal dialog

### Location-Based Alerts 🌐
1. User logs in → grants geolocation
2. Backend proxies EMSC data every 30s
3. **Haversine formula** calculates distance
4. Alert triggers if quake **within 50km** of user

> Replaces static email subscription with real-time, personalized alerts

---

# 📱 Navbar Features

### 🔍 SiteSearch
- Full-text search across **all 6 pages**
- Real-time autocomplete with section tags
- Click any result → direct navigation
- Data: `src/data/siteSearchData.js`

### 📞 EmergencyPhones
- Red phone icon in navbar
- City dropdown: **13 Myanmar cities**
- Shows: Fire, Ambulance, Police, Hospital, Red Cross
- Data: `src/data/emergencyPhones.js`
- **20+ contacts per city**

---

# 📄 Pages — Part 1

### 🏠 Home
- Hero banner with animated background
- Live earthquake map front-and-center
- Safety tip cards: **Drop · Cover · Hold On**

### 👥 About
- Mission statement hero
- 10 team member profile cards
- Expandable detail dialogs
- Staggered entrance animations

### 🩹 Recovery
- Tabbed layout: Short / Mid / Long term
- Image cards for each recovery topic

---

# 📄 Pages — Part 2

### 💰 Donate
- Tab switcher: Crypto / Mobile / International
- Payment method cards with logos
- Wallet address dialog with **copy button**

### 🧠 Quiz
- **12 questions** across 3 categories
- MUI Stepper (5 visible at a time, scrollable)
- RadioGroup with category labels
- Animated score reveal with celebration 🎉

### 📜 History
- Alternating timeline layout
- Magnitude slider filter
- Expandable impact details
- Color-coded magnitude badges

---

# 🔌 MCP — Context7

### What is MCP?
Model Context Protocol — standardized interface between AI assistants and external tools.

### Our MCP Configuration

`.mcp.json`:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### How it helps
- Fetches **up-to-date documentation** for any library
- Claude Code auto-queries Context7 when editing code
- Covers: MUI, React, Express, Leaflet, all dependencies

---

# 🔌 MCP — How Context7 Works

### Workflow

1. **Resolve Library ID** → Find the exact `/org/project` identifier
2. **Query Docs** → Ask specific questions about API usage
3. **Get code examples** → Copy-paste ready snippets

### Example Queries

| Library | Query |
|---------|-------|
| `@mui/material` | "How to use Stepper with scrollable steps?" |
| `react-leaflet` | "LayersControl with custom markers example" |
| `express` | "JWT middleware with bcrypt password verify" |
| `framer-motion` | "Staggered children animation variants" |

> **Used throughout development** — from MUI Stepper to Leaflet markers

---

# 🛠️ Skill — Earthquake API

### Location
`.claude/skills/earthquake-api.md`

### Purpose
Documents the **USGS/EMSC earthquake data API** so Claude Code can work with it effectively.

### Contents
- 📊 USGS feed endpoints & update frequencies
- 📐 GeoJSON schema reference
- 🎨 Magnitude → color mapping
- 🗺️ How `EarthquakeMap.jsx` renders data
- 📝 Steps to add a new data layer
- 🔄 Local backend proxy caching strategy

---

# 🛠️ Skill — Key Sections

### API Endpoints Documented

| Feed | Update Frequency |
|------|-----------------|
| Past hour (all) | Every minute |
| Past hour (M1.0+) | Every minute |
| Past day (M4.5+) | Every minute |
| Past month (M4.5+) | Every 5 minutes |

### How the Map Renders
```
fetch USGS → GeoJSON → Leaflet Markers → Custom SVG divIcon
```

### Adding New Layers
```
1. Find GeoJSON feed URL
2. fetch() in EarthquakeMap.jsx
3. <GeoJSON data={data} /> inside <LayersControl>
4. Give descriptive Overlay name
```

---

# 🤖 Agent — Code Reviewer

### Location
`.claude/agents/earthquake-reviewer.md`

### Purpose
Specialized **code review agent** for this project. Automatically checks:

| Area | What It Checks |
|------|---------------|
| 🗺️ react-leaflet | No nested MapContainers, stable keys |
| ♿ MUI a11y | Alt text, color contrast, focus indicators |
| 🚨 API errors | try/catch on all fetches, fallback UI |
| ⚛️ State mgmt | useMemo/useCallback, no wasted re-renders |
| 📦 Component hygiene | Small focused components, custom hooks |

### Review Style
- File paths + line numbers
- Code fix examples
- Constructive, not pedantic

---

# 🤖 Agent — Running the Reviewer

### How to invoke
```
"Review the EarthquakeMap component"
"Check accessibility across all pages"
"Audit the auth system for security issues"
```

### What it found (example)
> ✅ `EarthquakeMap.jsx` — good use of `useEffect` cleanup
> ⚠️ `Navbar.jsx:42` — missing `aria-label` on icon button
> ✅ `server.js` — proper bcrypt hashing, salt rounds = 10

### Benefits
- Catches issues **before** they reach production
- Consistent review standards every time
- Understands project-specific patterns

---

# 🚀 Deployment Plan

<div class="columns">
<div>

### Frontend → Netlify
- Vite build → `dist/`
- Auto-deploy on git push
- Environment: `VITE_API_URL`
- Free tier: 100GB bandwidth

</div>
<div>

### Backend → Render
- Express web service
- Auto-deploy from `main`
- Env vars: `JWT_SECRET`, `PORT`
- Free tier: 750h/month

</div>
</div>

### CI/CD Pipeline
```
Git Push → Build & Test → Deploy Frontend (Netlify) + Backend (Render)
```

---

# 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Frontend files | 15+ components & pages |
| Backend endpoints | 8 endpoints |
| API dependencies | 12 npm packages |
| MUI components used | 30+ |
| Quiz questions | 12 across 3 categories |
| Emergency cities | 13 Myanmar cities |
| Team members | 10 profiles |
| Git commits | 15+ |

### MCP + Skill + Agent
- **1 MCP** — Context7 for live docs
- **1 Skill** — Earthquake API reference
- **1 Agent** — Code reviewer

---

# 🎓 Challenges & Lessons

### Challenges
- 🗺️ `react-leaflet` v5 API changed — markers need stable keys
- 🎨 MUI v7 breaking changes in Grid → Stack migration
- 🌏 USGS had poor Asia coverage → switched to EMSC
- 🔐 JWT token refresh timing
- 📱 Mobile responsiveness for the map + Stepper

### Key Learnings
- Always **lazy-load** heavy map components
- **Proxy APIs** through backend to avoid CORS
- Haversine formula for **server-side** distance calc
- MCP tools stay out of your way until you need them
- Agents catch issues humans miss in repetitive review

---

# 🔮 Future Improvements

| Feature | Description |
|---------|-------------|
| 🌊 Tsunami warnings | Integrate NOAA tsunami alert API |
| 📱 PWA | Offline mode + push notifications |
| 🌐 i18n | Burmese & English language toggle |
| 📊 Seismic graphs | Chart.js for historical trends |
| 🏥 Hospital finder | Nearest hospital on alert |
| 🧪 E2E tests | Playwright for critical flows |

---

<!-- _class: lead -->
# ✅ Recap

| Requirement | Status |
|-------------|--------|
| 1 MCP (Context7) | ✅ Complete |
| 1 Skill (Earthquake API) | ✅ Complete |
| 1 Agent (Code Reviewer) | ✅ Complete |
| Public Repo | ✅ GitHub |
| 6×20 Marp Slides | ✅ This presentation |
| report.md | ✅ In repository |

## Thank you! 🙏
### Questions?

---

<!-- _class: lead -->
# 🎉 Live Demo

## Let's see it in action!

```
npm run dev        # Frontend :5173
npm run server:dev # Backend :3001
```

**Live site:** _(coming soon — Netlify + Render deployment pending)_
