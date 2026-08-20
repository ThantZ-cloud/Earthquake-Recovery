import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  if (!user || (!isAdmin && !isSuperAdmin)) return <Navigate to="/" replace />;

  return children;
}
