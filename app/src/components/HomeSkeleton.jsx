import { Box, Skeleton } from '@mui/material';

export default function HomeSkeleton() {
  return (
    <Box sx={{ height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' } }}>
      <Skeleton
        variant="rectangular"
        height="100%"
        sx={{ bgcolor: 'action.hover', transform: 'none' }}
      />
    </Box>
  );
}
