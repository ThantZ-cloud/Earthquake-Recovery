import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Snackbar, Alert, Box, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MyLocationIcon from '@mui/icons-material/MyLocation';
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
// A quake this much later than the last alerted one is a new alert episode
const NEW_EPISODE_MS = 60_000;

// Siren audio — lightweight instance
function createSiren() {
  const audio = new Audio('/assets/alert-sound.mp3');
  audio.loop = true;
  audio.volume = 1;
  audio.preload = 'none';
  return audio;
}

let sirenAudio = null;
let vibrationInterval = null;

function getSiren() {
  if (!sirenAudio) sirenAudio = createSiren();
  return sirenAudio;
}

// Continuous vibration for mobile
function startVibration() {
  if (!('vibrate' in navigator)) return;
  vibrationInterval = setInterval(() => {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }, 800);
}

function stopVibration() {
  if (vibrationInterval) {
    clearInterval(vibrationInterval);
    vibrationInterval = null;
    navigator.vibrate(0);
  }
}

// Play siren, return stop function. Returns null if blocked.
function startSiren(onAutoStop) {
  const audio = getSiren();
  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => null);
    }
    // Start continuous vibration on mobile
    startVibration();
    // Auto-stop after max duration
    const timer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      stopVibration();
      if (onAutoStop) onAutoStop();
    }, SIREN_MAX_MS);
    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
      stopVibration();
    };
  } catch {
    return null;
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
  const alertedIdsRef = useRef(new Set());
  const sirenStoppedByUserRef = useRef(false);
  const lastEventTimeRef = useRef(null);

  // Saved location state
  const [savedLocation, setSavedLocation] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLon, setEditLon] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

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
      setLocationError(t('alerts.geoNotSupported'));
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setWatching(true);
        setLocationError('');
      },
      (err) => {
        setLocationError(t('alerts.allowLocation'));
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setWatching(false);
    };
  }, [enabled, t]);

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
      setSavedToast(true);
    },
    [user, savedLocation]
  );

  // Open reassign dialog
  const handleEdit = useCallback(() => {
    const loc = savedLocation || { latitude: userPos?.[0] || '', longitude: userPos?.[1] || '', label: '' };
    setEditLabel(loc.label || '');
    setEditLat(String(loc.latitude || ''));
    setEditLon(String(loc.longitude || ''));
    setEditOpen(true);
  }, [savedLocation, userPos]);

  // Use current GPS position as the new monitoring location
  const handleUseCurrent = useCallback(() => {
    if (!userPos) return;
    setEditLat(String(userPos[0]));
    setEditLon(String(userPos[1]));
  }, [userPos]);

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
      let target = null;
      let targetDist = 0;
      let newEpisode = false;

      // Mark every new quake within range as alerted (batch), pick the strongest
      for (const q of quakes) {
        if (!q.lat || !q.lon || !q.mag || q.mag < 3) continue;
        if (alertedIdsRef.current.has(q.id)) continue;

        const dist = haversineKm(pos, [q.lat, q.lon]);
        if (dist > RADIUS_KM) continue;

        alertedIdsRef.current.add(q.id);
        const eventTime = q.time ? Date.parse(q.time) : Date.now();
        if (lastEventTimeRef.current && eventTime - lastEventTimeRef.current > NEW_EPISODE_MS) {
          newEpisode = true;
        }
        if (!target || q.mag > target.mag) {
          target = q;
          targetDist = dist;
        }
      }

      if (!target) return;
      lastEventTimeRef.current = target.time ? Date.parse(target.time) : Date.now();

      setAlertQuake({ place: target.place, mag: target.mag, dist: targetDist.toFixed(1) });
      setSnackOpen(true);

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification(t('alerts.notifTitle'), {
          body: t('alerts.alertMsg', { mag: target.mag, dist: targetDist.toFixed(1), place: target.place }),
          icon: '/assets/logo.png',
          tag: 'earthquake-alert',
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      }

      // Respect the user's stop for the current episode; only a genuinely new
      // episode (e.g. a much later quake) may sound again
      if (newEpisode) sirenStoppedByUserRef.current = false;
      if (!stopSirenRef.current && !sirenStoppedByUserRef.current) {
        stopSirenRef.current = startSiren(() => {
          stopSirenRef.current = null;
          setSirenActive(false);
        });
        setSirenActive(!!stopSirenRef.current);
      }
    };

    checkQuakes();
    const interval = setInterval(checkQuakes, POLL_MS);
    return () => clearInterval(interval);
  }, [enabled, userPos, savedLocation, queryClient, t]);

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

  // Demo alert handler
  const handleDemo = useCallback(() => {
    handleStopSiren();
    setAlertQuake({ place: 'MANDALAY, MYANMAR', mag: 5.2, dist: '12.3' });
    setSnackOpen(true);

    const stop = startSiren(() => {
      stopSirenRef.current = null;
      setSirenActive(false);
    });
    if (stop) {
      stopSirenRef.current = stop;
      setSirenActive(true);
    }
  }, [handleStopSiren]);

  // Get active location name
  const locationLabel = savedLocation?.label || (userPos ? t('alerts.currentLocation') : t('alerts.noLocation'));

  return (
    <>
      {/* Alert controls + location info */}
      <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<NotificationsActiveIcon />}
          onClick={handleDemo}
          color="warning"
          sx={{ fontWeight: 600, height: 32 }}
        >
          {t('alerts.testAlert')}
        </Button>

        {enabled && (watching || savedLocation) && (
          <Chip
            label={t('alerts.monitoringMsg', { label: locationLabel, radius: RADIUS_KM })}
            size="small"
            sx={{ bgcolor: 'info.main', color: '#fff', fontWeight: 600, height: 32 }}
          />
        )}

        {enabled && user && (
          <Button
            size="small"
            startIcon={<MyLocationIcon />}
            onClick={handleEdit}
            sx={{ textTransform: 'none', height: 32 }}
          >
            {t('alerts.reassign')}
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
        <DialogTitle>{savedLocation ? t('alerts.editLocation') : t('alerts.saveLocation')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {savedLocation ? t('alerts.updateMsg') : t('alerts.saveMsg')}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<MyLocationIcon />}
            onClick={handleUseCurrent}
            disabled={!userPos}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            {t('alerts.useCurrentLocation')}
          </Button>
          {!userPos && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
              {t('alerts.noGps')}
            </Typography>
          )}
          <TextField
            label={t('alerts.labelPlaceholder')}
            fullWidth
            size="small"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('alerts.latitude')}
            fullWidth
            size="small"
            type="number"
            slotProps={{ htmlInput: { step: 'any' } }}
            value={editLat}
            onChange={(e) => setEditLat(e.target.value)}
            error={!!editLat && Number.isNaN(parseFloat(editLat))}
            helperText={!!editLat && Number.isNaN(parseFloat(editLat)) ? t('alerts.invalidCoord') : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('alerts.longitude')}
            fullWidth
            size="small"
            type="number"
            slotProps={{ htmlInput: { step: 'any' } }}
            value={editLon}
            onChange={(e) => setEditLon(e.target.value)}
            error={!!editLon && Number.isNaN(parseFloat(editLon))}
            helperText={!!editLon && Number.isNaN(parseFloat(editLon)) ? t('alerts.invalidCoord') : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>{t('alerts.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => saveLocation(parseFloat(editLat), parseFloat(editLon), editLabel)}
            disabled={
              saving ||
              !editLat ||
              !editLon ||
              Number.isNaN(parseFloat(editLat)) ||
              Number.isNaN(parseFloat(editLon)) ||
              parseFloat(editLat) < -90 ||
              parseFloat(editLat) > 90 ||
              parseFloat(editLon) < -180 ||
              parseFloat(editLon) > 180
            }
          >
            {saving ? t('alerts.saving') : t('alerts.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location saved toast */}
      <Snackbar
        open={savedToast}
        autoHideDuration={3000}
        onClose={() => setSavedToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          {t('alerts.locationSaved')}
        </Alert>
      </Snackbar>

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
              {t('alerts.stopSound')}
            </Button>
          }
        >
          ⚠️ {alertQuake && t('alerts.alertMsg', { mag: alertQuake.mag, dist: alertQuake.dist, place: alertQuake.place })}
        </Alert>
      </Snackbar>
    </>
  );
}
