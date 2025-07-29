import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IntegrationConnectButton } from './IntegrationConnectButton';
import { integrationService } from '@/services/integrations/IntegrationService';
import { ExternalLink } from 'lucide-react';

interface IntegrationsPanelProps {
  title?: string;
  description?: string;
}

export function IntegrationsPanel({ 
  title = "Partner Integrations",
  description = "Connect with your financial services partners"
}: IntegrationsPanelProps) {
  const integrations = integrationService.getAllIntegrations();
  const enabledIntegrations = integrations.filter(integration => 
    integrationService.isIntegrationEnabled(integration.type)
  );

  if (enabledIntegrations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {enabledIntegrations.map((integration) => (
            <div key={integration.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              <IntegrationConnectButton 
                integrationType={integration.type}
                variant="outline"
                size="sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}