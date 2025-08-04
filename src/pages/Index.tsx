import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRoleContext } from '@/context/RoleContext';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { QAWarningBanner } from '@/components/admin/QAWarningBanner';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getRoleDashboard } = useRoleContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !showSplash) {
      // Redirect to role-appropriate dashboard after splash
      const dashboardPath = getRoleDashboard();
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, showSplash, getRoleDashboard, navigate]);

  const handleEnterApp = () => {
    setShowSplash(false);
    if (isAuthenticated) {
      const dashboardPath = getRoleDashboard();
      navigate(dashboardPath, { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  };

  if (showSplash) {
    return (
      <div>
        <QAWarningBanner />
        <SplashScreen 
          onEnter={handleEnterApp}
          theme="dark"
          showConfetti={false}
        />
      </div>
    );
  }

  return null;
}