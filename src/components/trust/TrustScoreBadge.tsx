import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, Star, Award, Crown } from 'lucide-react';
import { TrustScore } from '@/types/persona';
import { cn } from '@/lib/utils';

interface TrustScoreBadgeProps {
  trustScore?: TrustScore;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getTierConfig = (tier: TrustScore['tier']) => {
  switch (tier) {
    case 'Platinum':
      return {
        icon: Crown,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        textColor: 'text-white',
        label: 'Platinum',
        description: 'Exceptional track record and highest trust level'
      };
    case 'Gold':
      return {
        icon: Award,
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        textColor: 'text-white',
        label: 'Gold',
        description: 'Strong performance and high trust level'
      };
    case 'Silver':
      return {
        icon: Star,
        color: 'bg-gradient-to-r from-gray-400 to-gray-600',
        textColor: 'text-white',
        label: 'Silver',
        description: 'Good performance and solid trust level'
      };
    case 'Standard':
    default:
      return {
        icon: Shield,
        color: 'bg-muted',
        textColor: 'text-muted-foreground',
        label: 'Standard',
        description: 'Meeting basic trust requirements'
      };
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        badge: 'px-2 py-1 text-xs',
        icon: 'h-3 w-3',
        gap: 'gap-1'
      };
    case 'lg':
      return {
        badge: 'px-4 py-2 text-base',
        icon: 'h-5 w-5',
        gap: 'gap-2'
      };
    case 'md':
    default:
      return {
        badge: 'px-3 py-1.5 text-sm',
        icon: 'h-4 w-4',
        gap: 'gap-1.5'
      };
  }
};

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  trustScore,
  showScore = true,
  size = 'md',
  className
}) => {
  if (!trustScore) {
    return null;
  }

  const tierConfig = getTierConfig(trustScore.tier);
  const sizeClasses = getSizeClasses(size);
  const IconComponent = tierConfig.icon;

  const badgeContent = (
    <Badge
      className={cn(
        'flex items-center font-medium border-0',
        tierConfig.color,
        tierConfig.textColor,
        sizeClasses.badge,
        sizeClasses.gap,
        className
      )}
    >
      <IconComponent className={sizeClasses.icon} />
      <span>Trust Tier: {tierConfig.label}</span>
      {showScore && (
        <span className="ml-1">({(trustScore.computedScore * 100).toFixed(0)}%)</span>
      )}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">{tierConfig.label} Trust Level</div>
            <div className="text-sm text-muted-foreground">
              {tierConfig.description}
            </div>
            {showScore && (
              <div className="text-sm">
                <div>Score: {(trustScore.computedScore * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(trustScore.computedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrustScoreBadge;