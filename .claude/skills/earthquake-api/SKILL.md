# Earthquake API Skill

## EMSC Earthquake Data

This project fetches live earthquake data from the **EMSC (Euro-Mediterranean Seismological Centre)** seismic portal — no backend proxy needed.

### API Endpoint

```
https://www.seismicportal.eu/fdsnws/event/1/query
```

### Query Parameters

| Param | Value | Description |
|-------|-------|-------------|
| `format` | `json` | Returns GeoJSON |
| `minmag` | `1` | Minimum magnitude |
| `minlat` / `maxlat` | `-90` / `90` | Global coverage |
| `minlon` / `maxlon` | `-180` / `180` | Global coverage |
| `limit` | `700` | Max events returned |
| `orderby` | `time` | Most recent first |

### Time Window

The app requests the **last 7 days** of data using `starttime` calculated as:
```js
const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
```

### GeoJSON Response Schema

Each earthquake feature:
```json
{
  "id": "20240615_00000XX",
  "geometry": {
    "coordinates": [longitude, latitude, depth_km]
  },
  "properties": {
    "mag": 4.5,
    "place": "123 km SW of City, Country",
    "time": 1718700000000,
    "flynn_region": "MYANMAR",
    "lastupdate": "2024-06-15T00:00:00Z"
  }
}
```

### How the Map Renders Data

1. `EarthquakeMap.jsx` fetches EMSC data on mount via `@tanstack/react-query`
2. Data refreshes every **5 seconds** (refetchInterval)
3. Each quake becomes a Leaflet `CircleMarker` on `L.canvas()` renderer (fast for 700+ markers)
4. Circle color depends on magnitude:
   - 🟢 Green: < M2
   - 🟡 Yellow: M2–M4
   - 🟠 Orange: M4–M6
   - 🔴 Red: M6+
5. Clicking a marker shows a popup with place, magnitude, depth, and time
6. Tectonic plate boundaries loaded from `public/tectonicplates.json`
7. Myanmar dams loaded from `public/myanmar_dams.geojson` with risk classification via Turf.js

### Adding a New Data Layer

To add a new overlay (e.g., faults, seismic stations):
1. Find a GeoJSON feed URL
2. Add a `fetch()` call in `EarthquakeMap.jsx`
3. Use `<GeoJSON data={data} />` inside `<LayersControl>`
4. Give it a descriptive name in `<LayersControl.Overlay>`

### Performance Notes

- Use `CircleMarker` (not `Marker`) for hundreds of earthquake points — Canvas renderer is fast
- Don't use `L.divIcon` with SVG/IMG for hundreds of markers — too many DOM nodes
- Don't use `L.canvas()` renderer on GeoJSON layers — it doesn't render SVG paths
- Dam classification uses `requestAnimationFrame` to avoid blocking render
- Bounding box pre-filter skips far-away plate boundaries (Turf.js optimization)
