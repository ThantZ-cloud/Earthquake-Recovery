import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Slider,
  Collapse,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QUAKES = [
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
    year: 1930,
    location: 'Bago (Pegu), Myanmar',
    magnitude: 7.3,
    depth: 10,
    impact: 'Caused widespread destruction in Bago. Many historical structures damaged. Felt strongly in Yangon. Triggered fires that added to the devastation.',
  },
];

function magBadgeColor(mag) {
  if (mag >= 9) return '#b71c1c';
  if (mag >= 8) return '#d32f2f';
  if (mag >= 7) return '#ed6c02';
  return '#f9a825';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function History() {
  const [minMag, setMinMag] = useState(6);
  const [expanded, setExpanded] = useState(null);

  const filtered = QUAKES.filter((q) => q.magnitude >= minMag);

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
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Historical Earthquakes
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
              Learning from the past to prepare for the future.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Filter */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 5, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Filter by minimum magnitude
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flexWrap: 'wrap' }}>
            <Slider
              value={minMag}
              onChange={(_, v) => setMinMag(v)}
              min={6}
              max={10}
              step={0.1}
              marks={[
                { value: 6, label: 'M6' },
                { value: 7, label: 'M7' },
                { value: 8, label: 'M8' },
                { value: 9, label: 'M9' },
                { value: 9.5, label: 'M9.5' },
              ]}
              sx={{ flex: 1 }}
            />
            <Chip label={`≥ M${minMag}`} color="primary" variant="outlined" />
          </Box>
        </Card>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No earthquakes match this magnitude filter.
          </Typography>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Box sx={{ position: 'relative', pl: { xs: 3, md: 0 } }}>
              {/* Vertical line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: 14, md: '50%' },
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: 'divider',
                  transform: { md: 'translateX(-50%)' },
                  borderRadius: 2,
                }}
              />

              {filtered.map((q, i) => (
                <motion.div key={q.location} variants={itemVariants}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' },
                      alignItems: 'flex-start',
                      mb: 4,
                      position: 'relative',
                    }}
                  >
                    {/* Dot on the line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: { xs: 14, md: '50%' },
                        top: 24,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: magBadgeColor(q.magnitude),
                        border: '3px solid',
                        borderColor: 'background.paper',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }}
                    />

                    {/* Spacer for alternating layout */}
                    <Box sx={{ flex: { md: 1 }, display: { xs: 'none', md: 'block' } }} />

                    {/* Card */}
                    <Box sx={{ flex: { md: 1 }, pl: { xs: 5, md: i % 2 === 0 ? 3 : 0 }, pr: { md: i % 2 !== 0 ? 3 : 0 }, width: { xs: '100%', md: 'auto' } }}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          borderLeft: '4px solid',
                          borderColor: magBadgeColor(q.magnitude),
                        }}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              {q.location}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={`M ${q.magnitude}`}
                                size="small"
                                sx={{
                                  bgcolor: magBadgeColor(q.magnitude),
                                  color: '#fff',
                                  fontWeight: 700,
                                }}
                              />
                              <Chip label={q.year} size="small" variant="outlined" />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Depth: {q.depth} km
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{
                                transform: expanded === i ? 'rotate(180deg)' : 'none',
                                transition: '0.3s',
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Box>
                          <Collapse in={expanded === i}>
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                Impact
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {q.impact}
                              </Typography>
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
