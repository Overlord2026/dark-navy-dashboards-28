import { useEffect, useState } from 'react';
import { useTenant } from '@/context/TenantContext';

export interface TenantBrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string | null;
  companyName: string;
  customDomain: string | null;
  subdomain: string | null;
}

export const useTenantBranding = () => {
  const { currentTenant, tenantSettings } = useTenant();
  const [brandingConfig, setBrandingConfig] = useState<TenantBrandingConfig | null>(null);

  useEffect(() => {
    if (currentTenant) {
      const config: TenantBrandingConfig = {
        primaryColor: tenantSettings?.primary_color || 'hsl(220 90% 56%)',
        secondaryColor: tenantSettings?.secondary_color || 'hsl(220 15% 25%)',
        accentColor: tenantSettings?.accent_color || 'hsl(162 90% 24%)',
        logoUrl: tenantSettings?.logo_url || currentTenant.brand_logo_url || null,
        companyName: currentTenant.name,
        customDomain: tenantSettings?.custom_domain || null,
        subdomain: tenantSettings?.subdomain || null,
      };
      
      setBrandingConfig(config);
    }
  }, [currentTenant, tenantSettings]);

  const applyBrandingToDOM = () => {
    if (!brandingConfig) return;

    const root = document.documentElement;
    root.style.setProperty('--primary', brandingConfig.primaryColor);
    root.style.setProperty('--secondary', brandingConfig.secondaryColor);
    root.style.setProperty('--accent', brandingConfig.accentColor);

    // Update page title
    document.title = `${brandingConfig.companyName} - Family Office Portal`;
  };

  useEffect(() => {
    applyBrandingToDOM();
  }, [brandingConfig]);

  return {
    brandingConfig,
    applyBrandingToDOM,
    isLoaded: !!brandingConfig,
  };
};