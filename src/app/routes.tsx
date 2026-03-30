import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import EnhancedParticipantDashboard from './pages/EnhancedParticipantDashboard';

// Auth Wrapper Component that can use hooks
const AuthWrapper = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  // This will be rendered within the Router context, so hooks work here
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Import useAuth here for the wrapper
import { useAuth } from './contexts/AuthContext';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: (
      <AuthWrapper allowedRoles={['admin']}>
        <AdminDashboard />
      </AuthWrapper>
    )
  },
  {
    path: '/judge',
    element: (
      <AuthWrapper allowedRoles={['judge']}>
        <JudgeDashboard />
      </AuthWrapper>
    )
  },
  {
    path: '/participant',
    element: (
      <AuthWrapper allowedRoles={['participant']}>
        <EnhancedParticipantDashboard />
      </AuthWrapper>
    )
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);