import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireSuperAdmin({ children }) {
  const { user, isSuperAdmin } = useAuth();

  if (!user || !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
