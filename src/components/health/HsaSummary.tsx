import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, User, Users, Calendar, DollarSign } from 'lucide-react';
import { HsaPlan } from '@/features/health/hsa/api';

interface HsaSummaryProps {
  plan: HsaPlan;
}

export function HsaSummary({ plan }: HsaSummaryProps) {
  const maxLimit = plan.annualLimit + (plan.catchUpEligible ? 1000 : 0);
  const progressPercentage = (plan.ytdContrib / maxLimit) * 100;
  const remainingSpace = maxLimit - plan.ytdContrib;
  const monthsRemaining = 12 - new Date().getMonth();
  const suggestedMonthly = monthsRemaining > 0 ? remainingSpace / monthsRemaining : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* HSA Eligibility */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HSA Eligibility</CardTitle>
          {plan.hsaEligible ? (
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={plan.hsaEligible ? "default" : "destructive"}>
              {plan.hsaEligible ? "Eligible" : "Not Eligible"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {plan.family ? (
                <>
                  <Users className="h-3 w-3" />
                  Family Coverage
                </>
              ) : (
                <>
                  <User className="h-3 w-3" />
                  Individual Coverage
                </>
              )}
            </div>
            {plan.catchUpEligible && (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Calendar className="h-3 w-3" />
                Catch-up Eligible (55+)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* YTD vs Limit */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">YTD Contributions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              ${plan.ytdContrib.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              of ${maxLimit.toLocaleString()} limit
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% used
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Space */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Space</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-emerald-600">
              ${remainingSpace.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Available to contribute
            </div>
            <div className="text-xs text-muted-foreground">
              Base: ${plan.annualLimit.toLocaleString()}
              {plan.catchUpEligible && " + $1,000 catch-up"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pace to Target */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pace to Target</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              ${Math.round(suggestedMonthly).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Suggested monthly
            </div>
            <div className="text-xs text-muted-foreground">
              {monthsRemaining} months remaining in {new Date().getFullYear()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}