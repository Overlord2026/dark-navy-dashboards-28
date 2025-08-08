import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useExtensionHealth } from '@/hooks/useExtensionHealth';

interface ExtensionHealthBannerProps {
  className?: string;
}

export const ExtensionHealthBanner: React.FC<ExtensionHealthBannerProps> = ({ 
  className = '' 
}) => {
  const { health, isLoading, error, hasIssues } = useExtensionHealth();

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

  if (!hasIssues) {
    return null; // Don't show banner when everything is working
  }

  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <div className="font-medium">
          Database Extension Access Issues Detected
        </div>
        <div className="text-sm space-y-1">
          {!health.graphql_accessible && (
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              <span>GraphQL schema access denied</span>
              <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
            </div>
          )}
          {!health.vault_accessible && (
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              <span>Vault extension access denied</span>
              <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
            </div>
          )}
          {health.graphql_version === 'access_denied' && (
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              <span>GraphQL version check failed</span>
              <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
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