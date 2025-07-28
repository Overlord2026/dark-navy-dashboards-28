import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRoleContext } from '@/context/RoleContext';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getRoleDashboard } = useRoleContext();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to role-appropriate dashboard
      const dashboardPath = getRoleDashboard();
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, getRoleDashboard, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Family Office Platform</h1>
      <p className="text-muted-foreground">
        Your comprehensive family office management solution.
      </p>
      {!isAuthenticated && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Please sign in to access your personalized dashboard.
          </p>
        </div>
      )}
    </div>
  );
}