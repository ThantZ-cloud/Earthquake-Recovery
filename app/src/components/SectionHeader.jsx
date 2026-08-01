import { Box, Typography } from '@mui/material';

export default function SectionHeader({ emoji, title, intro }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 700 }}
      >
        {emoji} {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 750, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}
      >
        {intro}
      </Typography>
    </Box>
  );
}
