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
import { useLang } from '../i18n';

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
    emoji: '🎒',
    titleKey: 'before.sections.sec1.title',
    descKey: 'before.sections.sec1.desc',
    items: [
      'Water — at least 4 liters per person per day (3-day supply minimum)',
      'Non-perishable food — canned goods, energy bars, dried fruits, nuts',
      'First aid kit — bandages, antiseptic, pain relievers, prescription medications',
      'Flashlight and extra batteries (avoid candles due to fire risk)',
      'Battery-powered or hand-crank radio for emergency broadcasts',
      'Whistle to signal for help if trapped under debris',
      'Dust masks to filter contaminated air from debris',
      'Plastic sheeting and duct tape for temporary shelter',
      'Wrench or pliers to turn off gas and water valves',
      'Local maps (in case GPS/internet is unavailable)',
      'Cash in small denominations (ATMs may not work)',
      'Copies of important documents in a waterproof bag',
    ],
  },
  {
    emoji: '🏠',
    titleKey: 'before.sections.sec2.title',
    descKey: 'before.sections.sec2.desc',
    items: [
      'Anchor heavy furniture (bookcases, cabinets, wardrobes) to wall studs',
      'Secure water heater with metal straps to prevent gas leaks',
      'Install latches on cabinets to prevent items from falling out',
      'Move heavy objects to lower shelves',
      'Hang picture frames and mirrors away from beds and seating areas',
      'Repair defective electrical wiring and gas connections immediately',
      'Ensure your home is bolted to its foundation (older homes may not be)',
      'Store hazardous materials (cleaning chemicals, pesticides) on lower shelves in sealed containers',
      'Know where your gas, electric, and water shut-off valves are located',
    ],
  },
  {
    emoji: '👨‍👩‍👧‍👦',
    titleKey: 'before.sections.sec3.title',
    descKey: 'before.sections.sec3.desc',
    items: [
      'Identify safe spots in every room — under sturdy desks, against interior walls',
      'Choose two meeting points — one near home, one outside the neighborhood',
      'Designate an out-of-area contact person for family check-ins',
      'Know your children\'s school emergency plan and pickup procedures',
      'Plan for pets — include food, carriers, and veterinary records',
      'Practice "Drop, Cover, Hold On" drills with all family members',
      'Learn how to turn off gas, water, and electricity at main switches',
      'Keep a list of emergency phone numbers (police, fire, hospital, Red Cross)',
      'Store emergency contact info in every family member\'s phone',
    ],
  },
  {
    emoji: '⚠️',
    titleKey: 'before.sections.sec4.title',
    descKey: 'before.sections.sec4.desc',
    items: [
      'Research whether you live near an active fault line',
      'Check if your building meets current earthquake-resistant building codes',
      'Learn about local hazards — liquefaction zones, landslide-prone areas, tsunami risk',
      'Identify the safest evacuation routes from your home and workplace',
      'Know the location of the nearest emergency shelter',
      'Sign up for local earthquake early warning alerts if available',
      'Understand the difference between earthquake advisories and warnings',
      'Join your community\'s disaster preparedness program or CERT team',
    ],
  },
];

export default function BeforeEarthquake() {
  const theme = useTheme();
  const { t } = useLang();

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
            📋 {t('before.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            {t('before.intro')}
          </Typography>
        </motion.div>

        {/* Sections */}
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
                    {t(section.titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {t(section.descKey)}
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
      </Container>
    </Box>
  );
}
