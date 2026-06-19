# Earthquake API Skill

## USGS Earthquake Data

This project fetches live earthquake data from the USGS (United States Geological Survey) API.

### API Endpoints

| Feed | URL | Update Frequency |
|------|-----|-----------------|
| Past hour (all) | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson` | Every minute |
| Past hour (M1.0+) | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson` | Every minute |
| Past day (M4.5+) | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson` | Every minute |
| Past month (M4.5+) | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson` | Every 5 minutes |

### GeoJSON Schema

Each quake feature has:
```json
{
  "id": "us7000XXXX",
  "geometry": {
    "coordinates": [longitude, latitude, depth_km]
  },
  "properties": {
    "mag": 4.5,
    "place": "123 km SW of City, Country",
    "time": 1718700000000,
    "type": "earthquake",
    "title": "M 4.5 - 123 km SW of City, Country"
  }
}
```

### How the Map Renders Data

1. `EarthquakeMap.jsx` fetches USGS data on mount
2. Each quake becomes a Leaflet `Marker` with a custom SVG `divIcon`
3. The SVG circle color depends on magnitude:
   - Green: < M2
   - Yellow: M2-M4
   - Orange: M4-M6
   - Red: M6+
4. Clicking a marker shows a popup with place, magnitude, depth, and time
5. Tectonic plate boundaries are loaded from the Fraxen plates GeoJSON

### Adding a New Data Layer

To add a new overlay (e.g., faults, seismic stations):
1. Find a GeoJSON feed URL
2. Add a `fetch()` call in `EarthquakeMap.jsx`
3. Use `<GeoJSON data={data} />` inside the `<LayersControl>` component
4. Give it a descriptive name in `<LayersControl.Overlay>`

### Local Backend Proxy

The Express backend at `/api/recent` proxies the USGS API with 5-minute caching. This avoids client-side CORS issues and reduces load on USGS.
