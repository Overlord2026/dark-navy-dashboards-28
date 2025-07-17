import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type TenantRow = Database['public']['Tables']['tenants']['Row'];
type TenantSettingsRow = Database['public']['Tables']['tenant_settings']['Row'];

export interface Tenant {
  id: string;
  name: string;
  brand_logo_url?: string | null;
  color_palette?: {
    primary: string;
    accent: string;
    secondary: string;
  } | null;
  domain?: string | null;
  billing_status: 'trial' | 'active' | 'delinquent' | 'suspended';
  franchisee_status: 'owned' | 'licensed' | 'franchisee';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  id: string;
  tenant_id: string;
  branding_config: any;
  feature_flags: any;
  email_templates: any;
  custom_css?: string | null;
  about_config?: {
    company_mission?: string;
    company_values?: string;
    company_history?: string;
    team_description?: string;
    contact_info?: string;
    office_locations?: string;
    certifications?: string;
    investment_philosophy?: string;
  } | null;
}

export const useTenant = () => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCurrentTenant();
    }
  }, [user]);

  const fetchCurrentTenant = async () => {
    try {
      setLoading(true);
      
      // Get user's profile to find their tenant_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.tenant_id) throw new Error('No tenant associated with user');

      // Get tenant details
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single();

      if (tenantError) throw tenantError;

      // Get tenant settings
      const { data: settings, error: settingsError } = await supabase
        .from('tenant_settings')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // Transform the tenant data to match our interface
      const transformedTenant: Tenant = {
        ...tenant,
        color_palette: tenant.color_palette as Tenant['color_palette'],
        billing_status: tenant.billing_status as Tenant['billing_status'],
        franchisee_status: tenant.franchisee_status as Tenant['franchisee_status'],
        status: tenant.status as Tenant['status']
      };

      setCurrentTenant(transformedTenant);
      setTenantSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant');
    } finally {
      setLoading(false);
    }
  };

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', currentTenant.id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedTenant: Tenant = {
        ...data,
        color_palette: data.color_palette as Tenant['color_palette'],
        billing_status: data.billing_status as Tenant['billing_status'],
        franchisee_status: data.franchisee_status as Tenant['franchisee_status'],
        status: data.status as Tenant['status']
      };
      
      setCurrentTenant(transformedTenant);
      return transformedTenant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tenant');
      throw err;
    }
  };

  const updateTenantSettings = async (updates: Partial<TenantSettings>) => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenant_settings')
        .upsert({
          tenant_id: currentTenant.id,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;
      
      setTenantSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tenant settings');
      throw err;
    }
  };

  return {
    currentTenant,
    tenantSettings,
    loading,
    error,
    updateTenant,
    updateTenantSettings,
    refetch: fetchCurrentTenant
  };
};