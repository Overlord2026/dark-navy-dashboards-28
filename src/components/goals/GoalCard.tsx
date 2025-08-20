// GoalCard component with thumbnail, progress bar, and quick actions

import React from 'react';
import { Goal } from '@/types/goal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Target, 
  Calendar, 
  DollarSign, 
  Edit3, 
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onView?: (goalId: string) => void;
  onUpdateProgress?: (goalId: string, newProgress: number) => void;
  className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onView,
  onUpdateProgress,
  className = ""
}) => {
  const getTypeIcon = (type: Goal['type']) => {
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

  const getTypeColor = (type: Goal['type']) => {
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
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No target date';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const progressColor = goal.progress.pct >= 80 ? 'bg-green-500' : 
                       goal.progress.pct >= 50 ? 'bg-yellow-500' : 
                       'bg-red-500';

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {goal.imageUrl ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={goal.imageUrl} 
                  alt={goal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                {getTypeIcon(goal.type)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {goal.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`text-xs mt-1 ${getTypeColor(goal.type)}`}
              >
                {goal.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(goal.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Goal
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(goal.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Goal
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress.pct}%</span>
          </div>
          <Progress value={goal.progress.pct} className="h-2" />
          {goal.targetAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(goal.progress.current)}
              </span>
              <span className="font-medium">
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {goal.targetDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">
                {formatDate(goal.targetDate)}
              </span>
            </div>
          )}
          
          {goal.monthlyContribution && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatCurrency(goal.monthlyContribution)}/mo
              </span>
            </div>
          )}
        </div>

        {/* Quick Progress Update */}
        {onUpdateProgress && goal.targetAmount && (
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Quick update:</span>
            <div className="flex space-x-1">
              {[100, 250, 500].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => {
                    const newCurrent = goal.progress.current + amount;
                    const newPct = Math.min(100, Math.round((newCurrent / goal.targetAmount!) * 100));
                    onUpdateProgress(goal.id, newCurrent);
                  }}
                >
                  +${amount}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};