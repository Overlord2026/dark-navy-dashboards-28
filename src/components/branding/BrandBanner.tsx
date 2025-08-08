import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface BrandBannerProps {
  className?: string;
}

export const BrandBanner: React.FC<BrandBannerProps> = ({ className = '' }) => {
  const { branding } = useBranding();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {branding.logo_url && (
        <img 
          src={branding.logo_url} 
          alt={`${branding.name} logo`}
          className="h-8 w-auto"
        />
      )}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-foreground">{branding.name}</h1>
        {branding.powered_by_bfo && (
          <p className="text-xs text-muted-foreground">
            Powered by Boutique Family Office
          </p>
        )}
      </div>
    </div>
  );
};