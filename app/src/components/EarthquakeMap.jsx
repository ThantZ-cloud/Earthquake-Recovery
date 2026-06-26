import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const DEFAULT_CENTER = [20, 0];
const DEFAULT_ZOOM = 2;

// Color by magnitude
function magColor(mag) {
  if (mag >= 6) return '#d32f2f';
  if (mag >= 4) return '#ed6c02';
  if (mag >= 2) return '#f9a825';
  return '#2e7d32';
}

// SVG divIcon for each quake
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


// Fetcher functions
const fetchQuakes = async () => {
  const { data } = await api.get('/api/recent');
  const features = data?.data?.features || [];
  return features
    .map((f) => {
      const [lon, lat, depth] = f.geometry?.coordinates || [];
      const mag = f.properties?.mag;
      if (!lon || !lat || mag == null) return null;
      return {
        id: f.properties?.event_id || f.properties?.source_id || Math.random(),
        lat,
        lon,
        depth: depth?.toFixed(1) || '?',
        mag,
        place: f.properties?.flynn_region || f.properties?.place || 'Unknown',
        time: new Date(f.properties?.time).toLocaleString(),
        source: f.properties?.source_catalog || 'EMSC',
      };
    })
    .filter(Boolean);
};

// Fetch EMSC earthquake data directly (better Asia/Europe coverage)
const fetchEMSC = async () => {
  const { data } = await api.get(
    'https://www.seismicportal.eu/fdsnws/event/1/query',
    {
      params: {
        format: 'json',
        minmag: 2,
        limit: 200,
        starttime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    }
  );
  const features = data?.features || [];
  return features
    .map((f) => {
      const [lon, lat, depth] = f.geometry?.coordinates || [];
      const mag = f.properties?.mag;
      if (!lon || !lat || mag == null) return null;
      return {
        id: f.properties?.source_id || f.id || Math.random(),
        lat,
        lon,
        depth: depth?.toFixed(1) || '?',
        mag,
        place: f.properties?.flynn_region || 'Unknown',
        time: new Date(f.properties?.time).toLocaleString(),
        source: 'EMSC',
      };
    })
    .filter(Boolean);
};

const fetchPlates = async () => {
  const { data } = await api.get(
    'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'
  );
  return data;
};

// Detect when Leaflet map tiles are loaded
function MapReadyDetector({ onReady }) {
  const map = useMap();
  map.whenReady(() => {
    // Small delay so tiles have time to render
    setTimeout(() => onReady(), 500);
  });
  return null;
}

export default function EarthquakeMap({ height = '70vh' }) {
  const [mapReady, setMapReady] = useState(false);

  const { data: quakes = [], isLoading: quakesLoading, error } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchQuakes,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: emscQuakes = [], isLoading: emscLoading } = useQuery({
    queryKey: ['emscEarthquakes'],
    queryFn: fetchEMSC,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: plates, isLoading: platesLoading } = useQuery({
    queryKey: ['tectonicPlates'],
    queryFn: fetchPlates,
    staleTime: Infinity,
  });

  const loading = quakesLoading || emscLoading || !mapReady;

  // Progress steps
  const steps = [
    { label: 'Map tiles', done: mapReady },
    { label: 'USGS / EMSC data', done: !quakesLoading },
    { label: 'EMSC (24h, M2+)', done: !emscLoading },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const progress = (completedSteps / steps.length) * 100;

  if (error) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 4, flexDirection: 'column', gap: 1 }}>
        <Typography color="error" fontWeight={600}>
          Unable to load earthquake data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: 4, position: 'relative' }}>
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(245, 245, 245, 0.95)',
            zIndex: 1000,
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" fontWeight={600} color="text.secondary">
            Loading map data...
          </Typography>

          {/* Progress bar */}
          <Box sx={{ width: '60%', mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {/* Step checklist */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
            {steps.map((step) => (
              <Typography
                key={step.label}
                variant="body2"
                sx={{ color: step.done ? 'success.main' : 'text.secondary', fontWeight: step.done ? 600 : 400 }}
              >
                {step.done ? '✓' : '○'} {step.label}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <MapReadyDetector onReady={() => setMapReady(true)} />

        <LayersControl position="topright" collapsed={false}>
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

          <LayersControl.Overlay name="Tectonic Plates">
            <LayerGroup>
              {plates && (
                <GeoJSON data={plates} style={{ color: '#d32f2f', weight: 1.5, opacity: 0.7 }} />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>

        {/* All earthquake markers (USGS proxy + EMSC direct) */}
        {[...quakes, ...emscQuakes].map((q) => (
          <Marker key={q.id} position={[q.lat, q.lon]} icon={quakeIcon(q.mag)}>
            <Popup>
              <Box sx={{ fontFamily: 'Poppins,sans-serif', lineHeight: 1.6 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {q.place}
                </Typography>
                <Typography variant="body2"><strong>Magnitude:</strong> {q.mag}</Typography>
                <Typography variant="body2"><strong>Depth:</strong> {q.depth} km</Typography>
                <Typography variant="body2"><strong>Time:</strong> {q.time}</Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
