import { Box, Skeleton, Typography, CircularProgress } from '@mui/material';
import { useLang } from '../i18n';

const NAV_LINKS = ['Map', 'Learn', 'Recovery', 'Donate', 'Quiz', 'History'];

const LEGEND_COLORS = ['#2e7d32', '#f9a825', '#ed6c02', '#d32f2f'];

export default function AppBootSkeleton() {
  const { t } = useLang();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          height: { xs: 56, md: 64 },
          px: { xs: 2, lg: 4 },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Skeleton variant="text" width={{ xs: 110, sm: 170 }} height={32} />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, mx: 1 }}>
          {NAV_LINKS.map((label) => (
            <Skeleton key={label} variant="text" width={52} height={20} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Skeleton variant="circular" width={34} height={34} />
            <Skeleton variant="circular" width={34} height={34} />
          </Box>
          <Skeleton variant="circular" width={38} height={38} />
          <Skeleton variant="circular" width={38} height={38} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, ml: 0.5 }}>
            <Skeleton variant="rectangular" width={92} height={32} sx={{ borderRadius: 1.5 }} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1.5 }} />
          </Box>
        </Box>
      </Box>

      {/* Map area */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          bgcolor: 'action.hover',
          overflow: 'hidden',
          '@keyframes bootPulse': {
            '0%, 100%': { opacity: 0.45 },
            '50%': { opacity: 0.9 },
          },
          animation: 'bootPulse 1.6s ease-in-out infinite',
        }}
      >
        {/* Fake Leaflet zoom controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 2,
            overflow: 'hidden',
          }}
        >
          <Skeleton variant="rectangular" width={32} height={32} sx={{ transform: 'none' }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ transform: 'none' }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ transform: 'none' }} />
        </Box>

        {/* Centered loading indicator */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography color="text.secondary">{t('home.map.loading')}</Typography>
        </Box>

        {/* Legend chips */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: { xs: 'none', md: 'flex' },
            gap: 1.5,
            flexWrap: 'wrap',
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 2,
            zIndex: 1000,
            maxWidth: 'calc(100% - 32px)',
          }}
        >
          {LEGEND_COLORS.map((color) => (
            <Box key={color} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color }} />
              <Skeleton variant="text" width={72} height={16} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
