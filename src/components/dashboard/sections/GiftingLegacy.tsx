import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { 
  Gift, 
  Heart, 
  GraduationCap, 
  HandHeart, 
  Calendar,
  TrendingUp,
  Plus,
  DollarSign
} from "lucide-react";
import { GiftingGoal } from "@/types/familyOffice";

interface GiftingLegacyProps {
  giftingGoals: GiftingGoal[];
}

export const GiftingLegacy: React.FC<GiftingLegacyProps> = ({ giftingGoals }) => {
  const totalLifetimeGifts = giftingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalGiftingTargets = giftingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = (totalLifetimeGifts / totalGiftingTargets) * 100;

  const getGiftIcon = (type: GiftingGoal['type']) => {
    switch (type) {
      case 'education': return <GraduationCap className="h-5 w-5 text-purple-500" />;
      case 'charitable': return <HandHeart className="h-5 w-5 text-green-500" />;
      case 'family': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'emergency': return <DollarSign className="h-5 w-5 text-blue-500" />;
      default: return <Gift className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: GiftingGoal['type']) => {
    switch (type) {
      case 'education': return 'Education';
      case 'charitable': return 'Charitable';
      case 'family': return 'Family';
      case 'emergency': return 'Emergency';
      default: return 'Gift';
    }
  };

  const getDaysToDeadline = (deadline?: Date) => {
    if (!deadline) return null;
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gifting & Legacy</h2>
          <p className="text-muted-foreground">Your family impact and legacy building</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Plan New Gift</span>
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">
                {formatCurrency(totalLifetimeGifts)}
              </div>
              <div className="text-sm text-emerald-600">Lifetime Gifts Given</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(totalGiftingTargets)}
              </div>
              <div className="text-sm text-blue-600">Total Gifting Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {overallProgress.toFixed(0)}%
              </div>
              <div className="text-sm text-purple-600">Overall Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Gifting Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {giftingGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = getDaysToDeadline(goal.deadline);
          const isUrgent = daysLeft && daysLeft < 90;
          
          return (
            <Card key={goal.id} className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getGiftIcon(goal.type)}
                    <div>
                      <div className="font-semibold">{goal.recipient}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {goal.purpose}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getTypeLabel(goal.type)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </span>
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className={isUrgent ? "text-amber-600 font-medium" : ""}>
                        {goal.deadline.toLocaleDateString()}
                        {daysLeft && ` (${daysLeft} days)`}
                      </span>
                    </div>
                  )}
                  
                  {goal.taxStrategy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Strategy</span>
                      <span className="text-blue-600">{goal.taxStrategy}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="secondary" className="text-xs">
                      {goal.recurring ? "Recurring" : "One-time"}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Contribute
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tax Strategy Insight */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Tax Planning Opportunity</h3>
              <p className="text-sm text-blue-700">
                You're eligible for additional charitable giving tax benefits this year. 
                Consider discussing donor-advised funds or qualified charitable distributions with your advisor.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Review Tax Strategies with Advisor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};