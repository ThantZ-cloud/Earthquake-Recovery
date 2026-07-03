import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import PublicIcon from '@mui/icons-material/Public';
import TerrainIcon from '@mui/icons-material/Terrain';
import WavesIcon from '@mui/icons-material/Waves';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const CARDS = [
  {
    icon: <PublicIcon sx={{ fontSize: 48, color: '#1565C0' }} />,
    emoji: '🌍',
    title: 'Tectonic Plates',
    desc: "Earth's outer shell is divided into large pieces called tectonic plates. These plates float on the semi-fluid mantle beneath them and constantly move — some as fast as a few centimeters per year. Where plates meet (plate boundaries), the pressure builds up over time. When that pressure is suddenly released, it causes an earthquake.",
  },
  {
    icon: <TerrainIcon sx={{ fontSize: 48, color: '#D32F2F' }} />,
    emoji: '⛰️',
    title: 'Fault Lines',
    desc: 'A fault is a fracture in the Earth\'s crust where blocks of rock have moved past each other. The most dangerous faults are active faults — those that have moved recently and are likely to move again. The San Andreas Fault in California and the Sagaing Fault in Myanmar are examples of major active faults that produce frequent earthquakes.',
  },
  {
    icon: <WavesIcon sx={{ fontSize: 48, color: '#E65100' }} />,
    emoji: '🌊',
    title: 'Seismic Waves',
    desc: "When an earthquake occurs, it releases energy in the form of seismic waves. P-waves (Primary) travel fastest and arrive first — they push and pull rock. S-waves (Secondary) are slower but cause more shaking — they move rock up and down. Surface waves travel along the ground and cause the most damage to buildings.",
  },
];

export default function WhatIsEarthquake() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.mode === 'dark' ? 'rgba(21,101,192,0.08)' : 'rgba(21,101,192,0.05)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0}
          variants={fadeUp}
        >
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 700 }}
          >
            🌋 What is an Earthquake?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            An earthquake is the sudden shaking of the ground caused by the release of energy
            stored in the Earth's crust. This happens when tectonic plates grind against each
            other along fault lines, sending seismic waves in all directions. Some earthquakes
            are barely noticeable, while others can level entire cities.
          </Typography>
        </motion.div>

        {/* Cards */}
        <Grid container spacing={4}>
          {CARDS.map((card, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={card.title}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i + 1}
                variants={fadeUp}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(0,0,0,0.3)'
                        : '0 8px 30px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h2" sx={{ fontSize: '3rem' }}>
                      {card.emoji}
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {card.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Extra fact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={4}
          variants={fadeUp}
        >
          <Box
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(21,101,192,0.1)' : '#E3F2FD',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              💡 <strong>Did you know?</strong> About 500,000 earthquakes are detected worldwide
              each year, but only about 100,000 are felt, and fewer than 100 cause damage.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
