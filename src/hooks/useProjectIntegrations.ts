import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectConnection {
  id: string;
  name: string;
  type: 'crm' | 'portfolio' | 'dms' | 'compliance' | 'other';
  status: 'active' | 'connecting' | 'error' | 'disconnected';
  lastSync?: Date;
  description?: string;
  metadata?: Record<string, any>;
}

export interface APIIntegration {
  id: string;
  name: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  authMethod: 'oauth' | 'api_key' | 'bearer';
  rateLimit?: {
    limit: number;
    used: number;
    resetTime?: Date;
  };
  usage?: {
    requests: number;
    period: string;
  };
}

export const useProjectIntegrations = () => {
  const [connections, setConnections] = useState<ProjectConnection[]>([]);
  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      // For now, using mock data. In production, this would fetch from Supabase
      const mockConnections: ProjectConnection[] = [
        {
          id: '1',
          name: 'Family Office Dashboard',
          type: 'other',
          status: 'active',
          lastSync: new Date(),
          description: 'Main administrative interface'
        },
        {
          id: '2', 
          name: 'Advisory Portal',
          type: 'crm',
          status: 'active',
          lastSync: new Date(Date.now() - 3600000),
          description: 'Professional advisor interface'
        },
        {
          id: '3',
          name: 'Compliance Engine',
          type: 'compliance',
          status: 'connecting',
          description: 'Regulatory compliance monitoring'
        }
      ];

      const mockApiIntegrations: APIIntegration[] = [
        {
          id: '1',
          name: 'Supabase Auth',
          endpoint: 'https://xcmqjkvyvuhoslbzmlgi.supabase.co',
          status: 'healthy',
          authMethod: 'bearer',
          usage: { requests: 2456, period: 'today' }
        },
        {
          id: '2',
          name: 'Supabase Database', 
          endpoint: 'https://xcmqjkvyvuhoslbzmlgi.supabase.co',
          status: 'healthy',
          authMethod: 'bearer',
          usage: { requests: 8923, period: 'today' }
        },
        {
          id: '3',
          name: 'Market Data API',
          endpoint: 'api.marketdata.com/v1',
          status: 'degraded',
          authMethod: 'api_key',
          rateLimit: { limit: 10000, used: 7800, resetTime: new Date(Date.now() + 86400000) }
        }
      ];

      setConnections(mockConnections);
      setApiIntegrations(mockApiIntegrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectProject = async (projectType: string) => {
    // Implementation for connecting new project
    console.log('Connecting project:', projectType);
  };

  const disconnectProject = async (connectionId: string) => {
    // Implementation for disconnecting project
    console.log('Disconnecting project:', connectionId);
  };

  const testApiIntegration = async (integrationId: string) => {
    // Implementation for testing API connection
    console.log('Testing API integration:', integrationId);
  };

  return {
    connections,
    apiIntegrations,
    loading,
    connectProject,
    disconnectProject,
    testApiIntegration,
    refresh: loadIntegrations
  };
};