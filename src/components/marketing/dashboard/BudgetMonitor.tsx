import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { MarketingCampaign, SpendSnapshot } from '@/marketing/types';

interface BudgetMonitorProps {
  campaigns: MarketingCampaign[];
  spendData: SpendSnapshot[];
}

export function BudgetMonitor({ campaigns, spendData }: BudgetMonitorProps) {
  // Calculate budget utilization for each campaign
  const budgetData = campaigns.map(campaign => {
    const campaignSpend = spendData
      .filter(s => s.campaignId === campaign.id)
      .reduce((total, snapshot) => total + snapshot.metrics.spend, 0);
    
    const utilizationPercent = (campaignSpend / campaign.totalBudget) * 100;
    const dailySpend = spendData
      .filter(s => s.campaignId === campaign.id)
      .filter(s => {
        const today = new Date().toISOString().split('T')[0];
        return s.date === today;
      })
      .reduce((total, snapshot) => total + snapshot.metrics.spend, 0);
    
    const dailyUtilization = (dailySpend / campaign.dailyBudget) * 100;
    
    return {
      campaign,
      totalSpend: campaignSpend,
      utilizationPercent,
      dailySpend,
      dailyUtilization,
      isOverspending: utilizationPercent > 90,
      isDailyOverspending: dailyUtilization > 90,
    };
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.totalBudget, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.totalSpend, 0);
  const overallUtilization = (totalSpent / totalBudget) * 100;

  const alerts = budgetData.filter(b => b.isOverspending || b.isDailyOverspending);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Monitor
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {alerts.length} Alert{alerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Budget Status */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Budget</span>
            <span className="text-sm text-muted-foreground">
              ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={overallUtilization} className="h-2" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {overallUtilization.toFixed(1)}% utilized
            </span>
            <span className="text-xs text-muted-foreground">
              ${(totalBudget - totalSpent).toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Campaign Budget Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Campaign Budgets</h4>
          {budgetData.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No active campaigns to monitor
            </div>
          ) : (
            budgetData.map(data => (
              <div key={data.campaign.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {data.campaign.name}
                      </span>
                      {data.isOverspending && (
                        <Badge variant="destructive">
                          Over Budget
                        </Badge>
                      )}
                      {data.isDailyOverspending && (
                        <Badge variant="outline">
                          Daily Cap
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Total: ${data.totalSpend.toLocaleString()} / ${data.campaign.totalBudget.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Daily: ${data.dailySpend.toFixed(0)} / ${data.campaign.dailyBudget}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={data.utilizationPercent} 
                    className={`h-2 ${data.isOverspending ? 'text-destructive' : ''}`} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{data.utilizationPercent.toFixed(1)}% of total budget</span>
                    <span>{data.dailyUtilization.toFixed(1)}% of daily budget</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Budget Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Budget Alerts
            </h4>
            {alerts.map(alert => (
              <div key={alert.campaign.id} className="text-xs p-2 bg-destructive/10 rounded border border-destructive/20">
                <span className="font-medium">{alert.campaign.name}</span>
                {alert.isOverspending && (
                  <div>• Exceeded 90% of total budget ({alert.utilizationPercent.toFixed(1)}%)</div>
                )}
                {alert.isDailyOverspending && (
                  <div>• Exceeded 90% of daily budget ({alert.dailyUtilization.toFixed(1)}%)</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}