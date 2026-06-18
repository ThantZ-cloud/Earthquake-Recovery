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
- MUI Stepper for 6 questions
- RadioGroup answer selection
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

## Phase 5: Claude Code Integration ✅

- `.mcp.json` — Context7 MCP for live docs
- `.claude/skills/earthquake-api.md` — USGS data skill
- `.claude/agents/earthquake-reviewer.md` — Code review agent
- `CLAUDE.md` — Claude Code project guidance

---

## Phase 6: Deployment (pending)

- **Frontend** → Netlify
- **Backend** → Render free tier

---

## Work Done

1. ✅ Scaffold Vite + MUI + Router + backend
2. ✅ Express server (4 endpoints)
3. ✅ Layout: Navbar + Footer + theme
4. ✅ Home page: Hero + Map + Form + Safety cards
5. ✅ About Us: Modern team profiles
6. ✅ Recovery page: Tabbed resource cards
7. ✅ Donate page: Payment options grid
8. ✅ Quiz page: Interactive MUI quiz
9. ✅ History page: Timeline + filter
10. ✅ Frontend forms wired to backend
11. ✅ .mcp.json, skill, agent, CLAUDE.md
12. ✅ Website search + emergency phones in navbar
13. ⬜ Deploy frontend + backend
14. ⬜ Marp slides + report
