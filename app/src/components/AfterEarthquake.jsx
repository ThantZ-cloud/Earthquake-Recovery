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
    emoji: '🩹',
    titleKey: 'after.sections.sec1.title',
    descKey: 'after.sections.sec1.desc',
    itemsKey: 'after.sections.sec1.items',
    count: 8,
  },
  {
    emoji: '🔄',
    titleKey: 'after.sections.sec2.title',
    descKey: 'after.sections.sec2.desc',
    itemsKey: 'after.sections.sec2.items',
    count: 7,
  },
  {
    emoji: '⚠️',
    titleKey: 'after.sections.sec3.title',
    descKey: 'after.sections.sec3.desc',
    itemsKey: 'after.sections.sec3.items',
    count: 9,
  },
  {
    emoji: '📱',
    titleKey: 'after.sections.sec4.title',
    descKey: 'after.sections.sec4.desc',
    itemsKey: 'after.sections.sec4.items',
    count: 8,
  },
  {
    emoji: '🏗️',
    titleKey: 'after.sections.sec5.title',
    descKey: 'after.sections.sec5.desc',
    itemsKey: 'after.sections.sec5.items',
    count: 8,
  },
];

const DONT_DO_COUNT = 6;

export default function AfterEarthquake() {
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
            🔄 {t('after.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            {t('after.intro')}
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
                    {t(section.titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {t(section.descKey)}
                  </Typography>
                  <List dense>
                    {Array.from({ length: section.count }, (_, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 20, color: 'success.main' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={t(`${section.itemsKey}.${i}`)}
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
              ⛔ {t('after.avoidTitle')}
            </Typography>
            <List dense>
              {Array.from({ length: DONT_DO_COUNT }, (_, i) => (
                <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CancelOutlinedIcon sx={{ fontSize: 20, color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`after.dontDo.${i}`)}
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
