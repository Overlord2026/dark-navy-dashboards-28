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
  color_palette?: any;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  isLoading: boolean;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchTenant = async () => {
    if (!userProfile?.tenant_id) {
      setCurrentTenant(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userProfile.tenant_id)
        .single();

      if (error) {
        console.error('Error fetching tenant:', error);
        setCurrentTenant(null);
        return;
      }

      setCurrentTenant(data);
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setCurrentTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    setIsLoading(true);
    await fetchTenant();
  };

  useEffect(() => {
    fetchTenant();
  }, [userProfile?.tenant_id]);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        isLoading,
        refreshTenant,
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