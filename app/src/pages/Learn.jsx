import { Box, Container, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { motion } from 'framer-motion';
import WhatIsEarthquake from '../components/WhatIsEarthquake';
import HowToMeasure from '../components/HowToMeasure';
import SafetyGuide from '../components/SafetyGuide';
import BeforeEarthquake from '../components/BeforeEarthquake';
import DuringEarthquake from '../components/DuringEarthquake';
import AfterEarthquake from '../components/AfterEarthquake';
import { useLang } from '../i18n';

export default function Learn() {
  const { t } = useLang();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <MenuBookIcon sx={{ fontSize: 52, mb: 2, color: 'secondary.main' }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              {t('learn.hero.title')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
              {t('learn.hero.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* What is an Earthquake? */}
      <Box id="learn-section">
        <WhatIsEarthquake />

        {/* How to Measure an Earthquake */}
        <HowToMeasure />
      </Box>

      {/* Earthquake Safety Guide: Drop, Cover, Hold On, Stay Calm */}
      <Box id="prepare-section">
        <SafetyGuide />

        {/* Before an Earthquake */}
        <BeforeEarthquake />
      </Box>

      {/* During an Earthquake */}
      <Box id="during-section">
        <DuringEarthquake />
      </Box>

      {/* After an Earthquake */}
      <Box id="after-section">
        <AfterEarthquake />
      </Box>
    </Box>
  );
}
