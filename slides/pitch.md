---
marp: true
theme: default
size: 16:9
paginate: true
header: 'Earthquake & Recovery'
footer: 'Thant Zin Htun · June 2026'
style: |
  section { font-family: 'Segoe UI', sans-serif; }
  h1 { color: #d32f2f; }
  h2 { color: #e65100; }
transition: fade
auto-advance: 20
---

# Who's my person?

* **Target Audience**: Citizens and emergency responders in active seismic zones (specifically Myanmar/Asia).
* **The User**: Someone who needs real-time, reliable earthquake data without wading through complex scientific feeds.
* **The Presenter**: Thant Zin Htun · Utilizing 1 MCP, 1 Custom Skill, and 1 Autonomous Agent to deliver a rapid full-stack solution.

---

# Their problem

* **Information Fragmentation**: Critical data (live maps, safety education, emergency hotlines) is scattered across old websites or static PDFs.
* **Proximity Blindness**: Users don't know if a registered seismic event is close enough to be an immediate danger to their specific coordinates.
* **Development Friction**: Building these tools manually takes too long when configuring complex maps, strict JWT auth, and live proxy APIs.

---

# What I built

* **Live Earthquake Map**: EMSC data proxy updating every 30s with color-coded magnitudes and tectonic plate overlays using React-Leaflet.
* **Auth & Proximity Alerts**: JWT security paired with browser geolocation using the Haversine formula to trigger alerts if a quake hits within 50km.
* **Safety & Readiness Tools**: A 12-question interactive MUI Stepper quiz and localized emergency directories for 13 Myanmar cities covering 20+ contacts each.

---

# How I built it

* **MCP (Context7)**: Pulled live documentation for React 19, MUI v7, and react-leaflet v5 so there was zero guessing on API signatures.
* **Skill (API ref)**: Injected USGS/EMSC feed specifications directly into Claude's context to map out correct URL patterns and data schemas instantly.
* **Agent (Reviewer)**: Ran an autonomous code review loop before commits to enforce clean state management, error handling, and robust accessibility standards.

---

# Why it matters

* **6 Pages / 8 Endpoints**: A comprehensive, production-ready frontend (Home, About, Quiz, etc.) backed by a secured Express server.
* **Data in Numbers**: Tracks critical info across **13 cities** and drives interactive education via a **12-question** safety quiz.
* **AI-Accelerated**: Completed across **15+ modular commits** and 7 development phases using integrated developer tools.

---

# Done checklist

- [x] Repository public and open for review
- [x] Full AI Toolbelt integration verified (MCP + custom skill + autonomous reviewer agent utilized)
- [x] Comprehensive `report.md` finalized and committed to the team repository
- [x] Live development build validated on `:5173` (Frontend) and `:3001` (Backend)