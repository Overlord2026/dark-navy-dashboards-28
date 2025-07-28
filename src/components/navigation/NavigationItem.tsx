import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Plus, Zap, Star } from 'lucide-react';
import { FeatureAccessIndicator } from '@/components/navigation/FeatureAccessIndicator';

interface NavigationItemProps {
  title: string;
  href?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  // Access control props
  requiredTier?: 'basic' | 'premium' | 'elite';
  addOnRequired?: 'lending_access' | 'tax_access' | 'ai_features_access' | 'premium_analytics_access';
  usageFeature?: 'lending_applications' | 'tax_analyses' | 'ai_queries' | 'document_uploads';
  disabled?: boolean;
}

export function NavigationItem({
  title,
  href,
  children,
  isActive = false,
  onClick,
  requiredTier,
  addOnRequired,
  usageFeature,
  disabled = false,
}: NavigationItemProps) {
  const hasAccessRestrictions = requiredTier || addOnRequired || usageFeature;

  return (
    <div 
      className={`
        flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : disabled 
            ? 'text-muted-foreground cursor-not-allowed opacity-50' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium">{title}</span>
        {children}
      </div>
      
      {hasAccessRestrictions && (
        <FeatureAccessIndicator
          requiredTier={requiredTier}
          feature={addOnRequired}
          usageFeature={usageFeature}
          className="ml-2"
        />
      )}
    </div>
  );
}