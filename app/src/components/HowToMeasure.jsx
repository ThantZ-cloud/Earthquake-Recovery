import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLang } from '../i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const fadeUpFast = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.01, duration: 0.2 },
  }),
};

const MAGNITUDE_SCALE = [
  { mag: '1–2', color: '#4caf50', key: 'micro' },
  { mag: '3–3.9', color: '#8bc34a', key: 'minor' },
  { mag: '4–4.9', color: '#ffeb3b', key: 'light' },
  { mag: '5–5.9', color: '#ff9800', key: 'moderate' },
  { mag: '6–6.9', color: '#ff5722', key: 'strong' },
  { mag: '7–7.9', color: '#f44336', key: 'major' },
  { mag: '8–8.9', color: '#d32f2f', key: 'great' },
  { mag: '9+', color: '#b71c1c', key: 'devastating' },
];

export default function HowToMeasure() {
  const theme = useTheme();
  const { t } = useLang();

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
            📏 {t('measure.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 750, mx: 'auto', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}
          >
            {t('measure.intro')}
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
                  📐 {t('measure.richter.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  {t('measure.richter.p1')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('measure.richter.p2')}
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
                  🔬 {t('measure.moment.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  {t('measure.moment.p1')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('measure.moment.p2')}
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
            🔢 {t('measure.scaleTitle')}
          </Typography>
        </motion.div>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {MAGNITUDE_SCALE.map((item, i) => (
            <motion.div
              key={item.mag}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              custom={i}
              variants={fadeUpFast}
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
                    {t(`measure.scale.${item.key}.label`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {t(`measure.scale.${item.key}.desc`)}
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
              💡 <strong>{t('measure.energyTitle')}:</strong> {t('measure.energyDesc')}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
