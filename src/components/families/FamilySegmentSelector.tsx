import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FamilySegment } from '@/data/familiesPricingTiers';
import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { Users, Clock, Crown, Briefcase, Heart, TrendingUp, Shield, Trophy } from 'lucide-react';

interface FamilySegmentSelectorProps {
  selectedSegment: FamilySegment;
  onSegmentChange: (segment: FamilySegment) => void;
}

const segmentConfig: Record<FamilySegment, {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}> = {
  retirees: {
    label: 'Retirees',
    description: 'Consolidate, plan RMDs, and coordinate pros',
    icon: Clock,
    color: 'from-blue-50 to-indigo-50 border-blue-200'
  },
  aspiring: {
    label: 'Aspiring Wealthy',
    description: 'Build habits, automate saving & documents',
    icon: Users,
    color: 'from-emerald-50 to-green-50 border-emerald-200'
  },
  hnw: {
    label: 'High-Net-Worth',
    description: 'Advanced tax, vault, and estate coordination',
    icon: Crown,
    color: 'from-amber-50 to-yellow-50 border-amber-200'
  },
  entrepreneurs: {
    label: 'Business Owners',
    description: 'Entity, liquidity, and succession workflows',
    icon: Briefcase,
    color: 'from-purple-50 to-violet-50 border-purple-200'
  },
  physicians: {
    label: 'Physicians & Dentists',
    description: 'Malpractice, entity, and LTC strategies',
    icon: Heart,
    color: 'from-red-50 to-rose-50 border-red-200'
  },
  executives: {
    label: 'Corporate Executives',
    description: 'Equity comp, 10b5-1, and tax planning',
    icon: TrendingUp,
    color: 'from-cyan-50 to-sky-50 border-cyan-200'
  },
  independent_women: {
    label: 'Independent Women',
    description: 'Goal-first planning and safety controls',
    icon: Shield,
    color: 'from-pink-50 to-rose-50 border-pink-200'
  },
  athletes: {
    label: 'Athletes & Entertainers',
    description: 'NIL contracts, branding, and advisors',
    icon: Trophy,
    color: 'from-orange-50 to-amber-50 border-orange-200'
  }
};

export const FamilySegmentSelector: React.FC<FamilySegmentSelectorProps> = ({
  selectedSegment,
  onSegmentChange
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Family Stage</h2>
        <p className="text-muted-foreground">
          Select the category that best describes your family's wealth journey
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FAMILY_SEGMENTS.map((segment) => {
          const config = segmentConfig[segment.slug];
          const isSelected = selectedSegment === segment.slug;
          const IconComponent = config.icon;
          
          return (
            <Card
              key={segment.slug}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } bg-gradient-to-br ${config.color}`}
              onClick={() => onSegmentChange(segment.slug as FamilySegment)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/80'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{config.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{segment.blurb}</p>
                
                {isSelected && (
                  <Badge variant="default" className="text-xs">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};