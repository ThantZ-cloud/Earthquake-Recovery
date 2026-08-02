import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip, Skeleton, Alert } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import supabase from '../../lib/supabase';

const RADIUS_KM = 50;

function haversineKm(a, b) {
  const R = 6371;
  const toR = (d) => (d * Math.PI) / 180;
  const dLat = toR(b[0] - a[0]);
  const dLon = toR(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a[0])) * Math.cos(toR(b[0])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const userIcon = L.divIcon({
  html: '<div style="width:12px;height:12px;background:#1976d2;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(25,118,210,0.5)"></div>',
  iconSize: [12, 12],
  className: '',
});

export default function AdminMonitoring() {
  const { data: locations = [], isLoading: locsLoading } = useQuery({
    queryKey: ['admin-locations'],
    queryFn: async () => {
      const { data } = await supabase.from('locations').select('id, user_id, latitude, longitude, label, created_at');
      return data || [];
    },
  });

  const { data: earthquakes = [] } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: async () => {
      const res = await fetch('https://www.seismicportal.eu/fdsnws/event/1/query?format=json&minmag=3&limit=50&orderby=time');
      const j = await res.json();
      return (j.features || []).map((f) => ({
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        mag: f.properties.mag,
        place: f.properties.flynn_region,
      }));
    },
    refetchInterval: 60_000,
  });

  const nearEpicenter = locations.filter((loc) =>
    earthquakes.some((eq) => haversineKm([loc.latitude, loc.longitude], [eq.lat, eq.lon]) < RADIUS_KM)
  );

  if (locsLoading) return <Skeleton variant="rounded" height={400} />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Monitoring</Typography>

      {nearEpicenter.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          {nearEpicenter.length} user location(s) within {RADIUS_KM} km of a recent M3+ epicenter.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, flex: 2, minHeight: 400 }}>
          <MapContainer center={[19.7633, 96.0785]} zoom={6} style={{ height: 400, borderRadius: 12 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={userIcon}>
                <Popup>{loc.label || 'Unnamed location'}<br />User: {loc.user_id.slice(0, 8)}…</Popup>
              </Marker>
            ))}
            {earthquakes.map((eq, i) => (
              <CircleMarker key={i} center={[eq.lat, eq.lon]} radius={Math.max(4, eq.mag * 2)} pathOptions={{ color: '#d32f2f', fillColor: '#ef5350', fillOpacity: 0.6 }}>
                <Popup>M{eq.mag} — {eq.place}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, flex: 1, maxHeight: 420, overflow: 'auto' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Saved Locations ({locations.length})</Typography>
            {locations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No users have saved locations yet.</Typography>
            ) : (
              <List dense disablePadding>
                {locations.map((loc) => (
                  <ListItem key={loc.id} sx={{ py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <ListItemText
                      primary={loc.label || 'Unnamed'}
                      secondary={`${loc.latitude.toFixed(3)}, ${loc.longitude.toFixed(3)} — ${loc.user_id.slice(0, 8)}…`}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
