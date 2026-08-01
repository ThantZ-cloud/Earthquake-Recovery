import { useState, useMemo, memo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Polygon, Popup, LayersControl, LayerGroup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, CircularProgress, Typography, LinearProgress, useTheme, alpha } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLang } from '../i18n';

const DEFAULT_CENTER = [19.76, 96.08];
const DEFAULT_ZOOM = 5;

// Dam color by risk level
function damColor(color) {
  if (color === '#d32f2f') return '#d32f2f'; // high
  if (color === '#ed6c02') return '#ed6c02'; // medium
  return '#2e7d32'; // low
}

// Triangle vertices for dam markers (points up)
function damTriangle(lat, lng) {
  const s = 0.18; // size in degrees
  return [
    [lat + s, lng],           // top
    [lat - s * 0.6, lng - s], // bottom-left
    [lat - s * 0.6, lng + s], // bottom-right
  ];
}

// Color by magnitude
function magColor(mag) {
  if (mag >= 6) return '#d32f2f';
  if (mag >= 4) return '#ed6c02';
  if (mag >= 2) return '#f9a825';
  return '#2e7d32';
}

// Memoized popup
const QuakePopup = memo(function QuakePopup({ q }) {
  const { t } = useLang();
  return (
    <Box sx={{ lineHeight: 1.6, maxWidth: 220 }}>
      <Typography variant="body2"><strong>{t('map.popup.location')}</strong> {q.place}</Typography>
      <Typography variant="body2"><strong>{t('map.popup.magnitude')}</strong> {q.mag}</Typography>
      <Typography variant="body2"><strong>{t('map.popup.depth')}</strong> {q.depth} km</Typography>
      <Typography variant="body2"><strong>{t('map.popup.time')}</strong> {q.time}</Typography>
    </Box>
  );
});

// Dam popup
const DamPopup = memo(function DamPopup({ dam }) {
  const { t } = useLang();
  const p = dam.properties;
  return (
    <Box sx={{ lineHeight: 1.4, fontSize: { xs: '0.75rem', md: '0.875rem' }, maxWidth: { xs: 180, md: 260 } }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' }, mb: 0.5 }}>
        {p.name}
      </Typography>
      <Typography variant="caption" display="block"><strong>{t('map.damPopup.type')}</strong> {p.dam_type || 'N/A'}</Typography>
      <Typography variant="caption" display="block"><strong>{t('map.damPopup.capacity')}</strong> {p.capacity_mw ? `${p.capacity_mw} MW` : 'N/A'}</Typography>
      <Typography variant="caption" display="block"><strong>{t('map.damPopup.height')}</strong> {p.height_m && p.height_m !== '-' ? `${p.height_m} m` : 'N/A'}</Typography>
      {/* Extra fields hidden on mobile */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="caption" display="block"><strong>{t('map.damPopup.function')}</strong> {p.function || 'N/A'}</Typography>
        <Typography variant="caption" display="block"><strong>{t('map.damPopup.river')}</strong> {p.river || 'N/A'}</Typography>
        <Typography variant="caption" display="block"><strong>{t('map.damPopup.state')}</strong> {p.state || 'N/A'}</Typography>
        <Typography variant="caption" display="block"><strong>{t('map.damPopup.year')}</strong> {p.year || 'N/A'}</Typography>
      </Box>
      <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700, color: p.color, display: 'block' }}>
        {p.risk ? t(`map.damPopup.risk${p.risk[0].toUpperCase()}${p.risk.slice(1)}`) : p.label}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        {p.distanceKm} {t('map.faultDist')}
      </Typography>
    </Box>
  );
});


// Fetcher functions
const EMSC_BASE = 'https://www.seismicportal.eu/fdsnws/event/1/query';

const fetchQuakes = async () => {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    format: 'json',
    minmag: '1',
    limit: '700',
    starttime: start.toISOString(),
    endtime: end.toISOString(),
  });
  const res = await fetch(`${EMSC_BASE}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch earthquake data');
  const data = await res.json();
  const features = data?.features || [];
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

const fetchDams = async () => {
  const res = await fetch('/myanmar_dams.json');
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

// Auto-collapse LayersControl after user selects a layer
function AutoCollapseLayers() {
  const map = useMap();
  useEffect(() => {
    const collapse = () => {
      const control = document.querySelector('.leaflet-control-layers');
      if (control?.classList.contains('leaflet-control-layers-expanded')) {
        control.classList.remove('leaflet-control-layers-expanded');
      }
    };
    map.on('baselayerchange', collapse);
    map.on('overlayadd', collapse);
    map.on('overlayremove', collapse);
    return () => {
      map.off('baselayerchange', collapse);
      map.off('overlayadd', collapse);
      map.off('overlayremove', collapse);
    };
  }, [map]);
  return null;
}

function EarthquakeMap({ height = '84vh' }) {
  const theme = useTheme();
  const { t } = useLang();
  const [mapReady, setMapReady] = useState(false);

  // Canvas renderer for earthquakes
  const canvasRenderer = useMemo(() => L.canvas({ padding: 0.2 }), []);
  const basePathOpts = useMemo(() => ({ fillOpacity: 0.85, color: '#fff', weight: 1.5 }), []);
  const damPathOpts = useMemo(() => ({ fillOpacity: 0.9, color: '#fff', weight: 1.5 }), []);

  const { data: quakes = [], isLoading: quakesLoading, error } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchQuakes,
    refetchInterval: 5 * 1000,
    staleTime: 4 * 1000,
  });

  const { data: plates, isLoading: platesLoading } = useQuery({
    queryKey: ['tectonicPlates'],
    queryFn: fetchPlates,
    staleTime: Infinity,
  });

  const { data: damsData } = useQuery({
    queryKey: ['myanmarDams'],
    queryFn: fetchDams,
    staleTime: Infinity,
  });

  const dams = damsData?.features || [];

  const loading = quakesLoading || !mapReady;

  // Progress steps
  const steps = [
    { label: t('map.tileStep'), done: mapReady },
    { label: t('map.dataStep'), done: !quakesLoading },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const progress = (completedSteps / steps.length) * 100;

  if (error) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', flexDirection: 'column', gap: 1 }}>
        <Typography color="error" fontWeight={600}>
          {t('map.unableToLoad')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%', position: 'relative' }}>
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
            bgcolor: alpha(theme.palette.background.default, 0.95),
            zIndex: 1000,
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" fontWeight={600} color="text.secondary">
            {t('map.loadingData')}
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
          zoomControl={false}
          aria-label="Earthquake map showing recent seismic events near Myanmar, tectonic plate boundaries, and dam locations"
        >
          <MapReadyDetector onReady={() => setMapReady(true)} />
          <AutoCollapseLayers />
          <ZoomControl position="bottomright" />

          <LayersControl position="topright">
          <LayersControl.BaseLayer checked name={t('map.layers.street')}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name={t('map.layers.satellite')}>
            <TileLayer
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name={t('map.layers.topo')}>
            <TileLayer
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name={t('map.layers.plates')} checked>
            <LayerGroup>
              {plates && (
                <GeoJSON data={plates} style={{ color: '#d32f2f', weight: 1.5, opacity: 0.7 }} />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name={t('map.layers.dams')}>
            <LayerGroup>
              {dams.map((dam, i) => (
                <Polygon
                  key={`dam-${i}-${dam.properties?.name || dam.properties?.id || 'unknown'}`}
                  positions={damTriangle(dam.geometry.coordinates[1], dam.geometry.coordinates[0])}
                  pathOptions={{ ...damPathOpts, fillColor: damColor(dam.properties.color) }}
                  renderer={canvasRenderer}
                >
                  <Popup>
                    <DamPopup dam={dam} />
                  </Popup>
                </Polygon>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* All earthquake markers — Canvas-rendered circles */}
        {quakes.map((q) => (
          <CircleMarker
            key={q.id}
            center={[q.lat, q.lon]}
            radius={Math.max(4, Math.min(12, q.mag * 3))}
            pathOptions={{ ...basePathOpts, fillColor: magColor(q.mag) }}
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
