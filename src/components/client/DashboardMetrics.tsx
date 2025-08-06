import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, FolderOpen, Trophy } from 'lucide-react';
import { useFamilyWealthData } from '@/hooks/useFamilyWealthData';
import { useCelebration } from '@/hooks/useCelebration';

export const DashboardMetrics = () => {
  const { 
    formattedTotalBalance, 
    accountCount, 
    isLoading 
  } = useFamilyWealthData();
  
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const metrics = [
    {
      title: 'Net Worth',
      value: formattedTotalBalance,
      change: '+12.3% from last month',
      icon: DollarSign,
      onClick: () => console.log('Navigate to net worth details')
    },
    {
      title: 'Linked Accounts',
      value: accountCount.toString(),
      change: 'Active accounts',
      icon: CreditCard,
      onClick: () => console.log('Navigate to accounts')
    },
    {
      title: 'Family Vault Items',
      value: '24',
      change: '3 added this week',
      icon: FolderOpen,
      onClick: () => console.log('Navigate to vault')
    },
    {
      title: 'Last Milestone',
      value: 'Goal Achieved!',
      change: 'Emergency Fund Complete',
      icon: Trophy,
      onClick: () => triggerCelebration('milestone', 'Emergency Fund Complete!'),
      isNew: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
              metric.isNew ? 'ring-2 ring-primary/50 animate-pulse' : ''
            }`}
            onClick={metric.onClick}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <metric.icon className="h-4 w-4 text-primary" />
                {metric.title}
                {metric.isNew && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {CelebrationComponent}
    </>
  );
};