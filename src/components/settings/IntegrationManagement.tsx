import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureFlagManagement } from '@/components/admin/FeatureFlagManagement';
import { integrationService } from '@/services/integrations/IntegrationService';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings } from 'lucide-react';

export function IntegrationManagement() {
  const { user } = useAuth();
  const integrations = integrationService.getAllIntegrations();
  
  // Only show to system administrators
  if (!user || user.user_metadata?.role !== 'system_administrator') {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Management
          </CardTitle>
          <CardDescription>
            Manage external partner integrations and feature flags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium mb-4">Available Integrations</h4>
            <div className="grid gap-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.enabled ? "default" : "secondary"}>
                      {integration.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant="outline">
                      {integration.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FeatureFlagManagement />
    </div>
  );
}