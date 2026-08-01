import { Box, Container, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WhatIsEarthquake from '../components/WhatIsEarthquake';
import HowToMeasure from '../components/HowToMeasure';
import SafetyGuide from '../components/SafetyGuide';
import BeforeEarthquake from '../components/BeforeEarthquake';
import DuringEarthquake from '../components/DuringEarthquake';
import AfterEarthquake from '../components/AfterEarthquake';
import AnimatedHero from '../components/AnimatedHero';
import { useLang } from '../i18n';

export default function Learn() {
  const { t } = useLang();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <AnimatedHero
        icon={<MenuBookIcon sx={{ fontSize: 40, color: '#64b5f6' }} />}
        title={t('learn.hero.title')}
        subtitle={t('learn.hero.subtitle')}
        bg={['#0d47a1', '#1976d2', '#0a3d8f']}
        accent="#64b5f6"
        blobs={[
          { top: '10%', left: '5%', width: 400, height: 400, color: 'rgba(33,150,243,0.25)', blur: 60, duration: 20, dx: 50, dy: -40 },
          { top: '30%', right: '10%', width: 350, height: 350, color: 'rgba(0,188,212,0.2)', blur: 50, duration: 25, dx: -60, dy: 50 },
          { bottom: '-10%', left: '30%', width: 300, height: 300, color: 'rgba(63,81,181,0.2)', blur: 50, duration: 18, dx: 40, dy: -30 },
        ]}
      />

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
