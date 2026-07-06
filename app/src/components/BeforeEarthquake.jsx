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
    itemsKey: 'before.sections.sec1.items',
    count: 12,
  },
  {
    emoji: '🏠',
    titleKey: 'before.sections.sec2.title',
    descKey: 'before.sections.sec2.desc',
    itemsKey: 'before.sections.sec2.items',
    count: 9,
  },
  {
    emoji: '👨‍👩‍👧‍👦',
    titleKey: 'before.sections.sec3.title',
    descKey: 'before.sections.sec3.desc',
    itemsKey: 'before.sections.sec3.items',
    count: 9,
  },
  {
    emoji: '⚠️',
    titleKey: 'before.sections.sec4.title',
    descKey: 'before.sections.sec4.desc',
    itemsKey: 'before.sections.sec4.items',
    count: 8,
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
      </Container>
    </Box>
  );
}
