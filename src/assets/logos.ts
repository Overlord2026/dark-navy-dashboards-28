// Centralized logo management for the Boutique Family Office application

export const LOGOS = {
  // Tree icon only - for compact headers and navigation
  treeIcon: "/lovable-uploads/03120943-9fc3-4374-89ae-ae70bf1425f0.png",
  
  // Full brand logo - for main branding areas
  fullBrand: "/lovable-uploads/48e6fed8-fac5-4be6-8f0b-767dd5f6eacc.png",
  
  // Large hero logo - for hero sections and prominent displays
  largeHero: "/lovable-uploads/190d282a-70e8-45cb-a6d5-3b528dc97d46.png",
  
  // Fallback logo (current white logo)
  fallback: "/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png"
};

export type LogoVariant = 'tree' | 'brand' | 'hero' | 'fallback';

export interface LogoConfig {
  src: string;
  alt: string;
  className?: string;
}

export const getLogoConfig = (variant: LogoVariant): LogoConfig => {
  const configs: Record<LogoVariant, LogoConfig> = {
    tree: {
      src: LOGOS.treeIcon,
      alt: "Boutique Family Office",
      className: "h-8 w-auto md:h-10"
    },
    brand: {
      src: LOGOS.fullBrand,
      alt: "Boutique Family Office - Comprehensive Wealth Management",
      className: "h-12 w-auto md:h-16"
    },
    hero: {
      src: LOGOS.largeHero,
      alt: "Boutique Family Office - Your Trusted Financial Partner",
      className: "h-16 w-auto md:h-20 lg:h-24"
    },
    fallback: {
      src: LOGOS.fallback,
      alt: "Boutique Family Office",
      className: "h-10 w-auto"
    }
  };

  return configs[variant];
};