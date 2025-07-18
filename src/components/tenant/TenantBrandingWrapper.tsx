import React, { useEffect } from 'react';
import { useTenantBranding } from '@/hooks/useTenantBranding';

interface TenantBrandingWrapperProps {
  children: React.ReactNode;
}

export const TenantBrandingWrapper: React.FC<TenantBrandingWrapperProps> = ({ children }) => {
  const { brandingConfig, applyBrandingToDOM } = useTenantBranding();

  useEffect(() => {
    applyBrandingToDOM();
  }, [brandingConfig]);

  return <>{children}</>;
};