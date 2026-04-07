import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'grower' | 'customer';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [roleChecked, setRoleChecked] = useState(!requiredRole);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (!requiredRole || !user) {
      setRoleChecked(true);
      return;
    }

    supabase
      .rpc('has_role', { _user_id: user.id, _role: requiredRole })
      .then(({ data }) => {
        setHasRole(!!data);
        setRoleChecked(true);
      });
  }, [user, requiredRole]);

  if (loading || !roleChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
