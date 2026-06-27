import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LoginIcon from '@mui/icons-material/Login';
import { motion } from 'framer-motion';
import SafetyCharacter from '../components/SafetyCharacter';
import EarthquakeMap from '../components/EarthquakeMap';
import RecentQuakes from '../components/RecentQuakes';
import LocationAlerts from '../components/LocationAlerts';
import AuthDialog from '../components/AuthDialog';
import { useAuth } from '../context/AuthContext';

const SAFETY_TIPS = [
  {
    title: 'Drop',
    description: 'Get low on your hands and knees to prevent being knocked over by the shaking.',
    icon: <ArrowDownwardIcon fontSize="large" />,
    color: '#d32f2f',
    characterType: 'drop',
  },
  {
    title: 'Cover',
    description: 'Take shelter under sturdy furniture and protect your head and neck with your arms.',
    icon: <ShieldIcon fontSize="large" />,
    color: '#ed6c02',
    characterType: 'cover',
  },
  {
    title: 'Hold On',
    description: 'Hold on to your shelter until the shaking stops. Be prepared for aftershocks.',
    icon: <SafetyCheckIcon fontSize="large" />,
    color: '#2e7d32',
    characterType: 'holdOn',
  },
];

/* Card entrance animation variants */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Home() {
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
            fontWeight={800}
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
              color: '#000',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#ff9800' },
            }}
          >
            View Live Map
          </Button>
        </Container>
      </Box>

      {/* Map Section */}
      <Box id="map-section" sx={{ py: 8, mt: 2, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
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

      {/* Recent Earthquakes */}
      <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <RecentQuakes />
        </Container>
      </Box>

      {/* Safety Tips — During an Earthquake */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(180deg, background.paper 0%, #f5f5f5 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            🛡️ During an Earthquake
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
            Remember the three simple steps that could save your life.
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {SAFETY_TIPS.map((tip, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={tip.title}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  <Card
                    elevation={0}
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      px: 2,
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 12px 32px ${tip.color}20`,
                      },
                    }}
                  >
                    {/* Animated character */}
                    <Box sx={{ mb: 1 }}>
                      <SafetyCharacter type={tip.characterType} color={tip.color} />
                    </Box>

                    {/* Step number badge */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: tip.color,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {tip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" px={2}>
                      {tip.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Location-based Earthquake Alerts */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)', color: '#fff' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <MyLocationIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
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
                bgcolor: '#fff',
                color: '#d32f2f',
                fontWeight: 700,
                px: 5,
                py: 1.5,
                '&:hover': { bgcolor: '#ffe0e0' },
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
                bgcolor: '#fff',
                color: '#d32f2f',
                fontWeight: 700,
                px: 5,
                py: 1.5,
                '&:hover': { bgcolor: '#ffe0e0' },
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

      {/* Auth dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} initialTab={0} />
    </Box>
  );
}
