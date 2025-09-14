const map = L.map('map').setView([20, 0], 2);

// Use classic OpenStreetMap street map tiles
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 100,
  attribution: '&copy; OpenStreetMap contributors'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 100,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
});

const street = L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=k11DiHj8yLWyTZjcLGBl', {
  maxZoom: 100,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
});

const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 100,
  attribution: '&copy; OpenStreetMap contributors, &copy; OpenTopoMap'
});

const winter = L.tileLayer('https://api.maptiler.com/maps/winter-v2/{z}/{x}/{y}.png?key=k11DiHj8yLWyTZjcLGBl', {
  maxZoom: 100,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
});

const basic = L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=k11DiHj8yLWyTZjcLGBl', {
  maxZoom: 100,
  attribution: '&copy; OpenStreetMap contributors, &copy; Wikimedia Foundation'
});

// Helper: log tile load errors to console for diagnostics
function attachTileErrorLogging(layer, name) {
  layer.on('tileerror', function (e) {
    console.warn('Tile load error for layer:', name, 'URL:', e && e.tile && e.tile.src);
  });
}

// (Removed other providers to keep only MapTiler base layers)

// Add default base layer
osm.addTo(map);

// Layer control with only requested layers
L.control.layers({
  'OpenStreetMap': osm,
  'Satellite': satellite,
  'Streets': street,
  'Topo': topo,
  'Winter': winter,
  'Basic': basic
}, null, { collapsed: false }).addTo(map);

[
  ['OpenStreetMap', osm],
  ['Satellite', satellite],
  ['Streets', street],
  ['Topo', topo],
  ['Winter', winter],
  ['Basic', basic]
].forEach(([name, layer]) => attachTileErrorLogging(layer, name));

// // Add faults line ONCE (lighter color)
// fetch('https://raw.githubusercontent.com/GEMScienceTools/gem-global-active-faults/master/geojson/global_active_faults.geojson')
//   .then(r => r.json())
//   .then(gfaults => L.geoJSON(gfaults, {
//     style: { color: 'magenta', weight: 1 }
//   }).addTo(map));

// Add tectonic plate boundaries ONCE
fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
  .then(r => r.json())
  .then(plates => L.geoJSON(plates, {
    style: { color: 'red', weight: 2 }
  }).addTo(map));

// Fetching Earthquake Data from usgs api
const pastHourEarthquake = () => {
  fetch( "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson"
)
  .then(res => res.json())
  .then(data => {
    data.features.forEach(eq => { 
      const coords = eq.geometry.coordinates;
      const mag = eq.properties.mag;
      if (!coords || coords.length < 2 || mag === null) return; // Skip invalid data

      const [lon, lat, depth] = coords;
      const place = eq.properties.place;
      const time = new Date(eq.properties.time).toLocaleString();

      let color = mag > 5 ? '#e74c3c' : mag > 3 ? '#f39c12' : '#27ae60';

      const svgIcon = L.divIcon({
        className: '',
        html: `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="10" fill="${color}" stroke="#222" stroke-width="2"/>
            <text x="16" y="21" text-anchor="middle" font-size="12" fill="#fff" font-family="Arial" font-weight="bold">${mag.toFixed(1)}</text>
          </svg>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lon], { icon: svgIcon })
        .addTo(map)
        .bindPopup(`<strong>${place}</strong><br>
                    Magnitude: ${mag}<br>
                    Depth: ${depth} km<br>
                    Time: ${time}`);
    });
  });
}

pastHourEarthquake();

const mag4 = () => {
  fetch( "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
)
  .then(res => res.json())
  .then(data => {
    data.features.forEach(eq => { 
      const coords = eq.geometry.coordinates;
      const mag = eq.properties.mag;
      if (!coords || coords.length < 2 || mag === null) return; // Skip invalid data

      const [lon, lat, depth] = coords;
      const place = eq.properties.place;
      const time = new Date(eq.properties.time).toLocaleString();

      let color = mag > 5 ? '#e74c3c' : mag > 3 ? '#f39c12' : '#27ae60';

      const svgIcon = L.divIcon({
        className: '',
        html: `
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="10" fill="${color}" stroke="#222" stroke-width="2"/>
            <text x="16" y="21" text-anchor="middle" font-size="12" fill="#fff" font-family="Arial" font-weight="bold">${mag.toFixed(1)}</text>
          </svg>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lon], { icon: svgIcon })
        .addTo(map)
        .bindPopup(`<strong>${place}</strong><br>
                    Magnitude: ${mag}<br>
                    Depth: ${depth} km<br>
                    Time: ${time}`);
    });
  });
}

mag4();