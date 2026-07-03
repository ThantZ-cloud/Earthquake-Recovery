import { Box, Container, Skeleton, Stack } from '@mui/material';

/* ─── Reusable pieces ─── */

function HeroSkeleton({ color = '#37474f' }) {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Skeleton variant="circular" width={52} height={52} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.15)' }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.15)' }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.12)' }} />
      </Container>
    </Box>
  );
}

function TabBarSkeleton({ count = 3 }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, py: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
      ))}
    </Box>
  );
}

function CardSkeleton({ height = 200 }) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      sx={{ borderRadius: 3 }}
    />
  );
}

/* ─── Page variants ─── */

function HomeSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSkeleton color="#263238" />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Map placeholder */}
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3, mb: 6 }} />
        {/* 3-column cards */}
        <Stack direction="row" spacing={3}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <CardSkeleton height={260} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function RecoverySkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSkeleton color="#1b5e20" />
      <TabBarSkeleton count={3} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 2-column cards */}
        <Stack direction="row" spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} height={240} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} height={240} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function HistorySkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSkeleton color="#263238" />
      <TabBarSkeleton count={2} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filter bar */}
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: 3, mb: 4 }} />
        {/* 3-column masonry-ish */}
        <Stack direction="row" spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[280, 200, 260].map((h, i) => (
                <CardSkeleton key={i} height={h} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[220, 300, 180].map((h, i) => (
                <CardSkeleton key={i} height={h} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {[250, 220, 280].map((h, i) => (
                <CardSkeleton key={i} height={h} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function QuizSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSkeleton color="#4a148c" />
      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Progress bar */}
        <Skeleton variant="rounded" height={8} sx={{ borderRadius: 4, mb: 2 }} />
        {/* Stepper dots */}
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="circular" width={24} height={24} />
          ))}
        </Stack>
        {/* Question card */}
        <Skeleton variant="rounded" height={36} sx={{ mb: 1, borderRadius: 1 }} />
        <Skeleton variant="rounded" height={28} sx={{ mb: 3, width: '60%', borderRadius: 1 }} />
        <Stack spacing={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
        {/* Buttons */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Skeleton variant="rounded" width={80} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
        </Stack>
      </Container>
    </Box>
  );
}

function DonateSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSkeleton color="#b71c1c" />
      <TabBarSkeleton count={3} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 4-column cards */}
        <Stack direction="row" spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <CardSkeleton height={180} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

/* ─── Main export ─── */

const SKELETONS = {
  home: HomeSkeleton,
  recovery: RecoverySkeleton,
  history: HistorySkeleton,
  quiz: QuizSkeleton,
  donate: DonateSkeleton,
};

export default function PageSkeleton({ variant = 'home' }) {
  const Component = SKELETONS[variant] || HomeSkeleton;
  return <Component />;
}
