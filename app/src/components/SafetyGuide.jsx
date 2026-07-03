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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const STEPS = [
  {
    type: 'drop',
    title: 'DROP',
    desc: 'As soon as you feel shaking, get down on your hands and knees. This prevents you from being knocked down and allows you to crawl to safety. Do this immediately — don\'t wait to assess the situation.',
    tip: 'If you\'re in a wheelchair, lock the wheels and bend forward, covering your head with your arms.',
  },
  {
    type: 'cover',
    title: 'COVER',
    desc: 'Take cover under a sturdy desk, table, or furniture. If nothing is available, crouch against an interior wall and protect your head and neck with your arms. Stay away from windows, mirrors, and heavy objects that could fall.',
    tip: 'If you\'re in bed, stay there and cover your head with a pillow. Moving around in the dark increases injury risk.',
  },
  {
    type: 'holdOn',
    title: 'HOLD ON',
    desc: 'Hold on to your shelter (desk, table, or furniture) and be prepared to move with it until the shaking stops. If there\'s nothing to hold on to, keep protecting your head and neck with your arms and hands.',
    tip: 'The shaking may last anywhere from a few seconds to over a minute. Stay in position until it completely stops.',
  },
  {
    type: 'stayCalm',
    title: 'STAY CALM',
    desc: 'Panicking leads to poor decisions. Take deep breaths and focus on what you need to do. After the shaking stops, check yourself and others for injuries. Be prepared for aftershocks — they can be strong enough to cause additional damage.',
    tip: 'Count slowly to 60 after the shaking stops. This helps you stay calm and gives debris time to settle before you move.',
  },
];

export default function SafetyGuide() {
  const theme = useTheme();

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
            🛡️ Earthquake Safety Guide
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
            When an earthquake strikes, every second counts. Follow these four steps to
            protect yourself and minimize injury. Practice them regularly so they become
            second nature.
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
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                    {step.desc}
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
                      💡 <strong>Tip:</strong> {step.tip}
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
