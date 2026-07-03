import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

const MAGNITUDE_SCALE = [
  { mag: '1–2', label: 'Micro', color: '#4caf50', desc: 'Not felt by people. Recorded by seismographs only. Millions occur each year.' },
  { mag: '3–3.9', label: 'Minor', color: '#8bc34a', desc: 'Felt by some people indoors. Rarely causes damage. Like a passing truck.' },
  { mag: '4–4.9', label: 'Light', color: '#ffeb3b', desc: 'Felt by most people. Dishes rattle, doors swing. Minor damage possible.' },
  { mag: '5–5.9', label: 'Moderate', color: '#ff9800', desc: 'Felt by everyone. Furniture moves. Some structural damage to weak buildings.' },
  { mag: '6–6.9', label: 'Strong', color: '#ff5722', desc: 'Damage to well-built structures. Felt over wide areas. Can be destructive in populated regions.' },
  { mag: '7–7.9', label: 'Major', color: '#f44336', desc: 'Serious damage over large areas. Buildings collapse. Ground cracks appear.' },
  { mag: '8–8.9', label: 'Great', color: '#d32f2f', desc: 'Severe damage over vast areas. Total destruction near the epicenter. Affects millions.' },
  { mag: '9+', label: 'Devastating', color: '#b71c1c', desc: 'Catastrophic destruction. Entire regions leveled. Triggers tsunamis and landslides.' },
];

export default function HowToMeasure() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
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
            📏 How to Measure an Earthquake?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            Earthquakes are measured using two main systems: <strong>magnitude</strong> (energy
            released at the source) and <strong>intensity</strong> (how much shaking is felt at a
            specific location). The most well-known scale is the Richter Scale, but scientists
            now primarily use the Moment Magnitude Scale.
          </Typography>
        </motion.div>

        {/* Two column: Richter vs Moment Magnitude */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={1}
              variants={fadeUp}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  📐 Richter Scale
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  Developed in 1935 by Charles Richter, this was the first widely used magnitude
                  scale. It measures the amplitude of the largest seismic wave recorded on a
                  seismograph. The scale is <strong>logarithmic</strong> — each whole number increase
                  represents a <strong>10× increase in wave amplitude</strong> and roughly
                  <strong> 31.6× more energy released</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  For example, a magnitude 6 earthquake releases about 31.6 times more energy
                  than a magnitude 5. The Richter Scale works best for local, moderate earthquakes
                  and is less accurate for very large quakes (M8+) or those far from seismometers.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={2}
              variants={fadeUp}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  🔬 Moment Magnitude Scale (Mw)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  The modern standard for measuring earthquakes. Unlike the Richter Scale, it
                  measures the <strong>total energy released</strong> by calculating the area of
                  the fault that ruptured, the distance the rock moved, and the rigidity of the
                  rock. This makes it accurate for earthquakes of all sizes, anywhere in the world.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Today, when you hear "magnitude 7.1 earthquake" on the news, it's almost always
                  the Moment Magnitude (Mw). For small earthquakes (below M3.5), the two scales
                  give nearly identical numbers, but they diverge significantly for major events.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Magnitude scale visualization */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={3}
          variants={fadeUp}
        >
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 600, mb: 4 }}
          >
            🔢 Magnitude Scale Explained
          </Typography>
        </motion.div>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {MAGNITUDE_SCALE.map((item, i) => (
            <motion.div
              key={item.mag}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              custom={i + 4}
              variants={fadeUp}
            >
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                  p: { xs: 2, sm: 2.5 },
                  mb: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                {/* Magnitude badge */}
                <Box
                  sx={{
                    minWidth: { xs: '100%', sm: 100 },
                    textAlign: 'center',
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: item.color,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  M {item.mag}
                </Box>
                {/* Label + description */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Energy comparison fact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={12}
          variants={fadeUp}
        >
          <Box
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(230,81,0,0.1)' : '#FFF3E0',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              💡 <strong>Energy comparison:</strong> A magnitude 9.0 earthquake releases as much
              energy as 480 million tons of TNT — equivalent to about 31,000 Hiroshima atomic bombs.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
