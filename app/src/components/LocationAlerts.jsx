import { useState, useEffect, useRef, useCallback } from 'react';
import { Snackbar, Alert, Box, Chip, Typography } from '@mui/material';
import axios from 'axios';

// Haversine distance in km between two [lat, lon] points
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

const RADIUS_KM = 50; // alert if quake within 50 km
const POLL_MS = 30_000; // check every 30 seconds

export default function LocationAlerts({ enabled }) {
  const [alertQuake, setAlertQuake] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);

  // Request geolocation
  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationError('');
      },
      (err) => {
        setLocationError('Please allow location access to receive alerts.');
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setWatching(true);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setWatching(false);
    };
  }, [enabled]);

  // Poll earthquakes
  const checkQuakes = useCallback(async () => {
    if (!userPos) return;
    try {
      const res = await axios.get('/api/recent');
      const features = res.data?.data?.features || [];
      for (const f of features) {
        const [lon, lat] = f.geometry?.coordinates || [];
        const mag = f.properties?.mag;
        if (!lon || !lat || !mag || mag < 2) continue;

        const dist = haversineKm(userPos, [lat, lon]);
        if (dist <= RADIUS_KM) {
          const place = f.properties?.place || f.properties?.flynn_region || 'Nearby';
          setAlertQuake({ place, mag, dist: dist.toFixed(1) });
          setSnackOpen(true);
          return; // one alert at a time
        }
      }
    } catch {
      // silent fail — don't spam user
    }
  }, [userPos]);

  useEffect(() => {
    if (!enabled || !userPos) return;
    checkQuakes(); // initial check
    const interval = setInterval(checkQuakes, POLL_MS);
    return () => clearInterval(interval);
  }, [enabled, userPos, checkQuakes]);

  if (locationError) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Chip label={locationError} color="warning" variant="outlined" />
      </Box>
    );
  }

  if (userPos && watching) {
    return (
      <>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            label={`📍 Monitoring — we'll alert you if a quake happens within ${RADIUS_KM} km`}
            color="success"
            variant="outlined"
            size="small"
          />
        </Box>
        <Snackbar
          open={snackOpen}
          autoHideDuration={8000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="warning"
            variant="filled"
            onClose={() => setSnackOpen(false)}
            sx={{ fontSize: '0.95rem' }}
          >
            ⚠️ <strong>M{alertQuake?.mag}</strong> earthquake detected{' '}
            <strong>{alertQuake?.dist} km</strong> away — {alertQuake?.place}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return null;
}
