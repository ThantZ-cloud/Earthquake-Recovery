import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EarthquakeMap from '../components/EarthquakeMap';
import axios from 'axios';

const REGIONS = [
  'All regions',
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Oceania',
  'Africa',
  'Middle East',
];

const SAFETY_TIPS = [
  {
    title: 'Drop',
    description:
      'Get low on your hands and knees to prevent being knocked over by the shaking.',
    icon: <ArrowDownwardIcon fontSize="large" />,
    color: '#d32f2f',
  },
  {
    title: 'Cover',
    description:
      'Take shelter under sturdy furniture and protect your head and neck with your arms.',
    icon: <ShieldIcon fontSize="large" />,
    color: '#ed6c02',
  },
  {
    title: 'Hold On',
    description:
      'Hold on to your shelter until the shaking stops. Be prepared for aftershocks.',
    icon: <SafetyCheckIcon fontSize="large" />,
    color: '#2e7d32',
  },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('All regions');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await axios.post('/api/subscribe', { email, region });
      setSnackbar({ open: true, severity: 'success', message: 'Subscribed! You will receive earthquake alerts.' });
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Something went wrong.';
      setSnackbar({ open: true, severity: err.response?.status === 409 ? 'info' : 'error', message: msg });
    } finally {
      setSubmitting(false);
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
        {/* Animated background circles */}
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
      <Box id="map-section" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            🌍 Live Earthquake Map
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Each circle represents an earthquake in the past hour. Color shows magnitude.
          </Typography>
          <EarthquakeMap height="65vh" />
          {/* Legend */}
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
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="caption">{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Safety Tips */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            🛡️ During an Earthquake
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={5}
          >
            Remember the three simple steps that could save your life.
          </Typography>
          <Grid container spacing={4}>
            {SAFETY_TIPS.map((tip) => (
              <Grid item xs={12} md={4} key={tip.title}>
                <Card
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: `${tip.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: tip.color,
                    }}
                  >
                    {tip.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" px={3}>
                    {tip.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Alert Signup */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: '#fff',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <NotificationsActiveIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Get Earthquake Alerts
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Sign up to receive notifications about significant earthquakes in your region.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubscribe}
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="medium"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff',
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              size="medium"
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff',
                  borderRadius: 2,
                },
              }}
            >
              {REGIONS.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                bgcolor: '#fff',
                color: '#d32f2f',
                fontWeight: 700,
                px: 4,
                '&:hover': { bgcolor: '#ffe0e0' },
              }}
            >
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
