import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getLogoConfig, LogoVariant } from "@/assets/logos";
import { useTenant } from "@/context/TenantContext";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  onClick?: () => void;
  useTenantLogo?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'tree', 
  className,
  onClick,
  useTenantLogo = true
}) => {
  const [hasError, setHasError] = useState(false);
  const { tenantSettings, currentTenant } = useTenant();
  
  // Use tenant logo if available and requested
  const logoUrl = useTenantLogo && (tenantSettings?.logo_url || currentTenant?.brand_logo_url);
  
  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={currentTenant?.name || "Logo"}
        className={cn("h-8 w-auto", className)}
        onClick={onClick}
        onError={() => setHasError(true)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
    );
  }

  // Fallback to default logo system
  const config = getLogoConfig(hasError ? 'fallback' : variant);

  return (
    <img
      src={config.src}
      alt={config.alt}
      className={cn(config.className, className)}
      onClick={onClick}
      onError={() => setHasError(true)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};