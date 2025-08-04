import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CEProgressTrackerProps {
  creditsCompleted: number;
  creditsRequired: number;
  periodEnd?: Date;
  status: string;
}

export function CEProgressTracker({ 
  creditsCompleted, 
  creditsRequired, 
  periodEnd,
  status 
}: CEProgressTrackerProps) {
  const percentage = creditsRequired > 0 
    ? Math.min((creditsCompleted / creditsRequired) * 100, 100)
    : 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete':
        return {
          color: 'text-emerald',
          bgColor: 'bg-emerald',
          icon: CheckCircle,
          label: 'Complete',
          badgeClass: 'bg-emerald text-emerald-foreground'
        };
      case 'on-track':
        return {
          color: 'text-emerald',
          bgColor: 'bg-emerald',
          icon: Target,
          label: 'On Track',
          badgeClass: 'bg-emerald text-emerald-foreground'
        };
      case 'at-risk':
        return {
          color: 'text-gold',
          bgColor: 'bg-gold',
          icon: AlertTriangle,
          label: 'At Risk',
          badgeClass: 'bg-gold text-gold-foreground'
        };
      case 'behind':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive',
          icon: Clock,
          label: 'Behind Schedule',
          badgeClass: 'bg-destructive text-destructive-foreground'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: Clock,
          label: 'Unknown',
          badgeClass: 'bg-muted text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const getDaysRemaining = () => {
    if (!periodEnd) return null;
    const today = new Date();
    const diffTime = periodEnd.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Card className="border-navy/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-navy">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-5 w-5", config.color)} aria-hidden="true" />
            CE Progress Tracker
          </div>
          <Badge className={config.badgeClass}>
            {config.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Credits Completed</span>
            <span className="text-muted-foreground">
              {creditsCompleted} of {creditsRequired} credits
            </span>
          </div>
          <Progress 
            value={percentage} 
            className="h-3"
            aria-label={`CE progress: ${percentage.toFixed(1)}% complete`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
            <span>{creditsRequired}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-emerald/10 border border-emerald/20">
            <div className="text-2xl font-bold text-emerald">
              {creditsCompleted}
            </div>
            <div className="text-xs text-emerald-foreground/80">
              Credits Earned
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-navy/10 border border-navy/20">
            <div className="text-2xl font-bold text-navy">
              {Math.max(0, creditsRequired - creditsCompleted)}
            </div>
            <div className="text-xs text-navy-foreground/80">
              Credits Needed
            </div>
          </div>
        </div>

        {/* Period Information */}
        {periodEnd && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reporting Period Ends:</span>
              <div className="text-right">
                <div className="font-medium text-foreground">
                  {periodEnd.toLocaleDateString()}
                </div>
                {daysRemaining !== null && (
                  <div className={cn(
                    "text-xs",
                    daysRemaining <= 30 ? "text-destructive" :
                    daysRemaining <= 90 ? "text-gold" : "text-emerald"
                  )}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Period ended'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2">
          {percentage < 100 && (
            <p className="text-xs text-muted-foreground text-center">
              {creditsRequired - creditsCompleted} more credits needed to complete requirements
            </p>
          )}
          {percentage >= 100 && (
            <p className="text-xs text-emerald text-center font-medium">
              🎉 Congratulations! You've met your CE requirements
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}