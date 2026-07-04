import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const SECTIONS = [
  {
    emoji: '🩹',
    title: 'Check for Injuries',
    desc: 'Your first priority after the shaking stops is to check yourself and others for injuries. Provide first aid where needed and call for emergency help.',
    items: [
      'Check yourself for injuries before helping others',
      'Check family members, neighbors, and people nearby',
      'Provide first aid for minor injuries — cuts, scrapes, bruises',
      'Call emergency services (ambulance, fire department) for serious injuries',
      'Do not move seriously injured people unless they are in immediate danger',
      'If someone is trapped, do not try to dig them out alone — call for professional rescue',
      'Cover injured people with blankets to prevent shock',
      'If trained, perform CPR on anyone who has stopped breathing',
    ],
  },
  {
    emoji: '🔄',
    title: 'Expect Aftershocks',
    desc: 'Aftershocks are smaller earthquakes that follow the main shock. They can occur minutes, hours, days, or even weeks later. Some aftershocks can be strong enough to cause additional damage to weakened structures.',
    items: [
      'Be ready to Drop, Cover, and Hold On again at any moment',
      'Aftershocks can be nearly as strong as the original earthquake',
      'Stay away from damaged buildings — aftershocks can cause them to collapse',
      'If you are in a damaged building, evacuate to an open area',
      'Sleep outside or in a vehicle if your home is damaged',
      'Keep your emergency kit accessible — you may need it again',
      'Stay informed through radio or emergency broadcasts',
    ],
  },
  {
    emoji: '⚠️',
    title: 'Check for Hazards',
    desc: 'Earthquakes can cause hidden hazards that aren\'t immediately visible. Gas leaks, electrical damage, and structural weaknesses can be deadly after the shaking stops.',
    items: [
      'Smell for gas — if you detect a leak, open windows, leave the building, and call the gas company',
      'Do NOT turn on lights, use matches, or create any spark if you smell gas',
      'Check for electrical damage — sparks, frayed wires, burning smell',
      'Turn off electricity at the main breaker if you see electrical damage',
      'Inspect your home for cracks in walls, foundation, and chimney',
      'Check for water leaks — broken pipes can cause flooding',
      'Do NOT use damaged appliances or utilities until inspected',
      'Watch for fallen power lines — stay at least 10 meters away',
      'Be cautious of broken glass, nails, and sharp debris on the ground',
    ],
  },
  {
    emoji: '📱',
    title: 'Communicate and Connect',
    desc: 'After an earthquake, communication networks may be overloaded. Use smart communication strategies to reach loved ones and get help.',
    items: [
      'Text messages are more reliable than phone calls during emergencies',
      'Use social media to mark yourself as "safe" (Facebook Safety Check, etc.)',
      'Call your out-of-area emergency contact to relay messages',
      'Conserve your phone battery — reduce screen brightness, close apps',
      'Listen to emergency radio for official instructions and updates',
      'Do not make non-emergency calls — keep lines open for rescue operations',
      'Check on neighbors, especially elderly, disabled, or those living alone',
      'If you have a working phone, share your location with family members',
    ],
  },
  {
    emoji: '🏗️',
    title: 'Rebuild and Recover',
    desc: 'Recovery from an earthquake takes time. Focus on safety first, then begin the process of rebuilding your life and community.',
    items: [
      'Do not re-enter damaged buildings until they have been inspected by professionals',
      'Document damage with photos and videos for insurance claims',
      'Contact your insurance company as soon as possible',
      'Keep receipts for all emergency expenses (temporary housing, food, repairs)',
      'Apply for disaster assistance from government and relief organizations',
      'Seek mental health support — earthquake trauma can cause PTSD, anxiety, and depression',
      'Join community recovery efforts — helping others helps you heal',
      'Learn from the experience — update your emergency plan and kit',
    ],
  },
];

const DONT_DO = [
  'Do not enter damaged buildings until cleared by authorities',
  'Do not drink tap water until officials confirm it\'s safe',
  'Do not use the toilet if sewage lines may be damaged',
  'Do not spread rumors — rely on official sources for information',
  'Do not return to coastal areas if a tsunami warning was issued',
  'Do not ignore boil-water advisories',
];

export default function AfterEarthquake() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.paper',
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
            🔄 After an Earthquake
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            The danger isn't over when the shaking stops. Aftershocks, gas leaks, structural
            damage, and other hazards can be just as deadly. Stay alert, check for injuries,
            and follow these steps to stay safe during recovery.
          </Typography>
        </motion.div>

        {/* Main sections */}
        <Grid container spacing={4}>
          {SECTIONS.map((section, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={section.title}>
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
                  <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 1 }}>
                    {section.emoji}
                  </Typography>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {section.desc}
                  </Typography>
                  <List dense>
                    {section.items.map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 20, color: 'success.main' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                            sx: { lineHeight: 1.6 },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* "Don't Do" warning box */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={6}
          variants={fadeUp}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(211,47,47,0.3)' : '#ffcdd2',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(211,47,47,0.08)' : '#FFF8F8',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              ⛔ Things to Avoid After an Earthquake
            </Typography>
            <List dense>
              {DONT_DO.map((item) => (
                <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CancelOutlinedIcon sx={{ fontSize: 20, color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary',
                      sx: { lineHeight: 1.6 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </motion.div>

        {/* Recovery link */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={7}
          variants={fadeUp}
        >
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(46,125,50,0.1)' : '#E8F5E9',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              💪 <strong>Need help with recovery?</strong> Visit our{' '}
              <Typography
                component="a"
                href="/recovery"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                Recovery Resources
              </Typography>{' '}
              page for detailed guides on short-term, mid-term, and long-term recovery.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
