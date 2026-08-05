import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function RequireSuperAdmin({ children }) {
  const { user, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
