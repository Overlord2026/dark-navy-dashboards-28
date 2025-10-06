// PersonaDefaultsMenu component for one-click goal seeds

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Sparkles, 
  Shield, 
  Home, 
  PiggyBank,
  Plane,
  Heart,
  Gift
} from 'lucide-react';
import { usePersonaDefaults, useCreateGoal } from '@/hooks/useGoals';
import { toast } from 'sonner';

interface PersonaDefaultsMenuProps {
  persona: 'aspiring' | 'retiree';
  onGoalCreated?: () => void;
  trigger?: React.ReactNode;
}

export const PersonaDefaultsMenu: React.FC<PersonaDefaultsMenuProps> = ({
  persona,
  onGoalCreated,
  trigger
}) => {
  const { data: personaDefaults } = usePersonaDefaults(persona);
  const createGoalMutation = useCreateGoal();

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <Shield className="h-4 w-4" />;
      case 'down_payment': return <Home className="h-4 w-4" />;
      case 'savings': return <PiggyBank className="h-4 w-4" />;
      case 'bucket_list': return <Plane className="h-4 w-4" />;
      case 'retirement': return <Heart className="h-4 w-4" />;
      case 'custom': return <Gift className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'down_payment': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'savings': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bucket_list': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'retirement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateGoal = async (goalTemplate: any) => {
    try {
      await createGoalMutation.mutateAsync({
        type: goalTemplate.type,
        title: goalTemplate.title,
        targetAmount: goalTemplate.targetAmount,
        monthlyContribution: goalTemplate.monthlyContribution,
        persona: goalTemplate.persona,
        smartr: goalTemplate.smartr,
      });
      
      onGoalCreated?.();
      toast.success(`${goalTemplate.title} goal created!`);
    } catch (error) {
      console.error('Failed to create goal from template:', error);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Sparkles className="h-4 w-4" />
      Quick Start
    </Button>
  );

  if (!personaDefaults) {
    return trigger || defaultTrigger;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>
            {persona === 'aspiring' ? 'Aspiring Families' : 'Retiree'} Defaults
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-2">
          {personaDefaults.map((goalTemplate, index) => (
            <DropdownMenuItem
              key={index}
              className="p-0 cursor-pointer"
              onClick={() => handleCreateGoal(goalTemplate)}
            >
              <Card className="w-full border-0 shadow-none hover:bg-muted/50 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      {getGoalIcon(goalTemplate.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {goalTemplate.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getGoalColor(goalTemplate.type)}`}
                          >
                            {goalTemplate.type.replace('_', ' ')}
                          </Badge>
                          {goalTemplate.targetAmount && (
                            <span className="text-xs text-muted-foreground">
                              ${goalTemplate.targetAmount.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {goalTemplate.monthlyContribution && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ${goalTemplate.monthlyContribution}/month
                          </p>
                        )}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Click any goal to add it to your list with pre-filled SMART criteria
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Standalone component for displaying persona defaults as cards
interface PersonaDefaultsCardsProps {
  persona: 'aspiring' | 'retiree';
  onGoalSelect: (goalTemplate: any) => void;
  className?: string;
}

export const PersonaDefaultsCards: React.FC<PersonaDefaultsCardsProps> = ({
  persona,
  onGoalSelect,
  className = ""
}) => {
  const { data: personaDefaults, isLoading } = usePersonaDefaults(persona);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <Shield className="h-5 w-5" />;
      case 'down_payment': return <Home className="h-5 w-5" />;
      case 'savings': return <PiggyBank className="h-5 w-5" />;
      case 'bucket_list': return <Plane className="h-5 w-5" />;
      case 'retirement': return <Heart className="h-5 w-5" />;
      case 'custom': return <Gift className="h-5 w-5" />;
      default: return <Plus className="h-5 w-5" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'down_payment': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'savings': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bucket_list': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'retirement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!personaDefaults) {
    return null;
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2">
        {persona === 'aspiring' ? 'Aspiring Families' : 'Retiree'} Goal Templates
      </h3>
      {personaDefaults.map((goalTemplate, index) => (
        <Card 
          key={index} 
          className="cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => onGoalSelect(goalTemplate)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-muted">
                {getGoalIcon(goalTemplate.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{goalTemplate.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getGoalColor(goalTemplate.type)}`}
                  >
                    {goalTemplate.type.replace('_', ' ')}
                  </Badge>
                </div>
                
                {goalTemplate.smartr?.specific && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {goalTemplate.smartr.specific}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  {goalTemplate.targetAmount && (
                    <span className="font-medium">
                      Target: ${goalTemplate.targetAmount.toLocaleString()}
                    </span>
                  )}
                  {goalTemplate.monthlyContribution && (
                    <span className="text-muted-foreground">
                      ${goalTemplate.monthlyContribution}/month
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};