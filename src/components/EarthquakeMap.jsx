import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Box, CircularProgress, Typography } from '@mui/material';

const DEFAULT_CENTER = [20, 0];
const DEFAULT_ZOOM = 2;

// Color by magnitude
function magColor(mag) {
  if (mag >= 6) return '#d32f2f';
  if (mag >= 4) return '#ed6c02';
  if (mag >= 2) return '#f9a825';
  return '#2e7d32';
}

// Create SVG divIcon for each quake
function quakeIcon(mag) {
  const fill = magColor(mag);
  const size = Math.max(24, Math.min(48, mag * 8));
  const fontSize = Math.max(9, Math.min(14, size * 0.4));

  return L.divIcon({
    className: '',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="11" fill="${fill}" stroke="#fff" stroke-width="2" opacity="0.9"/>
      <text x="16" y="20" text-anchor="middle" font-size="${fontSize}" fill="#fff" font-family="Poppins,sans-serif" font-weight="700">${mag.toFixed(1)}</text>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function EarthquakeMap({ height = '70vh' }) {
  const [quakes, setQuakes] = useState([]);
  const [plates, setPlates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both USGS quakes and tectonic plates in parallel
        const [quakeRes, plateRes] = await Promise.all([
          fetch(' https://www.seismicportal.eu/fdsnws/event/1/query?format=json&minmag=2&limit=100'),
          fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'),
        ]);

        if (!quakeRes.ok) throw new Error('Failed to load earthquake data');
        const quakeData = await quakeRes.json();

        const parsed = (quakeData.features || [])
          .map((f) => {
            const [lon, lat, depth] = f.geometry?.coordinates || [];
            const mag = f.properties?.mag;
            if (!lon || !lat || mag == null) return null;
            return {
              id: f.id,
              lat,
              lon,
              depth: depth?.toFixed(1),
              mag,
              place: f.properties.place,
              time: new Date(f.properties.time).toLocaleString(),
            };
          })
          .filter(Boolean);

        setQuakes(parsed);

        if (plateRes.ok) {
          const plateData = await plateRes.json();
          setPlates(plateData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 4,
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 4,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography color="error" fontWeight={600}>
          Unable to load earthquake data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 4,
      }}
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <LayersControl position="topright" collapsed={false}>
          {/* Base layers */}
          <LayersControl.BaseLayer checked name="Street">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Topographic">
            <TileLayer
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>

          {/* Tectonic plates overlay */}
          {plates && (
            <LayersControl.Overlay checked name="Tectonic Plates">
              <GeoJSON
                data={plates}
                style={{ color: '#d32f2f', weight: 1.5, opacity: 0.7 }}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Earthquake markers */}
        {quakes.map((q) => (
          <Marker
            key={q.id}
            position={[q.lat, q.lon]}
            icon={quakeIcon(q.mag)}
          >
            <Popup>
              <Box sx={{ fontFamily: 'Poppins,sans-serif', lineHeight: 1.6 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {q.place}
                </Typography>
                <Typography variant="body2">
                  <strong>Magnitude:</strong> {q.mag}
                </Typography>
                <Typography variant="body2">
                  <strong>Depth:</strong> {q.depth} km
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {q.time}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
