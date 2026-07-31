import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Snackbar, Alert, Box, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
const SIREN_MAX_MS = 60_000;

// Siren audio — lightweight instance
function createSiren() {
  const audio = new Audio('/assets/alert-sound.mp3');
  audio.loop = true;
  audio.volume = 1;
  audio.preload = 'auto';
  return audio;
}

let sirenAudio = null;

function getSiren() {
  if (!sirenAudio) sirenAudio = createSiren();
  return sirenAudio;
}

// Play siren, return stop function. Returns null if blocked.
function startSiren() {
  const audio = getSiren();
  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => null);
    }
    // Auto-stop after max duration
    const timer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, SIREN_MAX_MS);
    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  } catch {
    return null;
  }
}

// Unlock audio with a silent play (requires user gesture)
function unlockAudio() {
  const audio = getSiren();
  audio.volume = 0;
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
  }).catch(() => {
    audio.volume = 1;
  });
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
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const stopSirenRef = useRef(null);
  const watchIdRef = useRef(null);
  const alertedIdsRef = useRef(new Set());
  const sirenStoppedByUserRef = useRef(false);

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
      .then(({ data, error }) => {
        if (!error && data) {
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

      try {
        if (savedLocation) {
          const { data, error } = await supabase
            .from('locations')
            .update({ latitude: lat, longitude: lon, label })
            .eq('id', savedLocation.id)
            .select()
            .single();
          if (!error) setSavedLocation(data);
        } else {
          const { data, error } = await supabase
            .from('locations')
            .insert({ user_id: user.id, latitude: lat, longitude: lon, label })
            .select()
            .single();
          if (!error) setSavedLocation(data);
        }
      } catch (err) {
        console.warn('Save location failed:', err.message);
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
      const pos = savedLocation
        ? [savedLocation.latitude, savedLocation.longitude]
        : userPos;
      if (!pos) return;

      const quakes = queryClient.getQueryData(['earthquakes']) || [];
      for (const q of quakes) {
        if (!q.lat || !q.lon || !q.mag || q.mag < 3) continue;
        if (alertedIdsRef.current.has(q.id)) continue;

        const dist = haversineKm(pos, [q.lat, q.lon]);
        if (dist <= RADIUS_KM) {
          // New earthquake — reset user-stop flag so siren can play
          sirenStoppedByUserRef.current = false;
          alertedIdsRef.current.add(q.id);
          setAlertQuake({ place: q.place, mag: q.mag, dist: dist.toFixed(1) });
          setSnackOpen(true);

          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const n = new Notification('⚠️ Earthquake Alert', {
              body: `M${q.mag} earthquake detected ${dist.toFixed(1)} km away — ${q.place}`,
              icon: '/assets/logo.png',
              tag: 'earthquake-alert',
            });
            n.onclick = () => {
              window.focus();
              n.close();
            };
          }

          // Vibrate on mobile
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }

          // Only start siren if user hasn't stopped it and sound is unlocked
          if (!stopSirenRef.current && !sirenStoppedByUserRef.current && soundUnlocked) {
            stopSirenRef.current = startSiren();
            setSirenActive(!!stopSirenRef.current);
          }
          return;
        }
      }
    };

    checkQuakes();
    const interval = setInterval(checkQuakes, POLL_MS);
    return () => clearInterval(interval);
  }, [enabled, userPos, savedLocation, queryClient, soundUnlocked]);

  // Stop siren and close alert
  const handleStopSiren = useCallback(() => {
    sirenStoppedByUserRef.current = true;
    if (stopSirenRef.current) {
      stopSirenRef.current();
      stopSirenRef.current = null;
      setSirenActive(false);
    }
    setSnackOpen(false);
  }, []);

  // Unlock sound on user gesture
  const handleEnableSound = useCallback(() => {
    unlockAudio();
    setSoundUnlocked(true);
  }, []);

  // Demo alert handler
  const handleDemo = useCallback(() => {
    handleStopSiren();
    setAlertQuake({ place: 'MANDALAY, MYANMAR', mag: 5.2, dist: '12.3' });
    setSnackOpen(true);

    // Vibrate on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    const stop = startSiren();
    if (stop) {
      stopSirenRef.current = stop;
      setSirenActive(true);
    }
  }, [handleStopSiren]);

  // Get active location name
  const locationLabel = savedLocation?.label || (userPos ? 'Current location' : 'No location set');

  return (
    <>
      {/* Sound unlock + location info */}
      <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {!soundUnlocked ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<VolumeUpIcon />}
            onClick={handleEnableSound}
            color="success"
            sx={{ fontWeight: 600, height: 32 }}
          >
            Enable Sound
          </Button>
        ) : (
          <Chip
            icon={<CheckCircleIcon />}
            label="Sound enabled"
            size="small"
            sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 600, height: 32 }}
          />
        )}

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
            sx={{ bgcolor: 'info.main', color: '#fff', fontWeight: 600, height: 32 }}
          />
        )}

        {enabled && user && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ textTransform: 'none', height: 32 }}
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
