# Earthquake & Recovery — Project Report

**Author:** Thant Zin Htun  
**Date:** June 19, 2026  
**Course:** AI-Assisted Development  
**Repository:** [GitHub](https://github.com/thant-zin-htun/earthquake-recovery) _(public)_

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Backend API](#4-backend-api)
5. [Frontend Pages](#5-frontend-pages)
6. [Authentication & Location Alerts](#6-authentication--location-alerts)
7. [MCP Integration — Context7](#7-mcp-integration--context7)
8. [Skill — Earthquake API](#8-skill--earthquake-api)
9. [Agent — Code Reviewer](#9-agent--code-reviewer)
10. [Development Process](#10-development-process)
11. [Challenges & Solutions](#11-challenges--solutions)
12. [Deployment](#12-deployment)
13. [Future Work](#13-future-work)
14. [Conclusion](#14-conclusion)

---

## 1. Project Overview

Earthquake & Recovery is a **React + MUI single-page application** with an Express backend that displays live earthquake data from the EMSC (Euro-Mediterranean Seismological Centre) API on an interactive Leaflet map. The platform also provides educational content about earthquake safety, recovery resources, historical earthquake data, and an interactive quiz.

The project was built as part of an AI-assisted development assignment, leveraging **Claude Code** with a custom **MCP tool** (Context7), a **skill** (Earthquake API reference), and a specialized **agent** (Code Reviewer).

### Key Numbers
- **6 pages** with responsive design
- **8 backend endpoints** (API + Auth)
- **12 quiz questions** across 3 categories
- **13 Myanmar cities** with emergency contacts
- **10 team member profiles** with expandable dialogs
- **Dark/light mode** toggle

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| Material UI (MUI) | 7 | Component library & theming |
| MUI Icons | 7 | Icon set |
| react-leaflet | 5 | Map component wrapper |
| Leaflet | 1.9 | Interactive map library |
| react-router-dom | 7 | Client-side routing |
| framer-motion | latest | Page/component animations |
| axios | latest | HTTP client |
| @emotion/react & @emotion/styled | latest | CSS-in-JS (MUI dependency) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4 | HTTP server & API routes |
| bcryptjs | latest | Password hashing |
| jsonwebtoken | latest | JWT generation & verification |
| cors | latest | Cross-origin requests |
| axios | latest | Proxy requests to EMSC |
| nodemon | latest | Dev auto-reload |

### AI/Development Tools

| Tool | Location | Purpose |
|------|----------|---------|
| Context7 MCP | `.mcp.json` | Live documentation queries |
| Earthquake API Skill | `.claude/skills/earthquake-api.md` | API reference for Claude |
| Code Reviewer Agent | `.claude/agents/earthquake-reviewer.md` | Automated code review |

---

## 3. Architecture

```
earthquake-recovery/
├── .mcp.json                          # MCP configuration (Context7)
├── .claude/
│   ├── skills/
│   │   └── earthquake-api.md          # Skill: USGS/EMSC API reference
│   ├── agents/
│   │   └── earthquake-reviewer.md     # Agent: code reviewer
│   └── settings.local.json
├── server.js                          # Express backend
├── vite.config.js                     # Vite config with API proxy
├── package.json
├── CLAUDE.md                          # Claude Code project instructions
├── plan.md                            # Project plan & progress
├── data/                              # JSON file storage (backend)
├── public/                            # Static assets
└── src/
    ├── main.jsx                       # Entry point
    ├── App.jsx                        # Root component with routing
    ├── theme.js                       # MUI theme (light/dark)
    ├── context/
    │   └── AuthContext.jsx            # Auth state provider
    ├── data/
    │   ├── siteSearchData.js          # Search index data
    │   └── emergencyPhones.js         # Phone numbers by city
    ├── components/
    │   ├── Layout.jsx                 # Navbar + Footer wrapper
    │   ├── Navbar.jsx                 # Navigation with search & phones
    │   ├── Footer.jsx                 # Site footer
    │   ├── EarthquakeMap.jsx          # Leaflet map with quake markers
    │   ├── AuthDialog.jsx             # Login/Register modal
    │   ├── SiteSearch.jsx             # Full-text site search
    │   └── EmergencyPhones.jsx        # Emergency contacts dialog
    └── pages/
        ├── Home.jsx                   # Hero + Map + Safety tips
        ├── About.jsx                  # Team profiles
        ├── Recovery.jsx               # Recovery resources
        ├── Donate.jsx                 # Donation options
        ├── Quiz.jsx                   # Interactive quiz
        └── History.jsx                # Historical earthquake timeline
```

### Data Flow

```
EMSC API → Express /api/recent (cached, 5min) → EarthquakeMap.jsx → Leaflet Markers
Browser geolocation → Haversine distance calc → Alert if quake < 50km
User inputs → React state → POST /api/* → JSON file storage on server
```

---

## 4. Backend API

### Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/subscribe` | Store user email + region for alerts |
| POST | `/api/contact` | Store contact form submission |
| GET | `/api/recent` | Proxy EMSC earthquake data (5-min cache) |
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Register new user (bcrypt hashed) |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user from JWT |

### Security
- Passwords hashed with `bcryptjs` (10 salt rounds)
- JWTs signed with `HS256`, expire in 24 hours
- CORS configured for development and production origins
- Input validation on all POST endpoints

---

## 5. Frontend Pages

### Home (`/`)
- **Hero banner** with animated gradient background
- **Live earthquake map** as the centerpiece — shows current quakes with color-coded markers, tectonic plate overlays, and click-to-inspect popups
- **Safety tip cards** explaining the international standard: **Drop, Cover, and Hold On**
- Location-based alert signup section

### About (`/about`)
- Mission statement hero section
- **10 team member cards** with custom avatars, role badges (MUI Chips), and skill tags
- Click-to-expand **detail dialog** showing contact info, education, and languages
- Staggered entrance animations via `framer-motion`

### Recovery (`/recovery`)
- **Tabbed layout**: Short-term / Mid-term / Long-term recovery topics
- Image cards for each recovery phase with descriptions
- Gradient hero background with emergency information

### Donate (`/donate`)
- **Tab switcher**: Cryptocurrency / Mobile Payments / International
- Payment method cards with recognizable logos
- Wallet address display dialog with **one-click copy** button

### Quiz (`/quiz`)
- **MUI Stepper** with **12 questions** — shows 5 steps at a time, scrollable
- Questions organized by category: Safety, Science, Geography
- `RadioGroup` for answer selection
- Progress bar showing completion percentage
- **Animated score reveal** with celebration effects at the end

### History (`/history`)
- **Alternating timeline** layout for major earthquakes
- **Magnitude slider** to filter events by severity
- Expandable impact details per event
- Color-coded magnitude badges matching the map's color system

---

## 6. Authentication & Location Alerts

### Authentication System
- `AuthContext` React context wraps the entire application
- Provides `user`, `token`, `login()`, `register()`, `logout()` to all components
- `AuthDialog` MUI Dialog with Login/Register tab switching
- Navbar shows **Login/Register** buttons when logged out, **user chip + Logout** when authenticated
- Mobile drawer includes authentication section

### Location-Based Earthquake Alerts
This feature replaces the simple email subscription form with real-time, personalized alerts:

1. User logs in via JWT authentication
2. Browser geolocation API captures latitude/longitude
3. Backend polls EMSC data every **30 seconds**
4. **Haversine formula** calculates distance from user to each quake
5. Alert displayed if any quake is within **50 km radius** of the user's location

The Haversine formula implementation accounts for Earth's curvature, providing accurate distance calculations for Myanmar's geographic range.

---

## 7. MCP Integration — Context7

### What is MCP?

The **Model Context Protocol** (MCP) is a standardized interface that allows AI assistants like Claude to communicate with external tools and services. It provides structured access to APIs, documentation, and data sources.

### Our Implementation

Configuration in `.mcp.json`:
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

### How Context7 Was Used

Context7 provides Claude Code with the ability to fetch live, up-to-date documentation for any library. During development, it was used to:

1. **Resolve library identifiers** — find exact `/org/project` IDs for npm packages
2. **Query API documentation** — ask specific questions about component APIs, breaking changes, and best practices
3. **Retrieve code examples** — get copy-paste ready snippets for MUI components, react-leaflet patterns, and Express middleware

### Key Queries Made During Development

| Library | Query | Purpose |
|---------|-------|---------|
| `@mui/material` | "MUI Stepper with scrollable steps and visible step limit" | Implementing Quiz Stepper |
| `react-leaflet` | "Custom divIcon with SVG marker and color by data attribute" | Map markers by magnitude |
| `react-leaflet` | "LayersControl with GeoJSON overlay" | Tectonic plate toggle |
| `express` | "JWT middleware with bcrypt password verification" | Auth implementation |
| `framer-motion` | "Staggered children animation with variants" | About page animations |
| `@mui/material` | "Dialog with tab switching between login and register" | AuthDialog component |

### Benefits
- **No guessing** at API signatures — always had the correct, current API
- **Version-specific docs** — MUI v7 and react-leaflet v5 have different APIs than older versions
- **Faster development** — instead of reading full documentation pages, got targeted answers
- **Reduced errors** — fewer incorrect API calls, fewer breaking changes missed

---

## 8. Skill — Earthquake API

### What is a Skill?

In Claude Code, a **skill** is a markdown file that provides domain-specific knowledge and instructions. When Claude encounters tasks related to the skill's domain, it loads the skill content to guide its responses.

### Our Skill: Earthquake API Reference

**Location:** `.claude/skills/earthquake-api.md`

**Contents:**
- Complete USGS feed endpoint table with update frequencies
- GeoJSON feature schema with field descriptions
- Magnitude-to-color mapping used by the map
- Step-by-step guide on how `EarthquakeMap.jsx` renders data
- Instructions for adding new data layers (faults, seismic stations, etc.)
- Backend proxy caching strategy explanation

### Why It Matters

Without this skill, Claude would need to:
- Search the web for USGS API documentation
- Read `EarthquakeMap.jsx` from scratch each time
- Guess at the magnitude color scheme

With the skill, Claude:
- Instantly knows all 4 USGS feed endpoints
- Understands the GeoJSON schema used in the project
- Can suggest correct additions to the map following established patterns
- Knows about the EMSC migration and why it happened

### Example: Adding a New Feed

When asked "Add a past-week M2.5+ feed to the map," Claude uses the skill to:

1. Know the URL pattern: `summary/2.5_week.geojson`
2. Follow the 4-step "Adding a New Data Layer" guide
3. Match the existing color scheme for markers
4. Wire it through the backend proxy at `/api/recent`

---

## 9. Agent — Code Reviewer

### What is an Agent?

A Claude Code **agent** is a specialized sub-agent with a focused system prompt. It can be invoked by name to perform specific tasks independently, with its own context and instructions.

### Our Agent: Earthquake Code Reviewer

**Location:** `.claude/agents/earthquake-reviewer.md`

**Purpose:** Automated, consistent code review tailored to this project's technology stack.

### Review Dimensions

| Dimension | Specific Checks |
|-----------|----------------|
| **react-leaflet patterns** | No nested MapContainers, stable marker keys, proper cleanup |
| **MUI accessibility** | Alt text, WCAG AA contrast, focus indicators, keyboard nav |
| **API error handling** | try/catch on all fetches, fallback UI, meaningful error messages |
| **State management** | useMemo/useCallback where needed, stable keys, no stale closures |
| **Component hygiene** | Small focused components, custom hooks, composition over inheritance |

### How It's Used

The agent can be invoked with commands like:
- "Review the EarthquakeMap component"
- "Check accessibility across all pages"
- "Audit the auth system for security"

I can also ask it directly in this conversation by just telling it its name.

### Example Finding

```
✅ EarthquakeMap.jsx:23 — Good use of useEffect cleanup for interval
⚠️  Navbar.jsx:42 — Icon button missing aria-label attribute
✅ server.js:56 — bcrypt hashing at 10 salt rounds (industry standard)
```

### Benefits
- **Pre-commit review** — catch issues before they reach production
- **Consistent standards** — same checks applied every time
- **Project-aware** — understands react-leaflet and MUI patterns specific to this codebase
- **Constructive feedback** — suggests fixes with code examples, not just complaints

---

## 10. Development Process

### Phase 1: Scaffold
Set up Vite + React project with all dependencies. Created the directory structure, theme configuration, and base layout components.

### Phase 2: Backend
Built the Express server with all API routes. Implemented JSON file storage, CORS, and the USGS→EMSC proxy endpoint.

### Phase 3: Pages
Built all 6 pages with full functionality — Home map, About team profiles, Recovery resources, Donate options, Quiz with 12 questions, and History timeline.

### Phase 4: Navbar Features
Added `SiteSearch` (full-text search across all pages) and `EmergencyPhones` (13 cities, 20+ contacts each) as MUI Dialogs accessible from the navbar.

### Phase 5: Auth & Alerts
Implemented JWT authentication (register, login, logout) with `AuthContext` and `AuthDialog`. Replaced static email subscription with location-based earthquake alerts using the Haversine formula.

### Phase 6: Data Source Change
Switched from USGS to EMSC API for better earthquake data coverage in the Asia / Myanmar region. Updated backend proxy and map component.

### Phase 7: CI Tools
Added `.mcp.json` (Context7), `.claude/skills/earthquake-api.md`, `.claude/agents/earthquake-reviewer.md`, `CLAUDE.md`, and `plan.md`.

---

## 11. Challenges & Solutions

### Challenge 1: react-leaflet v5 API Changes
The v5 upgrade changed how markers and layers work. Solutions:
- Used stable `q.id` keys for markers instead of array indices
- Handled LayerGroup lifecycle properly with cleanup in `useEffect`

### Challenge 2: MUI v7 Breaking Changes
MUI v7 deprecated the `Grid` component in favor of `Stack`. Solutions:
- Used `Stack` with `direction="row"` for horizontal layouts
- Kept `Grid` only where complex 2D layouts were needed
- Used Context7 to confirm the correct v7 API signatures

### Challenge 3: USGS Coverage Gaps in Asia
The USGS API had sparse coverage for smaller quakes in the Myanmar region. Solution:
- Switched to EMSC (Euro-Mediterranean Seismological Centre) API
- EMSC provides better coverage for the Asia-Pacific region
- Updated backend proxy to cache and serve EMSC data

### Challenge 4: Mobile Responsiveness
The quiz Stepper and earthquake map needed significant mobile adjustments. Solutions:
- Stepper: show 5 steps visible at a time, horizontal scroll on mobile
- Map: full-width on mobile, reduced popup size
- Navbar: hamburger drawer for mobile with all features

### Challenge 5: JWT Token Lifecycle
Token refresh timing needed careful handling. Solution:
- 24-hour token expiry for reasonable security/usability balance
- `AuthContext` checks token validity on app mount
- Graceful redirect to login when token expires

---

## 12. Deployment

### Planned Deployment

| Component | Platform | Configuration |
|-----------|----------|---------------|
| Frontend | Netlify | Static site from `dist/`, auto-deploy on push |
| Backend | Render | Express web service, auto-deploy from `main` |

### Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | Frontend | Backend API base URL |
| `JWT_SECRET` | Backend | JWT signing secret |
| `PORT` | Backend | Server port (Render sets this) |

### Build Commands
```bash
npm run build          # Vite production build → dist/
npm run server:dev     # Backend with nodemon auto-reload
```

---

## 13. Future Work

| Feature | Description | Priority |
|---------|-------------|----------|
| 🌊 **Tsunami Warnings** | Integrate NOAA tsunami alert API | High |
| 📱 **PWA Support** | Offline mode + push notifications for alerts | High |
| 🌐 **i18n Localization** | Burmese (မြန်မာ) and English language toggle | Medium |
| 📊 **Seismic Charts** | Chart.js historical earthquake trends | Medium |
| 🏥 **Hospital Finder** | Show nearest hospital when alert triggers | Medium |
| 🧪 **E2E Tests** | Playwright test suite for critical user flows | Medium |
| 🔔 **Push Notifications** | Browser push API for background quake alerts | Low |
| 📍 **Multi-Location** | Save multiple locations for alerts | Low |

---

## 14. Conclusion

The Earthquake & Recovery project demonstrates the full stack of modern web development enhanced by AI-assisted tooling:

### What Was Built
- A **full-stack React + Express application** with live earthquake data visualization
- **8 API endpoints** serving authentication, data proxy, and data storage
- **6 responsive pages** covering education, recovery resources, and interactive features
- **Dark/light theming**, animations, and mobile-responsive design throughout

### AI Tooling Demonstrated
- **1 MCP** — Context7 for live, up-to-date documentation queries across 12+ npm packages
- **1 Skill** — Earthquake API reference that guides Claude's understanding of USGS/EMSC data
- **1 Agent** — Automated code reviewer specializing in react-leaflet, MUI accessibility, and API error handling

### Key Takeaways
1. **MCP tools** dramatically reduce time spent searching for correct API usage in documentation
2. **Skills** ensure AI assistants understand project-specific patterns and data sources
3. **Agents** provide consistent, repeatable code review that catches domain-specific issues
4. **AI-assisted development** works best when the AI has context — CLAUDE.md, skills, and MCP tools provide that context

---

**Repository:** Public on GitHub  
**Slides:** `slides.md` (Marp format, 20 slides)  
**Report:** `report.md` (this file)  
**MCP:** `.mcp.json` (Context7)  
**Skill:** `.claude/skills/earthquake-api.md`  
**Agent:** `.claude/agents/earthquake-reviewer.md`
