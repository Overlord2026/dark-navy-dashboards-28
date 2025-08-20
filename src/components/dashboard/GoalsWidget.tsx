// Dashboard widget for Goals (Top 3 priorities)

import React from 'react';
import { Link } from 'react-router-dom';
import { useTopGoals } from '@/hooks/useGoals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  ArrowUpRight, 
  Plus,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

interface GoalsWidgetProps {
  persona?: 'aspiring' | 'retiree';
  className?: string;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ 
  persona = 'aspiring',
  className = "" 
}) => {
  const topGoals = useTopGoals(persona, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🛡️';
      case 'bucket_list': return '🌍';
      case 'retirement': return '🏖️';
      case 'savings': return '💰';
      case 'education': return '🎓';
      case 'wedding': return '💍';
      case 'down_payment': return '🏠';
      case 'debt': return '💳';
      default: return '🎯';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'bucket_list': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'retirement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'savings': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'education': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'wedding': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'down_payment': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'debt': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <span>Goals</span>
          <Badge variant="secondary" className="text-xs">
            Top 3 Priorities
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Link to="/goals">
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {topGoals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium mb-2">No goals yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start by creating your first financial goal
            </p>
            <Link to="/goals">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {topGoals.map((goal, index) => (
                <Link key={goal.id} to={`/goals/${goal.id}`}>
                  <div className="group p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="text-lg">{getTypeIcon(goal.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {goal.title}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getTypeColor(goal.type)}`}
                            >
                              #{index + 1}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{goal.progress.pct}%</span>
                            </div>
                            <Progress value={goal.progress.pct} className="h-1.5" />
                            
                            <div className="flex items-center justify-between text-xs">
                              {goal.targetAmount && (
                                <span className="text-muted-foreground">
                                  {formatCurrency(goal.progress.current)} / {formatCurrency(goal.targetAmount)}
                                </span>
                              )}
                              {goal.targetDate && (
                                <span className="text-muted-foreground">
                                  Target: {formatDate(goal.targetDate)}
                                </span>
                              )}
                            </div>

                            {goal.monthlyContribution && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCurrency(goal.monthlyContribution)}/month</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary">
                    {Math.round(topGoals.reduce((sum, goal) => sum + goal.progress.pct, 0) / topGoals.length)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Progress</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(topGoals.reduce((sum, goal) => sum + goal.progress.current, 0))}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Saved</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Link to="/goals" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
              <Link to="/goals?tab=templates" className="flex-1">
                <Button size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;