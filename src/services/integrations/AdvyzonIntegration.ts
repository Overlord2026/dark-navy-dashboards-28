import { supabase } from '@/integrations/supabase/client';

interface AdvyzonClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'prospect';
  totalAssets?: number;
  lastActivity?: string;
  portfolios?: AdvyzonPortfolio[];
}

interface AdvyzonPortfolio {
  id: string;
  name: string;
  value: number;
  performance: {
    ytd: number;
    oneYear: number;
    threeYear: number;
  };
  holdings: AdvyzonHolding[];
}

interface AdvyzonHolding {
  symbol: string;
  name: string;
  shares: number;
  marketValue: number;
  percentOfPortfolio: number;
}

export class AdvyzonIntegration {
  private baseUrl = 'https://api.advyzon.com/v1';

  async syncClients(): Promise<AdvyzonClient[]> {
    try {
      const { data, error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'sync_clients'
        }
      });

      if (error) throw error;

      // Store clients in our database
      const clients = data.clients || [];
      for (const client of clients) {
        await this.upsertClient(client);
      }

      return clients;
    } catch (error) {
      console.error('Failed to sync Advyzon clients:', error);
      throw new Error('Failed to sync client data from Advyzon');
    }
  }

  async getClient(clientId: string): Promise<AdvyzonClient> {
    try {
      const { data, error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'get_client',
          client_id: clientId
        }
      });

      if (error) throw error;
      return data.client;
    } catch (error) {
      console.error('Failed to fetch Advyzon client:', error);
      throw new Error('Failed to fetch client data');
    }
  }

  async getPortfolios(clientId: string): Promise<AdvyzonPortfolio[]> {
    try {
      const { data, error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'get_portfolios',
          client_id: clientId
        }
      });

      if (error) throw error;
      return data.portfolios || [];
    } catch (error) {
      console.error('Failed to fetch Advyzon portfolios:', error);
      throw new Error('Failed to fetch portfolio data');
    }
  }

  async updateClient(clientId: string, updates: Partial<AdvyzonClient>): Promise<AdvyzonClient> {
    try {
      const { data, error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'update_client',
          client_id: clientId,
          updates
        }
      });

      if (error) throw error;

      // Update our local database
      await this.upsertClient(data.client);
      
      return data.client;
    } catch (error) {
      console.error('Failed to update Advyzon client:', error);
      throw new Error('Failed to update client data');
    }
  }

  async createTask(clientId: string, task: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'create_task',
          client_id: clientId,
          task
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to create Advyzon task:', error);
      throw new Error('Failed to create task in Advyzon');
    }
  }

  private async upsertClient(client: AdvyzonClient): Promise<void> {
    try {
      // Store client data in analytics events for now
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'advyzon_client_sync',
          event_category: 'crm_integration',
          event_data: {
            advyzon_id: client.id,
            first_name: client.firstName,
            last_name: client.lastName,
            email: client.email,
            phone: client.phone,
            status: client.status,
            total_assets: client.totalAssets,
            last_activity: client.lastActivity
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to upsert client in database:', error);
      // Don't throw here - we want sync to continue for other clients
    }
  }

  async getConnectionStatus(): Promise<{ connected: boolean; lastSync?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('advyzon-integration', {
        body: {
          action: 'test_connection'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}

export const advyzonIntegration = new AdvyzonIntegration();