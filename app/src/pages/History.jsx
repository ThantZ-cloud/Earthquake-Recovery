import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Slider,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const INTERNATIONAL_QUAKES = [
  {
    year: 1960,
    location: 'Valdivia (Biobío), Chile',
    magnitude: 9.5,
    depth: 33,
    impact: 'The largest earthquake ever recorded. Triggered a massive tsunami that struck Hawaii, Japan, and the Philippines. Over 1,600 people killed and 2 million left homeless.',
  },
  {
    year: 1964,
    location: 'Good Friday, Alaska, USA',
    magnitude: 9.2,
    depth: 25,
    impact: 'Lasted 4.5 minutes. Triggered landslides and tsunamis. Caused ground liquefaction in Anchorage. 131 people killed.',
  },
  {
    year: 2004,
    location: 'Indian Ocean (Sumatra)',
    magnitude: 9.2,
    depth: 30,
    impact: 'Triggered a devastating tsunami that affected 14 countries. Over 230,000 people killed. One of the deadliest natural disasters in recorded history.',
  },
  {
    year: 2011,
    location: 'Tōhoku, Japan',
    magnitude: 9.1,
    depth: 29,
    impact: 'Caused a massive tsunami and the Fukushima Daiichi nuclear disaster. Over 15,000 deaths. Most powerful earthquake ever recorded in Japan.',
  },
  {
    year: 1952,
    location: 'Severo-Kurilsk, Russia',
    magnitude: 9.0,
    depth: 30,
    impact: 'Generated a destructive tsunami in the Pacific Ocean. Severo-Kurilsk was completely destroyed. Waves reached heights of 18 meters.',
  },
  {
    year: 2010,
    location: 'Maule, Chile',
    magnitude: 8.8,
    depth: 35,
    impact: '526 people killed. Tsunami warnings issued for 53 countries. Triggered coastal uplift and subsidence along the Chilean coast.',
  },
];

const MYANMAR_QUAKES = [
  {
    year: 2025,
    location: 'Sagaing, Myanmar',
    magnitude: 7.7,
    depth: 10,
    impact: 'Struck near Mandalay causing widespread destruction across central Myanmar. Thousands of buildings collapsed, including historical pagodas and monasteries. One of the most devastating earthquakes in Myanmar\'s recent history.',
  },
  {
    year: 1839,
    location: 'Ava (Innwa), Myanmar',
    magnitude: 8.3,
    depth: 12,
    impact: 'Devastated the ancient capital of Ava (Innwa). Numerous pagodas and buildings collapsed. Felt across a wide area including present-day Mandalay and Sagaing.',
  },
  {
    year: 1946,
    location: 'Sagaing-Mandalay, Myanmar',
    magnitude: 7.8,
    depth: 15,
    impact: 'Major destruction along the Sagaing Fault. Significant damage to Mandalay and Sagaing cities. Triggered landslides across central Myanmar.',
  },
  {
    year: 2016,
    location: 'Chauk, Myanmar',
    magnitude: 6.8,
    depth: 84,
    impact: 'Caused significant damage to ancient temples in Bagan, including the collapse of spires and walls on several pagodas. Felt across Myanmar and neighboring countries.',
  },
  {
    year: 2012,
    location: 'Shwebo, Myanmar',
    magnitude: 6.8,
    depth: 10,
    impact: 'Struck near Shwebo in Sagaing Region. Caused casualties and damage to buildings. A bridge under construction collapsed into the Irrawaddy River.',
  },
  {
    year: 1930,
    location: 'Bago (Pegu), Myanmar',
    magnitude: 7.3,
    depth: 10,
    impact: 'Caused widespread destruction in Bago. Many historical structures damaged. Felt strongly in Yangon. Triggered fires that added to the devastation.',
  },
  {
    year: 1975,
    location: 'Bagan, Myanmar',
    magnitude: 6.5,
    depth: 30,
    impact: 'Damaged numerous ancient pagodas and temples in the Bagan archaeological zone. Several stupas lost their upper sections. Prompted restoration efforts for heritage structures.',
  },
];

function magBadgeColor(mag) {
  if (mag >= 9) return '#b71c1c';
  if (mag >= 8) return '#d32f2f';
  if (mag >= 7) return '#ed6c02';
  return '#f9a825';
}

function FlipCard({ q, color }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box
      onClick={() => setFlipped((f) => !f)}
      sx={{
        perspective: 1000,
        cursor: 'pointer',
        height: 320,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderTop: '4px solid',
            borderColor: color,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3.5rem', md: '4.5rem' },
                fontWeight: 900,
                color: color,
                lineHeight: 1,
                mb: 1,
              }}
            >
              {q.magnitude}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
              Magnitude
            </Typography>

            <Typography variant="h6" fontWeight={700} gutterBottom>
              {q.location}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={q.year} size="small" variant="outlined" />
              <Chip label={`${q.depth} km deep`} size="small" variant="outlined" />
            </Box>

            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.5 }}>
              <FlipCameraAndroidIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">Click to see impact</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: color,
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="overline" sx={{ opacity: 0.8, mb: 1 }}>
              Impact & Aftermath
            </Typography>
            <Typography variant="body1" sx={{ flex: 1, lineHeight: 1.7 }}>
              {q.impact}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7, mt: 'auto' }}>
              <FlipCameraAndroidIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">Click to flip back</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default function History() {
  const [tab, setTab] = useState(0);
  const [minMag, setMinMag] = useState(6);

  const currentQuakes = tab === 0 ? INTERNATIONAL_QUAKES : MYANMAR_QUAKES;
  const filtered = currentQuakes.filter((q) => q.magnitude >= minMag);

  const handleTabChange = (_, v) => {
    setTab(v);
    setMinMag(6);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HistoryIcon sx={{ fontSize: 52, mb: 2, color: 'secondary.main' }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Historical Earthquakes
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
              Click any card to reveal the impact.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 0 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="International" />
          <Tab label="Myanmar (Local)" />
        </Tabs>
      </Container>

      {/* Filter */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 5, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Filter by minimum magnitude
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flexWrap: 'wrap' }}>
            <Slider
              value={minMag}
              onChange={(_, v) => setMinMag(v)}
              min={6}
              max={tab === 0 ? 10 : 9}
              step={0.1}
              marks={
                tab === 0
                  ? [
                      { value: 6, label: 'M6' },
                      { value: 7, label: 'M7' },
                      { value: 8, label: 'M8' },
                      { value: 9, label: 'M9' },
                      { value: 9.5, label: 'M9.5' },
                    ]
                  : [
                      { value: 6, label: 'M6' },
                      { value: 7, label: 'M7' },
                      { value: 8, label: 'M8' },
                    ]
              }
              sx={{ flex: 1 }}
            />
            <Chip label={`≥ M${minMag}`} color="primary" variant="outlined" />
          </Box>
        </Card>

        {/* Flip Card Grid */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FilterListOffIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No earthquakes match this filter
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Try lowering the minimum magnitude to see more results.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((q, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={q.location}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                >
                  <FlipCard q={q} color={magBadgeColor(q.magnitude)} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
