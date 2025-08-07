import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function EnvironmentIndicator() {
  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || 
                       hostname.includes('lovableproject.com') ||
                       hostname.includes('my.bfocfo.com');

  const getEnvironmentInfo = () => {
    if (hostname === 'localhost') {
      return {
        env: 'Local Development',
        color: 'bg-blue-500',
        icon: <Info className="h-4 w-4" />,
        message: 'Running on localhost - Development environment'
      };
    } else if (hostname.includes('lovableproject.com')) {
      return {
        env: 'Lovable Preview',
        color: 'bg-purple-500',
        icon: <Info className="h-4 w-4" />,
        message: 'Preview environment - QA mode active'
      };
    } else if (hostname.includes('my.bfocfo.com')) {
      return {
        env: 'Staging/QA',
        color: 'bg-yellow-500',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'QA environment - Testing mode active'
      };
    } else {
      return {
        env: 'Production',
        color: 'bg-green-500',
        icon: <CheckCircle className="h-4 w-4" />,
        message: 'Production environment - Full security active'
      };
    }
  };

  const envInfo = getEnvironmentInfo();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert className="w-80 border-2">
        <div className="flex items-center gap-2">
          {envInfo.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Environment:</span>
              <Badge className={`text-white ${envInfo.color}`}>
                {envInfo.env}
              </Badge>
            </div>
            <AlertDescription className="text-sm">
              {envInfo.message}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}