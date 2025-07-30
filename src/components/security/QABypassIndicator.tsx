import React from 'react';
import { useAuth } from '@/components/auth/AuthContextWrapper';
import { Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getEnvironmentConfig } from '@/utils/environment';

export const QABypassIndicator: React.FC = () => {
  const { isQABypassActive, userProfile } = useAuth();
  const env = getEnvironmentConfig();

  if (!isQABypassActive || env.isProduction) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant="destructive" 
        className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg animate-pulse"
      >
        <AlertTriangle className="h-3 w-3 mr-1" />
        QA Bypass Active
      </Badge>
      <div className="mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md shadow">
        <Shield className="h-3 w-3 inline mr-1" />
        Sandbox Mode - Auth Relaxed
      </div>
    </div>
  );
};