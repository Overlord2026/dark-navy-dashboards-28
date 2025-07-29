import { Integration, IntegrationType, IntegrationStatus, IntegrationConnector, IntegrationConfig } from '@/types/integrations';
import { auditLog } from '@/services/auditLog/auditLogService';

class IntegrationService {
  private integrations = new Map<IntegrationType, Integration>();
  private connectors = new Map<IntegrationType, IntegrationConnector>();

  constructor() {
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    const defaultIntegrations: Integration[] = [
      {
        id: 'schwab-integration',
        type: 'schwab',
        name: 'Charles Schwab',
        description: 'Connect to Schwab custodial accounts for real-time portfolio data',
        status: 'disconnected',
        enabled: false
      },
      {
        id: 'advyzon-integration', 
        type: 'advyzon',
        name: 'Advyzon CRM',
        description: 'Sync client data with Advyzon portfolio management system',
        status: 'disconnected',
        enabled: false
      },
      {
        id: 'cpa-integration',
        type: 'cpa',
        name: 'CPA Tax Portal',
        description: 'Share financial data with CPA for tax planning and preparation',
        status: 'disconnected',
        enabled: false
      },
      {
        id: 'attorney-integration',
        type: 'attorney',
        name: 'Estate Attorney Portal',
        description: 'Collaborate on estate planning documents and strategies',
        status: 'disconnected',
        enabled: false
      }
    ];

    defaultIntegrations.forEach(integration => {
      this.integrations.set(integration.type, integration);
    });
  }

  getIntegration(type: IntegrationType): Integration | undefined {
    return this.integrations.get(type);
  }

  getAllIntegrations(): Integration[] {
    return Array.from(this.integrations.values());
  }

  async connectIntegration(type: IntegrationType, config: IntegrationConfig, userId: string): Promise<void> {
    const integration = this.integrations.get(type);
    if (!integration) {
      throw new Error(`Integration type ${type} not found`);
    }

    // Log connection attempt
    auditLog.log(userId, 'api_access', 'success', {
      action: 'integration_connect_attempt',
      resourceType: 'integration',
      resourceId: integration.id,
      details: {
        integrationType: type,
        integrationName: integration.name
      }
    });

    try {
      // Update status to connecting
      integration.status = 'connecting';
      this.integrations.set(type, integration);

      const connector = this.connectors.get(type);
      if (connector) {
        await connector.connect(config);
        integration.status = 'connected';
      } else {
        // TODO: Implement actual connector logic for each integration type
        throw new Error(`Connector for ${type} not implemented yet`);
      }

      auditLog.log(userId, 'api_access', 'success', {
        action: 'integration_connected',
        resourceType: 'integration',
        resourceId: integration.id,
        details: {
          integrationType: type,
          integrationName: integration.name
        }
      });

    } catch (error) {
      integration.status = 'error';
      integration.error = error instanceof Error ? error.message : 'Unknown error';
      
      auditLog.log(userId, 'api_access', 'failure', {
        action: 'integration_connect_failed',
        resourceType: 'integration', 
        resourceId: integration.id,
        error: integration.error,
        details: {
          integrationType: type,
          integrationName: integration.name
        }
      });

      throw error;
    } finally {
      this.integrations.set(type, integration);
    }
  }

  async disconnectIntegration(type: IntegrationType, userId: string): Promise<void> {
    const integration = this.integrations.get(type);
    if (!integration) {
      throw new Error(`Integration type ${type} not found`);
    }

    auditLog.log(userId, 'api_access', 'success', {
      action: 'integration_disconnect',
      resourceType: 'integration',
      resourceId: integration.id,
      details: {
        integrationType: type,
        integrationName: integration.name
      }
    });

    const connector = this.connectors.get(type);
    if (connector) {
      await connector.disconnect();
    }

    integration.status = 'disconnected';
    integration.error = undefined;
    this.integrations.set(type, integration);
  }

  isIntegrationEnabled(type: IntegrationType): boolean {
    const integration = this.integrations.get(type);
    return integration?.enabled || false;
  }

  setIntegrationEnabled(type: IntegrationType, enabled: boolean): void {
    const integration = this.integrations.get(type);
    if (integration) {
      integration.enabled = enabled;
      this.integrations.set(type, integration);
    }
  }
}

export const integrationService = new IntegrationService();