import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { runtimeFlags } from '@/config/runtimeFlags';
import { AlertTriangle, Mail, Settings } from 'lucide-react';

interface AdminEmailBannerProps {
  isAdmin?: boolean;
  className?: string;
}

export const AdminEmailBanner: React.FC<AdminEmailBannerProps> = ({ 
  isAdmin = false, 
  className = "" 
}) => {
  // Only show to admins when email is disabled
  if (!isAdmin || runtimeFlags.emailEnabled) {
    return null;
  }

  const handleConfigureEmail = () => {
    // Navigate to admin settings or show configuration modal
    console.log('Navigate to email configuration');
  };

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-orange-600" />
          <span className="text-orange-800">
            <strong>Email delivery is disabled</strong> (no secrets configured). 
            Add SENDGRID_API_KEY and FROM_EMAIL to enable notifications.
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleConfigureEmail}
          className="border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
      </AlertDescription>
    </Alert>
  );
};