import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Tenant {
  id: string;
  name: string;
  status: string;
  billing_status?: string;
  franchisee_status?: string;
  domain?: string;
  brand_logo_url?: string;
  color_palette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface TenantSettings {
  id: string;
  tenant_id: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  custom_domain?: string;
  subdomain?: string;
  email_templates?: any;
  smtp_settings?: any;
  created_at?: string;
  updated_at?: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenantSettings: TenantSettings | null;
  isLoading: boolean;
  refreshTenant: () => Promise<void>;
  applyTenantBranding: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchTenant = async () => {
    if (!userProfile?.tenant_id) {
      setCurrentTenant(null);
      setTenantSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch tenant data
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userProfile.tenant_id)
        .single();

      if (tenantError) {
        console.error('Error fetching tenant:', tenantError);
        setCurrentTenant(null);
        setTenantSettings(null);
        return;
      }

      // Fetch tenant settings
      const { data: settings, error: settingsError } = await supabase
        .from('tenant_settings')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching tenant settings:', settingsError);
      }

      // Transform tenant data to match interface
      const transformedTenant: Tenant = {
        ...tenant,
        color_palette: tenant.color_palette as Tenant['color_palette']
      };
      
      setCurrentTenant(transformedTenant);
      setTenantSettings(settings);
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setCurrentTenant(null);
      setTenantSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTenantBranding = () => {
    if (!tenantSettings) return;

    const root = document.documentElement;
    
    // Apply custom colors to CSS variables
    if (tenantSettings.primary_color) {
      root.style.setProperty('--primary', tenantSettings.primary_color);
    }
    if (tenantSettings.secondary_color) {
      root.style.setProperty('--secondary', tenantSettings.secondary_color);
    }
    if (tenantSettings.accent_color) {
      root.style.setProperty('--accent', tenantSettings.accent_color);
    }

    // Apply custom favicon if logo_url exists
    if (tenantSettings.logo_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = tenantSettings.logo_url;
      }
    }
  };

  const refreshTenant = async () => {
    setIsLoading(true);
    await fetchTenant();
  };

  useEffect(() => {
    fetchTenant();
  }, [userProfile?.tenant_id]);

  useEffect(() => {
    applyTenantBranding();
  }, [tenantSettings]);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenantSettings,
        isLoading,
        refreshTenant,
        applyTenantBranding,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};