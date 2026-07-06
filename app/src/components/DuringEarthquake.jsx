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
    color: '#1565C0',
    dos: [
      'Drop, Cover, and Hold On immediately',
      'Get under a sturdy desk or table',
      'Stay away from windows, mirrors, and glass doors',
      'Move away from heavy furniture that could topple',
      'If in a kitchen, move away from the stove and refrigerator',
      'Stay inside until the shaking stops completely',
      'After shaking stops, check for injuries and damage',
      'Use stairs instead of elevators if evacuating',
    ],
    donts: [
      'Do NOT run outside during shaking — most injuries happen from falling debris near exits',
      'Do NOT stand in a doorway (this is an outdated myth — you\'re safer under a table)',
      'Do NOT use elevators',
      'Do NOT light matches or candles (gas leaks may be present)',
    ],
  },
  {
    icon: <ParkIcon sx={{ fontSize: 40 }} />,
    emoji: '🌳',
    titleKey: 'during.scenarios.outdoors.title',
    color: '#2E7D32',
    dos: [
      'Move to an open area away from buildings, trees, and power lines',
      'Drop to the ground and protect your head and neck',
      'Stay in the open until the shaking stops',
      'Watch for falling debris, broken glass, and collapsed structures',
      'If near a tall building, move away from it — facades and windows can fall',
      'Be aware of cracks in the ground, especially near slopes',
    ],
    donts: [
      'Do NOT run into traffic or onto roads',
      'Do NOT go near damaged buildings after the shaking stops',
      'Do NOT stand under power lines or near utility poles',
      'Do NOT enter tunnels, bridges, or overpasses',
    ],
  },
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    emoji: '🚗',
    titleKey: 'during.scenarios.driving.title',
    color: '#E65100',
    dos: [
      'Pull over to the side of the road as quickly and safely as possible',
      'Stop away from buildings, trees, overpasses, and utility wires',
      'Stay inside your vehicle — it provides protection from falling debris',
      'Set the parking brake and stay buckled in',
      'Listen to the radio for emergency instructions',
      'After shaking stops, drive carefully — watch for cracks, fallen debris, and damaged roads',
    ],
    donts: [
      'Do NOT stop on or under bridges, overpasses, or tunnels',
      'Do NOT park near buildings or power lines',
      'Do NOT rush to drive home — roads may be damaged',
      'Do NOT drive through standing water (may hide road damage)',
    ],
  },
  {
    icon: <BedIcon sx={{ fontSize: 40 }} />,
    emoji: '🛏️',
    titleKey: 'during.scenarios.bed.title',
    color: '#7B1FA2',
    dos: [
      'Stay in bed and cover your head with a pillow',
      'Hold onto the bed frame for stability',
      'Wait for the shaking to stop before getting up',
      'After shaking stops, carefully get up and check for hazards (broken glass, fallen objects)',
      'Put on shoes immediately to protect your feet from debris',
    ],
    donts: [
      'Do NOT try to get up and run — you may fall or step on broken glass',
      'Do NOT turn on lights (use a flashlight instead — sparks can ignite gas leaks)',
    ],
  },
  {
    icon: <WaterIcon sx={{ fontSize: 40 }} />,
    emoji: '🏖️',
    titleKey: 'during.scenarios.highrise.title',
    color: '#00838F',
    dos: [
      'Drop, Cover, and Hold On first — the shaking itself can be dangerous',
      'After shaking stops, move to high ground immediately (at least 30 meters above sea level)',
      'Move at least 2 km inland from the shoreline',
      'Listen for tsunami warnings on radio or emergency alerts',
      'If you see the ocean recede unusually far, treat it as a tsunami warning — move inland NOW',
      'Stay away from the coast for several hours after the earthquake',
    ],
    donts: [
      'Do NOT wait for an official warning if the ocean behaves strangely',
      'Do NOT go to the beach to watch for waves',
      'Do NOT return to low-lying areas until authorities say it\'s safe',
    ],
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
                      {scenario.dos.map((item) => (
                        <Box
                          component="li"
                          key={item}
                          sx={{
                            mb: 0.8,
                            '&::marker': { color: 'success.main' },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {item}
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
                      {scenario.donts.map((item) => (
                        <Box
                          component="li"
                          key={item}
                          sx={{
                            mb: 0.8,
                            '&::marker': { color: 'error.main' },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {item}
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
