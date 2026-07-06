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
import { useLang } from '../i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const CARDS = [
  {
    icon: <PublicIcon sx={{ fontSize: 48, color: '#1565C0' }} />,
    emoji: '🌍',
    titleKey: 'whatIs.plates.title',
    descKey: 'whatIs.plates.desc',
  },
  {
    icon: <TerrainIcon sx={{ fontSize: 48, color: '#D32F2F' }} />,
    emoji: '⛰️',
    titleKey: 'whatIs.faults.title',
    descKey: 'whatIs.faults.desc',
  },
  {
    icon: <WavesIcon sx={{ fontSize: 48, color: '#E65100' }} />,
    emoji: '🌊',
    titleKey: 'whatIs.waves.title',
    descKey: 'whatIs.waves.desc',
  },
];

export default function WhatIsEarthquake() {
  const theme = useTheme();
  const { t } = useLang();

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
            🌋 {t('whatIs.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            {t('whatIs.intro')}
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
                style={{ height: '100%' }}
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
                    {t(card.titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {t(card.descKey)}
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
              💡 <strong>{t('whatIs.didYouKnow')}</strong> About 500,000 earthquakes are detected worldwide
              each year, but only about 100,000 are felt, and fewer than 100 cause damage.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
