import { Box, Skeleton, Container } from '@mui/material';

export default function HomeSkeleton() {
  return (
    <Box>
      {/* Hero skeleton */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mt: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mt: 3, bgcolor: 'rgba(255,255,255,0.08)' }} />
          <Skeleton variant="text" width="50%" height={24} sx={{ mx: 'auto', mt: 0.5, bgcolor: 'rgba(255,255,255,0.08)' }} />
          <Skeleton variant="rounded" width={180} height={48} sx={{ mx: 'auto', mt: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        </Container>
      </Box>

      {/* Map skeleton */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Skeleton variant="text" width="35%" height={40} sx={{ mx: 'auto', mb: 1 }} />
          <Skeleton variant="text" width="55%" height={24} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rounded" height="62vh" sx={{ borderRadius: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" width={100} height={20} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Alert section skeleton */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="text" width="70%" height={40} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mx: 'auto', mt: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width="75%" height={20} sx={{ mx: 'auto', mt: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="rounded" width={220} height={48} sx={{ mx: 'auto', mt: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }} />
        </Container>
      </Box>

      {/* Educational sections skeleton */}
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ py: 8, bgcolor: i % 2 === 0 ? 'background.default' : 'background.paper' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Skeleton variant="text" width="45%" height={40} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mx: 'auto', mb: 4 }} />
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} variant="rounded" width={200} height={140} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Container>
        </Box>
      ))}
    </Box>
  );
}
