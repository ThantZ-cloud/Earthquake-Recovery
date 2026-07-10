---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---

<!-- slide 1 -->
# 🌍 Earthquake & Recovery
**Real-time earthquake tracking, dam risk assessment & safety education**
<!-- 20s -->

---

<!-- slide 2 -->
# The Problem
- Earthquakes strike without warning in Myanmar
- 254 dams sit near active fault lines — most people don't know the risk
- No single place for live data + safety guides + recovery resources
<!-- 20s -->

---

<!-- slide 3 -->
# What I Built
- **Live earthquake map** — EMSC data, 700+ quakes, refreshed every 5 seconds
- **🇲🇲 Myanmar dams** — 254 dams with risk levels (🔴🟠🟢) based on distance to fault lines
- **📍 Location alerts** — real-time monitoring with emergency siren + browser notifications
- **🛡️ Safety education** — Drop, Cover, Hold On + emergency phone numbers for 13 cities
<!-- 20s -->

---

<!-- slide 4 -->
# How I Built It
- **Frontend:** React 19 + MUI 7 + Leaflet map
- **Data:** EMSC Seismic Portal (live, no backend needed)
- **Spatial analysis:** Turf.js — calculates dam-to-fault distance for risk classification
- **Auth:** Supabase (instant signup, no backend)
- **i18n:** English + Myanmar (Burmese) from day one
<!-- 20s -->

---

<!-- slide 5 -->
# Why It Matters
- Saves lives through **education** — Drop, Cover, Hold On
- **254 Myanmar dams** assessed for fault-line risk (red/orange/green)
- Keeps people **informed** with real-time earthquake data + alerts
- Helps communities **recover** with emergency contacts + resources
<!-- 20s -->

---

<!-- slide 6 -->
# ✅ Done Checklist
- [x] Live earthquake map with EMSC data (700+ quakes)
- [x] Myanmar dams with Turf.js risk assessment
- [x] Location-based alerts with emergency siren
- [x] Emergency phone numbers (13 Myanmar cities)
- [x] Safety guide, Quiz, Recovery, History pages
- [x] English + Myanmar language support
- [x] Dark/Light mode, Responsive design
- [x] MIT License
<!-- 20s -->
