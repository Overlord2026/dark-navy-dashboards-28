import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FamilySegment } from '@/data/familiesPricingTiers';
import { Users, Wallet, Crown, Gem } from 'lucide-react';

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
  Aspiring: {
    label: 'Aspiring Families',
    description: 'Building wealth and financial security',
    icon: Users,
    color: 'from-emerald-50 to-green-50 border-emerald-200'
  },
  Retirees: {
    label: 'Retirees',
    description: 'Preserving and managing retirement wealth',
    icon: Wallet,
    color: 'from-blue-50 to-indigo-50 border-blue-200'
  },
  HNW: {
    label: 'High Net Worth',
    description: 'Sophisticated wealth management needs',
    icon: Crown,
    color: 'from-amber-50 to-yellow-50 border-amber-200'
  },
  UHNW: {
    label: 'Ultra High Net Worth',
    description: 'Comprehensive family office services',
    icon: Gem,
    color: 'from-purple-50 to-violet-50 border-purple-200'
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
        {Object.entries(segmentConfig).map(([segment, config]) => {
          const IconComponent = config.icon;
          const isSelected = selectedSegment === segment;
          
          return (
            <Card
              key={segment}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } bg-gradient-to-br ${config.color}`}
              onClick={() => onSegmentChange(segment as FamilySegment)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/80'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{config.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                
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