import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoleContext } from '@/context/RoleContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

export function Global404Handler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRoleDashboard } = useRoleContext();

  const attemptedPath = location.pathname;

  useEffect(() => {
    // Log 404 for analytics
    console.warn(`404 Error: User attempted to access ${attemptedPath}`);
    
    // Auto-redirect after 10 seconds to dashboard
    const timer = setTimeout(() => {
      const dashboardPath = getRoleDashboard();
      navigate(dashboardPath, { replace: true });
    }, 10000);

    return () => clearTimeout(timer);
  }, [attemptedPath, navigate, getRoleDashboard]);

  const handleGoToDashboard = () => {
    const dashboardPath = getRoleDashboard();
    navigate(dashboardPath, { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const suggestedRoutes = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/education', label: 'Education Center', icon: Search },
    { path: '/wealth', label: 'Wealth Management', icon: Search },
    { path: '/settings', label: 'Settings', icon: Search },
    { path: '/help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error Icon & Status */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <DashboardHeader 
            heading="Page Not Found" 
            text="The page you're looking for doesn't exist or has been moved"
          />
        </div>

        {/* Attempted Path Info */}
        <div className="bg-muted/50 border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">You tried to access:</p>
          <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
            {attemptedPath}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={handleGoToDashboard}
            className="flex items-center gap-2"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Suggested Routes */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Try one of these popular pages:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Button
                  key={route.path}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate(route.path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {route.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Auto-redirect Notice */}
        <div className="text-sm text-muted-foreground">
          <p>You'll be automatically redirected to your dashboard in 10 seconds.</p>
        </div>
      </div>
    </div>
  );
}