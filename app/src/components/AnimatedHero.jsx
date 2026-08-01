import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * About-style animated hero: gradient background, floating blobs,
 * scroll parallax, pulsing icon ring, and gradient title text.
 */
export default function AnimatedHero({ icon, title, subtitle, bg, accent, blobs }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        py: { xs: 10, md: 16 },
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)`,
        }}
      />

      {/* Floating blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, blob.dx, blob.dx * -0.6, 0], y: [0, blob.dy, blob.dy * -0.6, 0] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: blob.width,
            height: blob.height,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: `blur(${blob.blur}px)`,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
          }}
        />
      ))}

      <motion.div style={{ y: heroY, opacity: heroOpacity }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(accent, 0.2),
                mb: 3,
                position: 'relative',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: alpha(accent, 0.5),
                }}
              />
              {icon}
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 900,
                mb: 2,
                background: `linear-gradient(135deg, #fff 0%, ${accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          </motion.div>
        </Container>
      </motion.div>
    </Box>
  );
}
