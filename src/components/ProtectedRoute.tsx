import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMe } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchMe());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}