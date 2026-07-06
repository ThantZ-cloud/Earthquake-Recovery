import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import SafetyCharacter from './SafetyCharacter';
import { useLang } from '../i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const STEPS = [
  {
    type: 'drop',
    titleKey: 'safety.step1.title',
    descKey: 'safety.step1.desc',
    tipKey: 'safety.step1.tip',
  },
  {
    type: 'cover',
    titleKey: 'safety.step2.title',
    descKey: 'safety.step2.desc',
    tipKey: 'safety.step2.tip',
  },
  {
    type: 'holdOn',
    titleKey: 'safety.step3.title',
    descKey: 'safety.step3.desc',
    tipKey: 'safety.step3.tip',
  },
  {
    type: 'stayCalm',
    titleKey: 'safety.step4.title',
    descKey: 'safety.step4.desc',
    tipKey: 'safety.step4.tip',
  },
];

export default function SafetyGuide() {
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
          bottom: -120,
          right: -120,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: theme.palette.mode === 'dark' ? 'rgba(211,47,47,0.06)' : 'rgba(211,47,47,0.04)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
            🛡️ {t('safety.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 6,
              fontSize: '1.1rem',
              lineHeight: 1.8,
            }}
          >
            {t('safety.intro')}
          </Typography>
        </motion.div>

        {/* Safety steps */}
        <Grid container spacing={4} justifyContent="center">
          {STEPS.map((step, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.type}>
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
                    p: 3,
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
                  {/* Step number */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'grey.100',
                      mb: 2,
                      fontWeight: 600,
                      letterSpacing: 1,
                      color: 'text.secondary',
                    }}
                  >
                    STEP {i + 1}
                  </Typography>

                  {/* Safety icon */}
                  <Box sx={{ mb: 2 }}>
                    <SafetyCharacter type={step.type} />
                  </Box>

                  {/* Title */}
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {t(step.titleKey)}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                    {t(step.descKey)}
                  </Typography>

                  {/* Tip */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50',
                      textAlign: 'left',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      💡 <strong>Tip:</strong> {t(step.tipKey)}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Arrow connectors (desktop only) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 0,
            mt: -2,
            mb: 2,
            position: 'relative',
            zIndex: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: '25%',
                textAlign: 'center',
                fontSize: '1.5rem',
                color: 'text.disabled',
              }}
            >
              →
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
