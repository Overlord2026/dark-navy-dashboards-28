import { useState, useCallback } from 'react';
import { useEdgeFunction } from './useEdgeFunction';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlatformConnector {
  id: string;
  platform_name: 'quickbooks' | 'xero' | 'cch' | 'drake' | 'lacerte';
  connector_type: 'csv' | 'excel' | 'api_oauth';
  is_active: boolean;
  configuration: Record<string, any>;
  field_mappings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ImportHistory {
  id: string;
  operation_type: 'import' | 'export';
  file_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rolled_back';
  records_processed: number;
  records_failed: number;
  started_at: string;
  completed_at?: string;
  error_details?: any;
}

export interface FieldMapping {
  platform_name: string;
  data_type: string;
  source_fields: Record<string, string>;
  target_fields: Record<string, string>;
  default_mapping: Record<string, string>;
}

export function usePlatformConnectors() {
  const [connectors, setConnectors] = useState<PlatformConnector[]>([]);
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [loading, setLoading] = useState(false);

  const { invoke: invokeImport } = useEdgeFunction('platform-import');
  const { toast } = useToast();

  const loadConnectors = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_connectors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnectors(data || []);
    } catch (error) {
      console.error('Error loading connectors:', error);
      toast({
        title: "Error",
        description: "Failed to load platform connectors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadImportHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('import_export_history')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setImportHistory(data || []);
    } catch (error) {
      console.error('Error loading import history:', error);
      toast({
        title: "Error",
        description: "Failed to load import history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadFieldMappings = useCallback(async (platform?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('platform_field_mappings')
        .select('*');

      if (platform) {
        query = query.eq('platform_name', platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFieldMappings(data || []);
    } catch (error) {
      console.error('Error loading field mappings:', error);
      toast({
        title: "Error",
        description: "Failed to load field mappings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createConnector = useCallback(async (connectorData: Partial<PlatformConnector>) => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('platform_connectors')
        .insert({
          ...connectorData,
          created_by: userData.user.id,
          tenant_id: userData.user.user_metadata?.tenant_id
        })
        .select()
        .single();

      if (error) throw error;

      setConnectors(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Platform connector created successfully"
      });

      return data;
    } catch (error) {
      console.error('Error creating connector:', error);
      toast({
        title: "Error",
        description: "Failed to create platform connector",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateConnector = useCallback(async (id: string, updates: Partial<PlatformConnector>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_connectors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setConnectors(prev => 
        prev.map(conn => conn.id === id ? { ...conn, ...data } : conn)
      );

      toast({
        title: "Success",
        description: "Connector updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Error updating connector:', error);
      toast({
        title: "Error",
        description: "Failed to update connector",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const processFileImport = useCallback(async (
    connectorId: string,
    file: File,
    mappings: Record<string, string>
  ) => {
    setLoading(true);
    try {
      const fileContent = await file.text();
      const { data: userData } = await supabase.auth.getUser();
      
      const response = await invokeImport({
        action: 'process_file_import',
        connectorId,
        fileContent,
        fileName: file.name,
        mappings,
        userId: userData.user?.id,
        tenantId: userData.user?.user_metadata?.tenant_id
      });

      if (response.success) {
        toast({
          title: "Success",
          description: `Import completed. ${response.data.recordsProcessed} records processed.`
        });
        await loadImportHistory();
      }

      return response.data;
    } catch (error) {
      console.error('Error processing file import:', error);
      toast({
        title: "Error",
        description: "Failed to process file import",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [invokeImport, toast, loadImportHistory]);

  const initiateOAuth = useCallback(async (
    platform: string,
    connectorId: string,
    redirectUri: string
  ) => {
    setLoading(true);
    try {
      const response = await invokeImport({
        action: 'initiate_oauth',
        platform,
        connectorId,
        redirectUri
      });

      if (response.success) {
        // Redirect to OAuth provider
        window.location.href = response.data.authUrl;
      }

      return response.data;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast({
        title: "Error",
        description: "Failed to initiate OAuth authorization",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [invokeImport, toast]);

  const handleOAuthCallback = useCallback(async (
    code: string,
    state: string,
    platform: string
  ) => {
    setLoading(true);
    try {
      const response = await invokeImport({
        action: 'oauth_callback',
        code,
        state,
        platform
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "OAuth authorization completed successfully"
        });
        await loadConnectors();
      }

      return response.data;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      toast({
        title: "Error",
        description: "OAuth authorization failed",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [invokeImport, toast, loadConnectors]);

  const syncPlatformData = useCallback(async (
    connectorId: string,
    dataTypes: string[]
  ) => {
    setLoading(true);
    try {
      const response = await invokeImport({
        action: 'sync_platform_data',
        connectorId,
        dataTypes
      });

      if (response.success) {
        const successCount = response.data.results.filter((r: any) => r.status === 'success').length;
        toast({
          title: "Success",
          description: `Synced ${successCount} data types successfully`
        });
        await loadImportHistory();
      }

      return response.data;
    } catch (error) {
      console.error('Error syncing platform data:', error);
      toast({
        title: "Error",
        description: "Failed to sync platform data",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [invokeImport, toast, loadImportHistory]);

  const rollbackImport = useCallback(async (historyId: string) => {
    setLoading(true);
    try {
      const response = await invokeImport({
        action: 'rollback_import',
        historyId
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Import rolled back successfully"
        });
        await loadImportHistory();
      }

      return response.data;
    } catch (error) {
      console.error('Error rolling back import:', error);
      toast({
        title: "Error",
        description: "Failed to rollback import",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [invokeImport, toast, loadImportHistory]);

  return {
    connectors,
    importHistory,
    fieldMappings,
    loading,
    loadConnectors,
    loadImportHistory,
    loadFieldMappings,
    createConnector,
    updateConnector,
    processFileImport,
    initiateOAuth,
    handleOAuthCallback,
    syncPlatformData,
    rollbackImport
  };
}