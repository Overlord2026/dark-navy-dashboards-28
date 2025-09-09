import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, TrendingUp, AlertCircle, Lightbulb, X } from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { evalNudges, Nudge } from '@/features/nudges/rules';
import { useNavigate } from 'react-router-dom';

export const NudgePanel: React.FC = () => {
  const { persona, tier, facts } = usePersonalizationStore();
  const navigate = useNavigate();
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set());

  const nudges = evalNudges({ persona, tier, facts }).filter(
    nudge => !dismissedNudges.has(nudge.id)
  );

  const handleNudgeAction = (nudge: Nudge) => {
    // Log nudge triggered event
    console.info('nudge.triggered', {
      nudgeId: nudge.id,
      title: nudge.title,
      type: nudge.type,
      priority: nudge.priority,
      persona,
      tier,
      timestamp: new Date().toISOString(),
      userId: 'current-user' // In real app, get from auth context
    });

    if (nudge.action?.route) {
      navigate(nudge.action.route);
    } else if (nudge.action?.onClick) {
      nudge.action.onClick();
    }
  };

  const handleDismissNudge = (nudgeId: string) => {
    setDismissedNudges(prev => new Set([...prev, nudgeId]));
    
    console.info('nudge.dismissed', {
      nudgeId,
      persona,
      tier,
      timestamp: new Date().toISOString()
    });
  };

  const getTypeIcon = (type: Nudge['type']) => {
    switch (type) {
      case 'action':
        return <TrendingUp className="h-4 w-4" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityVariant = (priority: Nudge['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (nudges.length === 0) {
  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader className="pb-3 p-4">
        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm">
          No nudges—great job. Come back tomorrow for fresh suggestions.
        </p>
      </CardContent>
    </Card>
  );
  }

  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader className="pb-3 p-4">
        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Recommendations
          <Badge variant="outline" className="ml-auto text-xs">
            {nudges.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Personalized insights based on your {persona} profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {nudges.slice(0, 3).map((nudge) => (
          <Alert key={nudge.id} className="relative">
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 mt-0.5">
                {getTypeIcon(nudge.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <AlertDescription className="font-medium text-sm">
                    {nudge.title}
                  </AlertDescription>
                  <Badge 
                    variant={getPriorityVariant(nudge.priority)} 
                    className="text-xs px-1.5 py-0.5"
                  >
                    {nudge.priority}
                  </Badge>
                </div>
                
                <AlertDescription className="text-xs text-muted-foreground mb-2">
                  {nudge.description}
                </AlertDescription>
                
                {nudge.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleNudgeAction(nudge)}
                    className="h-7 text-xs"
                  >
                    {nudge.action.label}
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissNudge(nudge.id)}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        ))}
        
        {nudges.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-xs">
              View {nudges.length - 3} more recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};