import { useState, useMemo, memo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, CircularProgress, Typography, LinearProgress, useTheme } from '@mui/material';
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


// Memoized popup
const QuakePopup = memo(function QuakePopup({ q }) {
  return (
    <Box sx={{ lineHeight: 1.6 }}>
      <Typography variant="subtitle2" fontWeight={700}>{q.place}</Typography>
      <Typography variant="body2"><strong>Magnitude:</strong> {q.mag}</Typography>
      <Typography variant="body2"><strong>Depth:</strong> {q.depth} km</Typography>
      <Typography variant="body2"><strong>Time:</strong> {q.time}</Typography>
    </Box>
  );
});


// Fetcher functions
const fetchQuakes = async () => {
  const { data } = await api.get('/api/recent');
  const features = data?.data?.features || [];
  return features
    .map((f, i) => {
      const [lon, lat, depth] = f.geometry?.coordinates || [];
      const mag = f.properties?.mag;
      if (!lon || !lat || mag == null) return null;
      return {
        id: `${f.properties?.event_id || f.properties?.source_id || 'eq'}-${i}`,
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

const fetchPlates = async () => {
  const res = await fetch('/tectonicplates.json');
  return res.json();
};

// Detect when Leaflet map tiles are loaded
function MapReadyDetector({ onReady }) {
  const map = useMap();
  useEffect(() => {
    map.whenReady(() => {
      setTimeout(() => onReady(), 500);
    });
  }, [map, onReady]);
  return null;
}

function EarthquakeMap({ height = '70vh' }) {
  const theme = useTheme();
  const [mapReady, setMapReady] = useState(false);

  // Canvas renderer for tectonic plates — draws on a single canvas instead of SVG paths
  const canvasRenderer = useMemo(() => L.canvas({ padding: 0.2 }), []);

  const { data: quakes = [], isLoading: quakesLoading, error } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchQuakes,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000, // data fresh for 4 min, skip refetch on remount
  });

  const { data: plates, isLoading: platesLoading } = useQuery({
    queryKey: ['tectonicPlates'],
    queryFn: fetchPlates,
    staleTime: Infinity,
  });

  const loading = quakesLoading || !mapReady;

  // Progress steps
  const steps = [
    { label: 'Map tiles', done: mapReady },
    { label: 'Earthquake data', done: !quakesLoading },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const progress = (completedSteps / steps.length) * 100;

  if (error) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 4, flexDirection: 'column', gap: 1 }}>
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
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(245, 245, 245, 0.95)',
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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
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

          <LayersControl.Overlay name="Tectonic Plates" checked>
            <LayerGroup>
              {plates && (
                <GeoJSON data={plates} style={{ color: '#d32f2f', weight: 1.5, opacity: 0.7 }} />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>

        {/* All earthquake markers — Canvas-rendered circles */}
        {quakes.map((q) => (
          <CircleMarker
            key={q.id}
            center={[q.lat, q.lon]}
            radius={Math.max(4, Math.min(12, q.mag * 3))}
            pathOptions={{
              fillColor: magColor(q.mag),
              fillOpacity: 0.85,
              color: '#fff',
              weight: 1.5,
            }}
            renderer={canvasRenderer}
          >
            <Popup>
              <QuakePopup q={q} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </Box>
  );
}

export default EarthquakeMap;
