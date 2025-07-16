import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getLogoConfig, LogoVariant } from "@/assets/logos";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'tree', 
  className,
  onClick 
}) => {
  const [hasError, setHasError] = useState(false);
  const config = getLogoConfig(hasError ? 'fallback' : variant);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      src={config.src}
      alt={config.alt}
      className={cn(config.className, className)}
      onClick={onClick}
      onError={handleError}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};