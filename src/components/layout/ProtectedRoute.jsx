import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, allowedType }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedType && user.user_type && user.user_type !== allowedType) {
    return <Navigate to={user.user_type === 'student' ? '/deals' : '/dashboard'} replace />;
  }

  return children;
}
