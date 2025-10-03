import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface BrandingData {
  name: string;
  logo_url: string | null;
  colors: BrandingColors;
  legal_footer: string | null;
  powered_by_bfo: boolean;
}

interface BrandingContextType {
  branding: BrandingData;
  isLoading: boolean;
  refreshBranding: () => Promise<void>;
}

const defaultBranding: BrandingData = {
  name: 'Boutique Family Office',
  logo_url: null,
  colors: {
    primary: '#0B2239',
    secondary: '#D4AF37',
    accent: '#D4AF37'
  },
  legal_footer: null,
  powered_by_bfo: true
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [isLoading, setIsLoading] = useState(true);

  const applyBrandingToDOM = (brandingData: BrandingData) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply brand colors as CSS variables
    root.style.setProperty('--brand-primary', hexToHsl(brandingData.colors.primary));
    root.style.setProperty('--brand-secondary', hexToHsl(brandingData.colors.secondary));
    root.style.setProperty('--brand-accent', hexToHsl(brandingData.colors.accent));

    // Update primary color variable used by the design system
    root.style.setProperty('--primary', hexToHsl(brandingData.colors.primary));
    root.style.setProperty('--secondary', hexToHsl(brandingData.colors.secondary));
    root.style.setProperty('--accent', hexToHsl(brandingData.colors.accent));

    // Update document title
    document.title = brandingData.name;
  };

  const fetchBranding = async () => {
    try {
      setIsLoading(true);
      
      // Call the brand-get edge function
      const { data, error } = await supabase.functions.invoke('brand-get', {
        headers: {
          'host': window.location.host
        }
      });

      if (error) {
        console.error('Error fetching branding:', error);
        setBranding(defaultBranding);
        applyBrandingToDOM(defaultBranding);
        return;
      }

      const brandingData = data as BrandingData;
      setBranding(brandingData);
      applyBrandingToDOM(brandingData);

    } catch (error) {
      console.error('Error fetching branding:', error);
      setBranding(defaultBranding);
      applyBrandingToDOM(defaultBranding);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBranding = async () => {
    await fetchBranding();
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, isLoading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};