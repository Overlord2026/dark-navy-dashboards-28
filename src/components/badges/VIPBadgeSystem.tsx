import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Crown, 
  Star, 
  Award, 
  Sparkles, 
  Trophy,
  Shield,
  Zap,
  Gem,
  Target,
  TrendingUp
} from 'lucide-react';
import { PersonaType } from '@/types/personas';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type VIPTier = 'founding_member' | 'early_adopter' | 'strategic_partner' | 'industry_leader' | 'reserved_vip';
export type BadgeType = 'vip' | 'early_adopter' | 'founding_member' | 'verified' | 'premium' | 'elite' | 'strategic_partner' | 'industry_leader' | 'reserved_vip';

interface VIPStatus {
  tier: VIPTier;
  badges: BadgeType[];
  joinDate: Date;
  specialAccess: string[];
  privileges: string[];
}

interface VIPBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

interface VIPStatusCardProps {
  persona: PersonaType;
  vipStatus: VIPStatus;
  compact?: boolean;
}

const BADGE_CONFIG: Record<BadgeType, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  description: string;
  priority: number;
}> = {
  founding_member: {
    label: 'Founding Member',
    icon: Crown,
    gradient: 'from-gold via-yellow-500 to-amber-400',
    description: 'One of the first 25 industry leaders to join',
    priority: 1
  },
  reserved_vip: {
    label: 'Reserved VIP',
    icon: Gem,
    gradient: 'from-purple-600 via-purple-500 to-purple-400',
    description: 'Exclusive reserved profile access',
    priority: 2
  },
  strategic_partner: {
    label: 'Strategic Partner',
    icon: Shield,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    description: 'Strategic industry partnership status',
    priority: 3
  },
  industry_leader: {
    label: 'Industry Leader',
    icon: Trophy,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    description: 'Recognized industry thought leader',
    priority: 4
  },
  early_adopter: {
    label: 'Early Adopter',
    icon: Zap,
    gradient: 'from-green-500 via-emerald-500 to-teal-400',
    description: 'Early platform adopter with special privileges',
    priority: 5
  },
  verified: {
    label: 'Verified',
    icon: Award,
    gradient: 'from-blue-500 via-blue-400 to-indigo-400',
    description: 'Verified professional status',
    priority: 6
  },
  premium: {
    label: 'Premium',
    icon: Star,
    gradient: 'from-violet-500 via-purple-500 to-purple-400',
    description: 'Premium membership access',
    priority: 7
  },
  elite: {
    label: 'Elite',
    icon: Target,
    gradient: 'from-gray-700 via-gray-600 to-gray-500',
    description: 'Elite professional network member',
    priority: 8
  },
  vip: {
    label: 'VIP',
    icon: Sparkles,
    gradient: 'from-pink-500 via-rose-500 to-red-400',
    description: 'VIP access and privileges',
    priority: 9
  }
};

const VIP_TIER_CONFIG: Record<VIPTier, {
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
}> = {
  founding_member: {
    name: 'Founding Member',
    color: 'from-gold to-yellow-500',
    icon: Crown,
    benefits: [
      'Priority feature access',
      'Direct influence on platform development',
      'Exclusive founding member events',
      'Lifetime premium features'
    ]
  },
  early_adopter: {
    name: 'Early Adopter',
    color: 'from-green-500 to-emerald-500',
    icon: Zap,
    benefits: [
      'Early access to new features',
      'Beta testing opportunities',
      'Special recognition in directory',
      'Priority customer support'
    ]
  },
  strategic_partner: {
    name: 'Strategic Partner',
    color: 'from-blue-600 to-cyan-500',
    icon: Shield,
    benefits: [
      'Strategic partnership opportunities',
      'Co-marketing initiatives',
      'Custom integration support',
      'Executive relationship management'
    ]
  },
  industry_leader: {
    name: 'Industry Leader',
    color: 'from-orange-500 to-red-500',
    icon: Trophy,
    benefits: [
      'Thought leadership platform',
      'Speaking opportunities',
      'Industry insights access',
      'Executive advisory board invitation'
    ]
  },
  reserved_vip: {
    name: 'Reserved VIP',
    color: 'from-purple-600 to-purple-400',
    icon: Gem,
    benefits: [
      'Reserved profile activation',
      'White-glove onboarding',
      'Concierge support',
      'Exclusive VIP features'
    ]
  }
};

export const VIPBadge: React.FC<VIPBadgeProps> = ({
  type,
  size = 'md',
  animated = true,
  showLabel = true,
  className
}) => {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
    lg: 'h-10 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <motion.div
      initial={animated ? { scale: 0, rotate: -180 } : undefined}
      animate={animated ? { scale: 1, rotate: 0 } : undefined}
      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      whileHover={animated ? { scale: 1.05 } : undefined}
      className={className}
    >
      <Badge 
        className={cn(
          `bg-gradient-to-r ${config.gradient} text-white border-0 shadow-lg`,
          sizeClasses[size],
          'flex items-center gap-1.5 font-medium'
        )}
      >
        <Icon className={iconSizes[size]} />
        {showLabel && config.label}
      </Badge>
    </motion.div>
  );
};

export const VIPStatusCard: React.FC<VIPStatusCardProps> = ({
  persona,
  vipStatus,
  compact = false
}) => {
  const tierConfig = VIP_TIER_CONFIG[vipStatus.tier];
  const TierIcon = tierConfig.icon;
  
  // Sort badges by priority
  const sortedBadges = vipStatus.badges.sort((a, b) => 
    BADGE_CONFIG[a].priority - BADGE_CONFIG[b].priority
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tierConfig.color} flex items-center justify-center`}>
          <TierIcon className="h-4 w-4 text-white" />
        </div>
        <div className="flex gap-1">
          {sortedBadges.slice(0, 2).map((badge, index) => (
            <VIPBadge key={badge} type={badge} size="sm" animated={false} />
          ))}
          {sortedBadges.length > 2 && (
            <Badge variant="outline" className="h-6 px-2 text-xs">
              +{sortedBadges.length - 2}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-background via-background to-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierConfig.color} flex items-center justify-center shadow-lg`}>
            <TierIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{tierConfig.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {persona.replace('_', ' ')} Member
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Badges */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recognition Badges</h4>
          <div className="flex flex-wrap gap-2">
            {sortedBadges.map((badge, index) => (
              <VIPBadge 
                key={badge} 
                type={badge} 
                size="md" 
                animated={true}
                className="animate-in fade-in"
              />
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-sm font-medium mb-2">VIP Benefits</h4>
          <ul className="space-y-1">
            {tierConfig.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Special Access */}
        {vipStatus.specialAccess.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Special Access</h4>
            <div className="flex flex-wrap gap-1">
              {vipStatus.specialAccess.slice(0, 3).map((access, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {access}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Member since {vipStatus.joinDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility function to determine VIP status based on user data
export const getVIPStatus = (
  persona: PersonaType,
  userProfile: any
): VIPStatus | null => {
  const badges: BadgeType[] = [];
  let tier: VIPTier = 'early_adopter';

  // Check for VIP reserved status
  if (persona === 'vip_reserved') {
    badges.push('reserved_vip', 'founding_member');
    tier = 'reserved_vip';
  }

  // Check for founding member (first 25 users)
  if (userProfile?.user_number && userProfile.user_number <= 25) {
    badges.push('founding_member');
    tier = 'founding_member';
  }

  // Check for strategic partners (organizations)
  if (persona === 'organization') {
    badges.push('strategic_partner', 'industry_leader');
    tier = 'strategic_partner';
  }

  // Check for early adopters (first 100 users or beta testers)
  if (userProfile?.user_number && userProfile.user_number <= 100) {
    badges.push('early_adopter');
  }

  // Check for verified professionals
  if (userProfile?.verification_status === 'verified') {
    badges.push('verified');
  }

  // Check for premium subscribers
  if (userProfile?.subscription_tier === 'premium' || userProfile?.subscription_tier === 'enterprise') {
    badges.push('premium');
  }

  // Return null if no VIP status
  if (badges.length === 0) {
    return null;
  }

  return {
    tier,
    badges,
    joinDate: new Date(userProfile?.created_at || Date.now()),
    specialAccess: [
      'Priority Support',
      'Beta Features',
      'Executive Events'
    ],
    privileges: [
      'Early feature access',
      'Priority customer support',
      'Special recognition'
    ]
  };
};