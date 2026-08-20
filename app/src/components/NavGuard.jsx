import { Navigate, useLocation } from 'react-router-dom';
import { useNavItems } from '../hooks/useNavItems';

const PUBLIC_PATHS = new Set(['/admin']);

export default function NavGuard({ children }) {
  const location = useLocation();
  const { enabledPaths } = useNavItems();

  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath || PUBLIC_PATHS.has(location.pathname)) {
    return children;
  }

  if (!enabledPaths.has(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
