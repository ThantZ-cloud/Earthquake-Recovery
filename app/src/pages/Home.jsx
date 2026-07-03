import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LoginIcon from '@mui/icons-material/Login';
import EarthquakeMap from '../components/EarthquakeMap';
import LocationAlerts from '../components/LocationAlerts';
import AuthDialog from '../components/AuthDialog';
import WhatIsEarthquake from '../components/WhatIsEarthquake';
import HowToMeasure from '../components/HowToMeasure';
import SafetyGuide from '../components/SafetyGuide';
import BeforeEarthquake from '../components/BeforeEarthquake';
import DuringEarthquake from '../components/DuringEarthquake';
import AfterEarthquake from '../components/AfterEarthquake';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  const handleEnableAlerts = () => {
    if (!user) {
      // Not logged in — open auth dialog
      setAuthOpen(true);
    } else {
      // Logged in — request location
      setLocationRequested(true);
      setAlertsEnabled(true);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(211,47,47,0.15)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
              '50%': { transform: 'scale(1.3)', opacity: 0.2 },
            },
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, mb: 2 }}
          >
            Stay Informed.
            <Box component="span" sx={{ color: 'secondary.main' }}>
              {' '}
              Stay Safe.
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.85, mb: 4, fontWeight: 400, maxWidth: 600, mx: 'auto' }}
          >
            Real-time earthquake tracking, safety guides, and recovery resources —
            all in one place.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="#map-section"
            sx={{
              bgcolor: 'secondary.main',
              color: (t) => t.palette.getContrastText(t.palette.secondary.main),
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'secondary.dark' },
            }}
          >
            View Live Map
          </Button>
        </Container>
      </Box>

      {/* Map Section */}
      <Box id="map-section" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" gutterBottom>
            🌍 Live Earthquake Map
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            Each circle represents a recent earthquake. Color shows magnitude.
          </Typography>
          <EarthquakeMap height={{ xs: '52vh', md: '65vh' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 2,
              flexWrap: 'wrap',
            }}
          >
            {[
              { color: '#2e7d32', label: 'M < 2 - Minor' },
              { color: '#f9a825', label: 'M 2-4 - Light' },
              { color: '#ed6c02', label: 'M 4-6 - Moderate' },
              { color: '#d32f2f', label: 'M 6+ - Strong' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="caption">{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Location-based Earthquake Alerts */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)', color: '#fff' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <MyLocationIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Location-Based Earthquake Alerts
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            {user
              ? 'Enable location access and we\'ll alert you if an earthquake happens near you.'
              : 'Login to enable location-based alerts. We\'ll monitor quakes near you in real time.'}
          </Typography>

          {!user ? (
            // Not logged in
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => setAuthOpen(true)}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                px: 5,
                py: 1.5,
                '&:hover': { bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.200' : '#ffe0e0' },
              }}
            >
              Login to Enable Alerts
            </Button>
          ) : !alertsEnabled ? (
            // Logged in but hasn't enabled yet
            <Button
              variant="contained"
              size="large"
              startIcon={<MyLocationIcon />}
              onClick={handleEnableAlerts}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                px: 5,
                py: 1.5,
                '&:hover': { bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.200' : '#ffe0e0' },
              }}
            >
              Allow Location Access
            </Button>
          ) : (
            // Alerts active
            <Box>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.85 }}>
                You'll be notified if an earthquake occurs within 50 km of your location.
              </Typography>
              <LocationAlerts enabled={alertsEnabled} />
            </Box>
          )}
        </Container>
      </Box>

      {/* What is an Earthquake? */}
      <WhatIsEarthquake />

      {/* How to Measure an Earthquake */}
      <HowToMeasure />

      {/* Earthquake Safety Guide: Drop, Cover, Hold On, Stay Calm */}
      <SafetyGuide />

      {/* Before an Earthquake */}
      <BeforeEarthquake />

      {/* During an Earthquake */}
      <DuringEarthquake />

      {/* After an Earthquake */}
      <AfterEarthquake />

      {/* Auth dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} initialTab={0} />
    </Box>
  );
}
