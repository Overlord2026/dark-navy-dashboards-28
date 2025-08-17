import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFamilyEntitlements } from '@/hooks/useFamilyEntitlements';
import { FamilySegment } from '@/data/familiesPricingTiers';
import { Link, Upload, Target, TrendingUp, BarChart3, UserPlus, Lock } from 'lucide-react';

const iconMap = {
  Link,
  Upload,
  Target,
  TrendingUp,
  BarChart3,
  UserPlus
};

interface FamilyQuickActionsProps {
  selectedSegment: FamilySegment;
}

export const FamilyQuickActions: React.FC<FamilyQuickActionsProps> = ({
  selectedSegment
}) => {
  const { availableActions, isActionAccessible, currentTier } = useFamilyEntitlements(selectedSegment);

  const handleActionClick = (actionId: string) => {
    console.log(`Action clicked: ${actionId}`);
    // Handle action navigation/execution here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Actions</span>
          <Badge variant="outline">{currentTier.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableActions.map((action) => {
            const IconComponent = iconMap[action.icon as keyof typeof iconMap];
            const isAccessible = isActionAccessible(action);
            
            return (
              <Button
                key={action.id}
                variant={isAccessible ? "outline" : "secondary"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  !isAccessible ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                onClick={() => isAccessible && handleActionClick(action.id)}
                disabled={!isAccessible}
              >
                <div className="flex items-center gap-1">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  {!isAccessible && <Lock className="w-3 h-3 text-muted-foreground" />}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                  {!isAccessible && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {action.requiredTier.toUpperCase()} Required
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};