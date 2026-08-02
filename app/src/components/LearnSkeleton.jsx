import { Box, Skeleton, Container } from '@mui/material';

export default function LearnSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <Box sx={{ height: { xs: 200, md: 300 }, bgcolor: 'action.hover', position: 'relative', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" height="100%" sx={{ bgcolor: 'rgba(255,255,255,0.05)', transform: 'none' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={300} height={24} sx={{ mx: 'auto' }} />
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Section 1 */}
        <Skeleton variant="text" width={250} height={36} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 5 }}>
          <Skeleton variant="rounded" width="50%" height={120} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width="50%" height={120} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Section 2 */}
        <Skeleton variant="text" width={280} height={36} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
        <Box sx={{ mt: 3, mb: 5 }}>
          <Skeleton variant="rounded" width="100%" height={160} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Section 3 */}
        <Skeleton variant="text" width={220} height={36} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={{ xs: '100%', sm: '30%' }} height={100} sx={{ borderRadius: 2 }} />
          ))}
        </Box>

        {/* Section 4 */}
        <Skeleton variant="text" width={260} height={36} sx={{ mb: 2, mt: 4 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="85%" height={20} />
      </Container>
    </Box>
  );
}
