import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const next =
    window.location.pathname + window.location.search + window.location.hash;

  if (isLoading) return <Loading fullPage />;
  if (!isAuthenticated)
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  return <>{children}</>;
}
