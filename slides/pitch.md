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
---

<!-- _class: lead -->
# 🌍 Earthquake & Recovery
## React + MUI · Express · Leaflet · Live Data

**Thant Zin Htun** · 1 MCP · 1 Skill · 1 Agent

---

# 🏗️ What I Built

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
<div>

**Frontend — React 19 + MUI v7**
- 🗺️ **Live earthquake map** (Leaflet)
- 🔐 **JWT auth** + location alerts
- 📱 6 pages, dark/light mode
- 🎬 framer-motion animations

**Backend — Express**
- 8 API endpoints
- EMSC data proxy (Asia coverage)
- bcrypt + JWT security

</div>
<div>

**AI Tools**
- 🔌 **MCP** — Context7 (live docs)
- 🛠️ **Skill** — Earthquake API ref
- 🤖 **Agent** — Code reviewer

```
src/components/  →  6 pages
src/data/        →  search + phones
server.js        →  8 endpoints
.claude/         →  MCP, skill, agent
```

</div>
</div>

---

# 🗺️ Key Features

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
<div>

### Live Earthquake Map
- EMSC data every 30s
- Color-coded by magnitude
- Tectonic plate overlays
- Click markers for details

</div>
<div>

### Auth + Location Alerts
- Register / Login with JWT
- Browser geolocation
- Haversine distance formula
- Alert if quake < 50km away

</div>
<div>

### 12-Question Quiz
- MUI Stepper (5 visible)
- 3 categories
- Animated score reveal

</div>
<div>

### Emergency Phones
- 13 Myanmar cities
- 20+ contacts each
- Fire, ambulance, hospital

</div>
</div>

---

# 🔌 MCP · Skill · Agent

| Tool | What | How It Helps |
|------|------|-------------|
| **MCP** (Context7) | Live documentation | No guessing API signatures — queried MUI v7, react-leaflet v5, Express |
| **Skill** (API ref) | USGS/EMSC feed guide | Claude knows all endpoints, color scheme, proxy strategy |
| **Agent** (Reviewer) | Auto code review | Checks leaflet patterns, MUI a11y, error handling, state mgmt |

```
User: "Add a 7-day quake feed to the map"
Claude + Skill → knows URL pattern, reads EarthquakeMap pattern, adds it correctly
Claude + MCP → queries react-leaflet docs for current GeoJSON API
Claude + Agent → reviewed before commit for stable keys + cleanup
```

---

# 📊 By The Numbers

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;text-align:center;">
<div>
<h1 style="color:#d32f2f;">6</h1>
<b>Pages</b><br>
<small>Home · About · Recovery · Donate · Quiz · History</small>
</div>
<div>
<h1 style="color:#d32f2f;">8</h1>
<b>API Endpoints</b><br>
<small>Auth · Subscribe · Contact · Proxy · Health</small>
</div>
<div>
<h1 style="color:#d32f2f;">3</h1>
<b>AI Tools</b><br>
<small>MCP · Skill · Agent</small>
</div>
<div>
<h1 style="color:#d32f2f;">12</h1>
<b>Quiz Questions</b><br>
<small>Safety · Science · Geography</small>
</div>
<div>
<h1 style="color:#d32f2f;">13</h1>
<b>Cities Covered</b><br>
<small>Emergency contacts</small>
</div>
<div>
<h1 style="color:#d32f2f;">15+</h1>
<b>Commits</b><br>
<small>7 development phases</small>
</div>
</div>

---

<!-- _class: lead -->
# 🚀 Try It Yourself

```bash
git clone https://github.com/ThantZ-cloud/Earthquake-Recovery.git
cd earthquake-recovery
npm install
npm run dev          # Frontend :5173
npm run server:dev   # Backend :3001
```

```
📁 earthquake-recovery/
├── .mcp.json          ← MCP: Context7
├── .claude/skills/    ← Skill: Earthquake API
├── .claude/agents/    ← Agent: Code Reviewer
├── slides/pitch.md    ← This presentation (6 slides)
└── report.md          ← Full project report
```

## Questions? 🙏
