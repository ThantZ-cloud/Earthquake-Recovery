# Earthquake-Recovery — Project Plan

## Goal

Rewrite the existing static HTML/CSS/JS earthquake site as a modern React + MUI app with an Express backend. Every page gets a fresh design — no boring tabs, no cramped layouts.

---

## Phase 1: Scaffold ✅

- Vite + React (JS)
- MUI (`@mui/material`, icons, emotion)
- `react-router-dom` for routing
- `react-leaflet` + `leaflet` for the map
- `framer-motion` for animations
- `axios` for API calls

```
/
├── server.js
├── data/                    # JSON file store
├── vite.config.js
├── .mcp.json
├── .claude/
│   ├── skills/
│   └── agents/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── theme.js
    ├── data/
    │   ├── siteSearchData.js
    │   └── emergencyPhones.js
    ├── components/
    │   ├── Layout.jsx       # Navbar + Footer wrapper
    │   ├── Navbar.jsx       # Nav with search + emergency phones
    │   ├── Footer.jsx
    │   ├── EarthquakeMap.jsx
    │   ├── SiteSearch.jsx   # Website content search
    │   └── EmergencyPhones.jsx  # Phone numbers by city
    └── pages/
        ├── Home.jsx
        ├── About.jsx        # Meet the team
        ├── Recovery.jsx
        ├── Donate.jsx
        ├── Quiz.jsx
        └── History.jsx
```

---

## Phase 2: Express Backend ✅

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/subscribe` | Save email + region for quake alerts |
| POST | `/api/contact` | Save name, email, message |
| GET | `/api/recent` | Proxy USGS data (avoids CORS, adds caching) |
| GET | `/api/health` | Health check |

---

## Phase 3: Pages ✅

### Home (`/`) 
- Hero banner with animated background
- Live earthquake map (react-leaflet + USGS data + tectonic plate overlays)
- Magnitude legend
- Safety tip cards (Drop / Cover / Hold On)
- Alert signup form → POST /api/subscribe

### About Us (`/about`)
- Hero with mission statement
- 10 team member cards with avatars, role badges, skills as MUI Chips
- Click to expand detail dialog (contact, education, languages)
- Staggered framer-motion entrance animations

### Recovery (`/recovery`)
- Tabbed layout: Short-term / Mid-term / Long-term
- Image cards for each recovery topic
- Hero with gradient background

### Donate (`/donate`)
- Tab switcher: Crypto / Mobile Payment / International
- Payment method cards with logos
- Wallet address dialog with copy button

### Quiz (`/quiz`)
- MUI Stepper for 12 questions (scrolls 5 visible at a time)
- RadioGroup answer selection with category labels
- Progress bar
- Score reveal with animated celebration

### History (`/history`)
- Custom alternating timeline layout
- Magnitude slider filter
- Expandable impact details
- Color-coded magnitude badges

---

## Phase 4: Navbar Features ✅

### Website Search
- Search box indexes all site content
- Real-time autocomplete with section tags
- Click result to navigate to page
- Data in `src/data/siteSearchData.js`

### Emergency Phone Numbers
- Red phone icon button in nav
- Dialog with city dropdown (13 Myanmar cities)
- Shows fire, ambulance, police, hospital contacts
- Data in `src/data/emergencyPhones.js`

---

## Phase 5: Auth + Location Alerts ✅

### Auth system
- `bcryptjs` + `jsonwebtoken` for password hashing and JWT
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `AuthContext` wraps app — provides `user`, `token`, `login()`, `register()`, `logout()`
- `AuthDialog` — MUI Dialog with Login/Register tabs
- Navbar shows Login/Register when logged out, user chip + Logout when logged in
- Mobile drawer includes auth section

### Location-based Earthquake Alerts
- Replaces email subscribe form
- User must login first, then grant geolocation
- Polls EMSC data every 30s, checks distance with Haversine formula
- Alerts if quake within 50km of user

## Phase 6: Data Source Change ✅
- Switched from USGS to EMSC API for better Asia region coverage
- Backend proxy at `/api/recent` caches EMSC data

## Phase 7: Quiz Expansion ✅
- Expanded from 6 to 12 questions
- Stepper scrolls 5 visible at a time
- Added category labels (Safety, Science, Geography)

---

## Phase 6: Deployment (pending)

- **Frontend** → Netlify
- **Backend** → Render free tier

---

## Work Done

1. ✅ Scaffold Vite + MUI + Router + backend
2. ✅ Express server (7 endpoints)
3. ✅ Layout: Navbar + Footer + theme
4. ✅ Home page: Hero + Map + Location alerts
5. ✅ About Us: Modern team profiles
6. ✅ Recovery page: Tabbed resource cards
7. ✅ Donate page: Payment options grid
8. ✅ Quiz page: 12-question interactive quiz
9. ✅ History page: Timeline + filter
10. ✅ Website search + emergency phones in navbar
11. ✅ .mcp.json, skill, agent, CLAUDE.md, plan.md
12. ✅ Auth: Register, Login, Logout with JWT
13. ✅ Location-based quake alerts (50km radius)
14. ✅ EMSC data source for better Asia coverage
15. ⬜ Deploy frontend + backend
16. ⬜ Marp slides + report
