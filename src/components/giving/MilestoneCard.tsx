import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImpactMilestone } from "@/hooks/useImpactReporting";
import { Trophy, Gift, Calendar, Star, Heart, Users } from "lucide-react";
import { format } from "date-fns";

interface MilestoneCardProps {
  milestone: ImpactMilestone;
  onCelebrate?: (milestoneId: string) => void;
}

export const MilestoneCard = ({ milestone, onCelebrate }: MilestoneCardProps) => {
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'donation_amount':
        return <Gift className="h-5 w-5" />;
      case 'years_giving':
        return <Calendar className="h-5 w-5" />;
      case 'charities_supported':
        return <Users className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'donation_amount':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'years_giving':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'charities_supported':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    }
  };

  const formatMilestoneValue = (type: string, value: number) => {
    switch (type) {
      case 'donation_amount':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      case 'years_giving':
        return `${value} Year${value !== 1 ? 's' : ''}`;
      case 'charities_supported':
        return `${value} Charities`;
      default:
        return value.toString();
    }
  };

  return (
    <Card className={`border-2 transition-all duration-300 ${
      milestone.is_celebrated 
        ? 'border-muted bg-muted/30' 
        : 'border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg hover:shadow-xl'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${getMilestoneColor(milestone.milestone_type)}`}>
            {getMilestoneIcon(milestone.milestone_type)}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {milestone.milestone_data?.title || 'Achievement Unlocked!'}
              </h3>
              {!milestone.is_celebrated && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Trophy className="h-3 w-3 mr-1" />
                  New!
                </Badge>
              )}
            </div>
            
            <div className="text-2xl font-bold text-primary">
              {formatMilestoneValue(milestone.milestone_type, milestone.milestone_value)}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Achieved on {format(new Date(milestone.achieved_at), 'MMMM d, yyyy')}
            </p>
            
            {milestone.milestone_data?.description && (
              <p className="text-sm text-muted-foreground">
                {milestone.milestone_data.description}
              </p>
            )}
            
            {!milestone.is_celebrated && (
              <Button 
                size="sm" 
                className="mt-3"
                onClick={() => onCelebrate?.(milestone.id)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Celebrate Achievement
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};