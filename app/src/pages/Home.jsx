import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useLang } from '../i18n';

const EarthquakeMap = lazy(() => import('../components/EarthquakeMap'));

export default function Home() {
  const { t } = useLang();

  const legendItems = [
    { color: '#2e7d32', label: t('home.map.legend.minor') },
    { color: '#f9a825', label: t('home.map.legend.light') },
    { color: '#ed6c02', label: t('home.map.legend.moderate') },
    { color: '#d32f2f', label: t('home.map.legend.strong') },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' },
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              bgcolor: 'action.hover',
            }}
          >
            <CircularProgress size={40} />
            <Typography color="text.secondary">{t('home.map.loading')}</Typography>
          </Box>
        }
      >
        <EarthquakeMap height="100%" />
      </Suspense>

      {/* Legend overlay */}
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
        {legendItems.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
