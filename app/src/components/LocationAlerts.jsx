import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Snackbar, Alert, Box, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import EditIcon from '@mui/icons-material/Edit';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import supabase from '../lib/supabase';

// Haversine distance in km
function haversineKm(a, b) {
  const R = 6371;
  const toR = (deg) => (deg * Math.PI) / 180;
  const dLat = toR(b[0] - a[0]);
  const dLon = toR(b[1] - a[1]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toR(a[0])) * Math.cos(toR(b[0])) * sinDLon * sinDLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const RADIUS_KM = 50;
const POLL_MS = 5_000;

// Emergency siren — returns a stop function
function startSiren() {
  try {
    const audio = new Audio('/assets/alert-sound.mp3');
    audio.loop = true;
    audio.volume = 1;
    audio.play();
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  } catch {
    return () => {};
  }
}

export default function LocationAlerts({ enabled }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [alertQuake, setAlertQuake] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [watching, setWatching] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const stopSirenRef = useRef(null);
  const watchIdRef = useRef(null);

  // Saved location state
  const [savedLocation, setSavedLocation] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLon, setEditLon] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch saved location from Supabase
  useEffect(() => {
    if (!user) return;

    supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setSavedLocation(data);
        }
      })
      .catch(() => {});
  }, [user]);

  // Request notification permission
  useEffect(() => {
    if (!enabled) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enabled]);

  // Request geolocation
  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setWatching(true);
        setLocationError('');
      },
      (err) => {
        setLocationError('Please allow location access to receive alerts.');
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setWatching(false);
    };
  }, [enabled]);

  // Save location to Supabase
  const saveLocation = useCallback(
    async (lat, lon, label) => {
      if (!user) return;
      setSaving(true);

      if (savedLocation) {
        // Update existing
        const { data } = await supabase
          .from('locations')
          .update({ latitude: lat, longitude: lon, label })
          .eq('id', savedLocation.id)
          .select()
          .single();
        setSavedLocation(data);
      } else {
        // Insert new
        const { data } = await supabase
          .from('locations')
          .insert({ user_id: user.id, latitude: lat, longitude: lon, label })
          .select()
          .single();
        setSavedLocation(data);
      }
      setSaving(false);
      setEditOpen(false);
    },
    [user, savedLocation]
  );

  // Open edit dialog
  const handleEdit = useCallback(() => {
    const loc = savedLocation || { latitude: userPos?.[0] || '', longitude: userPos?.[1] || '', label: '' };
    setEditLabel(loc.label || '');
    setEditLat(String(loc.latitude || ''));
    setEditLon(String(loc.longitude || ''));
    setEditOpen(true);
  }, [savedLocation, userPos]);

  // Read earthquake data from react-query cache
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const checkQuakes = () => {
      // Use saved location if available, otherwise use GPS
      const pos = savedLocation
        ? [savedLocation.latitude, savedLocation.longitude]
        : userPos;
      if (!pos) return;

      const quakes = queryClient.getQueryData(['earthquakes']) || [];
      for (const q of quakes) {
        if (!q.lat || !q.lon || !q.mag || q.mag < 3) continue;
        const dist = haversineKm(pos, [q.lat, q.lon]);
        if (dist <= RADIUS_KM) {
          setAlertQuake({ place: q.place, mag: q.mag, dist: dist.toFixed(1) });
          setSnackOpen(true);

          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ Earthquake Alert', {
              body: `M${q.mag} earthquake detected ${dist.toFixed(1)} km away — ${q.place}`,
              icon: '/assets/logo.png',
              tag: 'earthquake-alert',
            });
          }

          if (!stopSirenRef.current) {
            stopSirenRef.current = startSiren();
            setSirenActive(true);
          }
          return;
        }
      }
    };

    checkQuakes();
    const interval = setInterval(checkQuakes, POLL_MS);
    return () => clearInterval(interval);
  }, [enabled, userPos, savedLocation, queryClient]);

  // Stop siren and close alert
  const handleStopSiren = useCallback(() => {
    if (stopSirenRef.current) {
      stopSirenRef.current();
      stopSirenRef.current = null;
      setSirenActive(false);
    }
    setSnackOpen(false);
  }, []);

  // Demo alert handler
  const handleDemo = useCallback(() => {
    handleStopSiren();
    setAlertQuake({ place: 'MANDALAY, MYANMAR', mag: 5.2, dist: '12.3' });
    setSnackOpen(true);
    stopSirenRef.current = startSiren();
    setSirenActive(true);
  }, [handleStopSiren]);

  // Get active location name
  const locationLabel = savedLocation?.label || (userPos ? 'Current location' : 'No location set');

  return (
    <>
      {/* Location info + actions */}
      <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<NotificationsActiveIcon />}
          onClick={handleDemo}
          color="warning"
          sx={{ fontWeight: 600, height: 32 }}
        >
          Test Alert
        </Button>
        {enabled && (watching || savedLocation) && (
          <Chip
            label={`📍 ${locationLabel} — M3+ alerts within ${RADIUS_KM} km`}
            size="small"
            sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 600, height: 32 }}
          />
        )}
        {enabled && user && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ color: '#fff', textTransform: 'none', height: 32 }}
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Location error */}
      {locationError && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Chip label={locationError} color="warning" variant="outlined" size="small" />
        </Box>
      )}

      {/* Educational disclaimer */}
      <Alert severity="info" sx={{ mt: 2, fontSize: '0.85rem' }}>
        {t('alerts.disclaimer')}
      </Alert>

      {/* Edit location dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{savedLocation ? 'Edit Location' : 'Save Location'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {savedLocation ? 'Update your monitoring location.' : 'Save your current location for earthquake alerts.'}
          </Typography>
          <TextField
            label="Label (e.g. Home, Office)"
            fullWidth
            size="small"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Latitude"
            fullWidth
            size="small"
            value={editLat}
            onChange={(e) => setEditLat(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Longitude"
            fullWidth
            size="small"
            value={editLon}
            onChange={(e) => setEditLon(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => saveLocation(parseFloat(editLat), parseFloat(editLon), editLabel)}
            disabled={saving || !editLat || !editLon}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert snackbar */}
      <Snackbar
        open={snackOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ fontSize: '0.95rem', alignItems: 'center' }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<VolumeOffIcon />}
              onClick={handleStopSiren}
              sx={{ fontWeight: 700 }}
            >
              Stop Sound
            </Button>
          }
        >
          ⚠️ <strong>M{alertQuake?.mag}</strong> earthquake detected{' '}
          <strong>{alertQuake?.dist} km</strong> away — {alertQuake?.place}
        </Alert>
      </Snackbar>
    </>
  );
}
