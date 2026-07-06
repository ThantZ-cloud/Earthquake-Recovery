import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BedIcon from '@mui/icons-material/Bed';
import WaterIcon from '@mui/icons-material/Water';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useLang } from '../i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const SCENARIOS = [
  {
    icon: <HomeIcon sx={{ fontSize: 40 }} />,
    emoji: '🏠',
    titleKey: 'during.scenarios.indoors.title',
    dosKey: 'during.scenarios.indoors.dos',
    dontsKey: 'during.scenarios.indoors.donts',
    dosCount: 8,
    dontsCount: 4,
    color: '#1565C0',
  },
  {
    icon: <ParkIcon sx={{ fontSize: 40 }} />,
    emoji: '🌳',
    titleKey: 'during.scenarios.outdoors.title',
    dosKey: 'during.scenarios.outdoors.dos',
    dontsKey: 'during.scenarios.outdoors.donts',
    dosCount: 6,
    dontsCount: 4,
    color: '#2E7D32',
  },
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    emoji: '🚗',
    titleKey: 'during.scenarios.driving.title',
    dosKey: 'during.scenarios.driving.dos',
    dontsKey: 'during.scenarios.driving.donts',
    dosCount: 6,
    dontsCount: 4,
    color: '#E65100',
  },
  {
    icon: <BedIcon sx={{ fontSize: 40 }} />,
    emoji: '🛏️',
    titleKey: 'during.scenarios.bed.title',
    dosKey: 'during.scenarios.bed.dos',
    dontsKey: 'during.scenarios.bed.donts',
    dosCount: 5,
    dontsCount: 2,
    color: '#7B1FA2',
  },
  {
    icon: <WaterIcon sx={{ fontSize: 40 }} />,
    emoji: '🏖️',
    titleKey: 'during.scenarios.highrise.title',
    dosKey: 'during.scenarios.highrise.dos',
    dontsKey: 'during.scenarios.highrise.donts',
    dosCount: 6,
    dontsCount: 3,
    color: '#00838F',
  },
];

export default function DuringEarthquake() {
  const theme = useTheme();
  const { t } = useLang();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background: `linear-gradient(135deg, ${theme.palette.mode === 'dark' ? '#1a1a2e' : '#f5f5f5'} 0%, ${theme.palette.mode === 'dark' ? '#16213e' : '#eeeeee'} 100%)`,
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
            ⚡ {t('during.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            {t('during.intro')}
          </Typography>

          {/* Warning box */}
          <Box
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 6,
              p: 2.5,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(211,47,47,0.15)' : '#FFEBEE',
            }}
          >
            <WarningAmberIcon sx={{ color: '#d32f2f', fontSize: 32, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.7 }}>
              {t('during.warning')}
            </Typography>
          </Box>
        </motion.div>

        {/* Scenario cards */}
        <Grid container spacing={4}>
          {SCENARIOS.map((scenario, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={scenario.title}>
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
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(0,0,0,0.3)'
                        : '0 8px 30px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h2" sx={{ fontSize: '2.5rem' }}>
                      {scenario.emoji}
                    </Typography>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t(scenario.titleKey)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Do's */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'success.main',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {t('during.labelDo')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                      {Array.from({ length: scenario.dosCount }, (_, i) => (
                        <Box
                          component="li"
                          key={i}
                          sx={{
                            mb: 0.8,
                            '&::marker': { color: 'success.main' },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {t(`${scenario.dosKey}.${i}`)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Don'ts */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'error.main',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {t('during.labelDont')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                      {Array.from({ length: scenario.dontsCount }, (_, i) => (
                        <Box
                          component="li"
                          key={i}
                          sx={{
                            mb: 0.8,
                            '&::marker': { color: 'error.main' },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {t(`${scenario.dontsKey}.${i}`)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
