import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useExtensionHealth } from '@/hooks/useExtensionHealth';
import { useAuth } from '@/context/AuthContext';

interface ExtensionHealthBannerProps {
  className?: string;
}

export const ExtensionHealthBanner: React.FC<ExtensionHealthBannerProps> = ({ 
  className = '' 
}) => {
  const { health, isLoading, error } = useExtensionHealth();
  const { userProfile } = useAuth();
  
  // Check if user is admin
  const isAdmin = userProfile?.role && ['admin', 'system_administrator', 'tenant_admin'].includes(userProfile.role);
  
  // Only show banner for admins
  const showBanner = isAdmin && health && (!health.graphqlOk || !health.vaultOk);
  const level = !health?.graphqlOk ? "critical" : (!health?.vaultOk ? "info" : "none");

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (error || !health) {
    return (
      <Alert variant="destructive" className={`mb-4 ${className}`}>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to check extension health: {error || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!showBanner) {
    return null; // Don't show banner when everything is working or user is not admin
  }

  const alertVariant = level === "critical" ? "destructive" : "default";

  return (
    <Alert variant={alertVariant} className={`mb-4 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <div className="font-medium">
          Database Extension Access Issues Detected
        </div>
        <div className="text-sm space-y-1">
          {!health.graphqlOk && (
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              <span>GraphQL extension not configured</span>
              <Badge variant="secondary" className="text-xs">
                {level === "critical" ? "CRITICAL" : "INFO"}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <strong>Admin Action Required:</strong> Run database grants to restore extension access.
          Extensions are accessed through public wrappers; do not call extension schemas directly.
        </div>
      </AlertDescription>
    </Alert>
  );
};