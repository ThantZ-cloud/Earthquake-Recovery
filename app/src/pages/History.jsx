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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LayersIcon from '@mui/icons-material/Layers';
import { useLang } from '../i18n';

/* ──────────────────────────── DATA ──────────────────────────── */

const INTERNATIONAL_QUAKES = [
  {
    year: 1960,
    location: 'Valdivia (Biobío), Chile',
    magnitude: 9.5,
    depth: 33,
    impact:
      'The largest earthquake ever recorded. Triggered a massive tsunami that struck Hawaii, Japan, and the Philippines. Over 1,600 people killed and 2 million left homeless.',
  },
  {
    year: 1964,
    location: 'Good Friday, Alaska, USA',
    magnitude: 9.2,
    depth: 25,
    impact:
      'Lasted 4.5 minutes. Triggered landslides and tsunamis. Caused ground liquefaction in Anchorage. 131 people killed.',
  },
  {
    year: 2004,
    location: 'Indian Ocean (Sumatra)',
    magnitude: 9.2,
    depth: 30,
    impact:
      'Triggered a devastating tsunami that affected 14 countries. Over 230,000 people killed. One of the deadliest natural disasters in recorded history.',
  },
  {
    year: 2011,
    location: 'Tōhoku, Japan',
    magnitude: 9.1,
    depth: 29,
    impact:
      'Caused a massive tsunami and the Fukushima Daiichi nuclear disaster. Over 15,000 deaths. Most powerful earthquake ever recorded in Japan.',
  },
  {
    year: 1952,
    location: 'Severo-Kurilsk, Russia',
    magnitude: 9.0,
    depth: 30,
    impact:
      'Generated a destructive tsunami in the Pacific Ocean. Severo-Kurilsk was completely destroyed. Waves reached heights of 18 meters.',
  },
  {
    year: 2010,
    location: 'Maule, Chile',
    magnitude: 8.8,
    depth: 35,
    impact:
      '526 people killed. Tsunami warnings issued for 53 countries. Triggered coastal uplift and subsidence along the Chilean coast.',
  },
];

const MYANMAR_QUAKES = [
  {
    year: 2025,
    location: 'Sagaing, Myanmar',
    magnitude: 7.7,
    depth: 10,
    impact:
      "Struck near Mandalay causing widespread destruction across central Myanmar. Thousands of buildings collapsed, including historical pagodas and monasteries. One of the most devastating earthquakes in Myanmar's recent history.",
  },
  {
    year: 1839,
    location: 'Ava (Innwa), Myanmar',
    magnitude: 8.3,
    depth: 12,
    impact:
      'Devastated the ancient capital of Ava (Innwa). Numerous pagodas and buildings collapsed. Felt across a wide area including present-day Mandalay and Sagaing.',
  },
  {
    year: 1946,
    location: 'Sagaing-Mandalay, Myanmar',
    magnitude: 7.8,
    depth: 15,
    impact:
      'Major destruction along the Sagaing Fault. Significant damage to Mandalay and Sagaing cities. Triggered landslides across central Myanmar.',
  },
  {
    year: 2016,
    location: 'Chauk, Myanmar',
    magnitude: 6.8,
    depth: 84,
    impact:
      'Caused significant damage to ancient temples in Bagan, including the collapse of spires and walls on several pagodas. Felt across Myanmar and neighboring countries.',
  },
  {
    year: 2012,
    location: 'Shwebo, Myanmar',
    magnitude: 6.8,
    depth: 10,
    impact:
      'Struck near Shwebo in Sagaing Region. Caused casualties and damage to buildings. A bridge under construction collapsed into the Irrawaddy River.',
  },
  {
    year: 1930,
    location: 'Bago (Pegu), Myanmar',
    magnitude: 7.3,
    depth: 10,
    impact:
      'Caused widespread destruction in Bago. Many historical structures damaged. Felt strongly in Yangon. Triggered fires that added to the devastation.',
  },
  {
    year: 1975,
    location: 'Bagan, Myanmar',
    magnitude: 6.5,
    depth: 30,
    impact:
      'Damaged numerous ancient pagodas and temples in the Bagan archaeological zone. Several stupas lost their upper sections. Prompted restoration efforts for heritage structures.',
  },
];

/* ──────────────────────── HELPERS ───────────────────────── */

function magColor(mag) {
  if (mag >= 9) return '#b71c1c';
  if (mag >= 8) return '#d32f2f';
  if (mag >= 7) return '#ed6c02';
  return '#f9a825';
}

function magGradient(mag) {
  if (mag >= 9)
    return 'linear-gradient(90deg, #b71c1c 0%, #e53935 100%)';
  if (mag >= 8)
    return 'linear-gradient(90deg, #d32f2f 0%, #ff5252 100%)';
  if (mag >= 7)
    return 'linear-gradient(90deg, #ed6c02 0%, #ff9800 100%)';
  return 'linear-gradient(90deg, #f9a825 0%, #fdd835 100%)';
}

/* ──────────────────── STORY CARD ──────────────────────── */

function StoryCard({ q, index }) {
  const [expanded, setExpanded] = useState(false);
  const color = magColor(q.magnitude);
  const barPercent = Math.round((q.magnitude / 10) * 100);
  const isMajor = q.magnitude >= 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.12 }}
      style={{ breakInside: 'avoid', marginBottom: 24 }}
    >
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px ${color}22`,
            borderColor: color,
          },
        }}
      >
        {/* ── Accent bar ── */}
        <Box
          sx={{
            height: 5,
            background: magGradient(q.magnitude),
          }}
        />

        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          {/* ── Location ── */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              lineHeight: 1.25,
              mb: 2,
              fontSize: { xs: '1.05rem', sm: '1.15rem' },
            }}
          >
            {q.location}
          </Typography>

          {/* ── Magnitude row ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            {/* Badge */}
            <motion.div
              animate={
                isMajor
                  ? { scale: [1, 1.06, 1] }
                  : {}
              }
              transition={
                isMajor
                  ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                  : {}
              }
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${color}15`,
                  border: `2.5px solid ${color}`,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color,
                    lineHeight: 1,
                  }}
                >
                  {q.magnitude}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.55rem',
                    fontWeight: 600,
                    color,
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    lineHeight: 1,
                    mt: 0.25,
                  }}
                >
                  Mag
                </Typography>
              </Box>
            </motion.div>

            {/* Bar */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: `${color}18`,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: magGradient(q.magnitude),
                    borderRadius: 99,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* ── Chips ── */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
              label={q.year}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<LayersIcon sx={{ fontSize: 14 }} />}
              label={t('history.depth').replace('{depth}', q.depth)}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* ── Impact text ── */}
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                maxHeight: expanded ? 300 : 68,
              }}
            >
              {q.impact}
            </Typography>

            {/* Fade overlay when collapsed */}
            {!expanded && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 32,
                  background: (theme) =>
                    `linear-gradient(transparent, ${theme.palette.background.paper})`,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>

          {/* ── Expand toggle ── */}
          <Box
            onClick={() => setExpanded((e) => !e)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              mt: 1,
              py: 0.5,
              cursor: 'pointer',
              borderRadius: 1,
              color: color,
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: `${color}10` },
              transition: 'background 0.2s',
            }}
          >
            {expanded ? (
              <>
                {t('history.showLess')} <ExpandLessIcon sx={{ fontSize: 18 }} />
              </>
            ) : (
              <>
                {t('history.readMore')} <ExpandMoreIcon sx={{ fontSize: 18 }} />
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ──────────────────── PAGE ──────────────────────────── */

export default function History() {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const [minMag, setMinMag] = useState(6);

  const currentQuakes = tab === 0 ? INTERNATIONAL_QUAKES : MYANMAR_QUAKES;
  const filtered = currentQuakes.filter((q) => q.magnitude >= minMag);

  const handleTabChange = (_, v) => {
    setTab(v);
    setMinMag(6);
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HistoryIcon sx={{ fontSize: 52, mb: 2, color: 'secondary.main' }} />
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
            >
              {t('history.title')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
              {t('history.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label={t('history.tabInternational')} />
          <Tab label={t('history.tabMyanmar')} />
        </Tabs>
      </Container>

      {/* Filter */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {t('history.minMag')}
              </Typography>
              <Chip label={`≥ M${minMag}`} color="primary" variant="outlined" size="small" />
            </Box>
            <Slider
              value={minMag}
              onChange={(_, v) => setMinMag(v)}
              min={6}
              max={tab === 0 ? 10 : 9}
              step={0.1}
              marks={
                tab === 0
                  ? [
                      { value: 6, label: '6' },
                      { value: 7, label: '7' },
                      { value: 8, label: '8' },
                      { value: 9, label: '9' },
                      { value: 9.5, label: '9.5' },
                    ]
                  : [
                      { value: 6, label: '6' },
                      { value: 7, label: '7' },
                      { value: 8, label: '8' },
                    ]
              }
              sx={{ width: { xs: '100%', sm: 'auto' }, flex: 1 }}
            />
          </Box>
      </Container>

      {/* ── Masonry Story Cards ── */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FilterListOffIcon
              sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('history.noResults')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('history.noResultsDesc')}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              columnCount: { xs: 1, sm: 2, md: 3 },
              columnGap: 3,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((q, i) => (
                <StoryCard key={q.location} q={q} index={i} />
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Container>
    </Box>
  );
}
