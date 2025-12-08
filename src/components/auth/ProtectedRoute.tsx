import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};
