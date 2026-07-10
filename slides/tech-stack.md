---
marp: true
paginate: true
transition: fade
---

<!-- slide 1 -->
# 🛠️ Tech Stack & AI Workflow
**Earthquake & Recovery — How It Was Built**
<!-- 20s -->

---

<!-- slide 2 -->
# The Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| UI | MUI 7 (Material UI) |
| Map | Leaflet + react-leaflet |
| Auth | Supabase (free tier) |
| Data | EMSC Seismic Portal API |
| Spatial | Turf.js (distance + risk) |
| Animation | Framer Motion |
| Routing | React Router v7 |
| State | @tanstack/react-query |
| i18n | Custom JSON (English + Myanmar) |

---

<!-- slide 3 -->
# AI Agents

**Earthquake Code Reviewer**
`.claude/agents/earthquake-reviewer.md`

Reviews code for:
- react-leaflet patterns (stable keys, cleanup)
- MUI accessibility (WCAG AA, aria labels)
- API error handling (try/catch, fallback UI)
- State management (useMemo, useCallback)
- General React quality (composition, keys)

Trigger: `/agents earthquake-reviewer`
Or: "review the map component for bugs"

---

<!-- slide 4 -->
# AI Skills

**Earthquake API Skill**
`.claude/skills/earthquake-api/SKILL.md`

Documents:
- EMSC API endpoint & query params
- GeoJSON response schema
- Map rendering pipeline (CircleMarker → Canvas)
- Dam risk classification (Turf.js)
- Performance notes (Canvas vs SVG)
- How to add new data layers

Trigger: `/skills earthquake-api`
Or: "how does the earthquake data fetch work?"

---

<!-- slide 5 -->
# Methodology

**Pair Programming with Claude Code**

1. **Plan** — I describe what I want, Claude explores codebase
2. **Build** — Claude writes code, I review and test
3. **Iterate** — Bug reports → fixes → re-test
4. **Automate** — Repeated tasks → workflows

Claude Code handles:
- Reading existing code before writing (never overwrites blindly)
- Following project conventions (MUI sx prop, framer-motion, etc.)
- Running builds to verify changes work
- Creating files in the right directory structure

---

<!-- slide 6 -->
# Workflows (Automation)

Two multi-agent workflows in `.claude/workflows/`:

**audit-nav-routes.js**
- Spawns 6 parallel agents (one per route)
- Each agent finds bugs, perf issues, code smells
- Adversarial verification filters false positives
- Produces a prioritized issue report

**translate-donate-quiz-history.js**
- 3-phase pipeline: Donate → Quiz → History
- Each phase: read page → find hardcoded text → add i18n keys → update component
- Parallel-safe (each phase writes to different files)

---

<!-- slide 7 -->
# Commands

```bash
# Install
cd app && npm install

# Dev server (port 5173)
cd app && npm run dev

# Production build
cd app && npm run build

# Deploy (auto on push to main)
git push origin main    # → Netlify/Vercel
```

Claude Code commands:
```bash
# Run a skill
/earthquake-api

# Run a workflow
/audit-nav-routes
/translate-donate-quiz-history

# Use the code reviewer agent
"review this component for accessibility issues"
```

---

<!-- slide 8 -->
# AI Tools Used

| Tool | Purpose |
|------|---------|
| **Claude Code** | Primary AI pair programmer (CLI) |
| **Claude Opus** | Model powering Claude Code |
| **Context7 MCP** | Live library documentation lookup |
| **Chrome DevTools MCP** | Browser testing & debugging |
| **Claude Code Skills** | Reusable domain knowledge |
| **Claude Code Agents** | Specialized subagents (code review) |
| **Claude Code Workflows** | Multi-agent automation pipelines |

---

<!-- slide 9 -->
# Key Decisions

- **EMSC over USGS** — better global coverage, no CORS issues
- **Canvas renderer** — CircleMarker handles 700+ quakes smoothly
- **Turf.js for risk** — spatial analysis without a backend
- **Supabase** — real auth without building a server
- **No backend** — all data fetched client-side (EMSC, Supabase)
- **i18n from day one** — English + Myanmar from the start

---

<!-- slide 10 -->
# What's Next

- [ ] Push notification support (PWA)
- [ ] Historical data comparison charts
- [ ] More Myanmar cities in emergency phones
- [ ] Offline mode with service worker
- [ ] Community-sourced dam data updates

---

<!-- slide 11 -->
# ✅ Summary

- **React 19 + MUI 7** — modern, accessible UI
- **EMSC API** — live earthquake data, no backend
- **Turf.js** — spatial risk analysis for Myanmar dams
- **Claude Code** — AI pair programmer throughout
- **Skills + Agents + Workflows** — reusable AI tooling
- **Deployed** — live on Netlify/Vercel

Built by Thant Zin Htun with Claude Code.
