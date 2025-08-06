import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Target, BookOpen, Users, Crown } from 'lucide-react';
import { usePersona } from '@/hooks/usePersona';
import { useAuth } from '@/context/AuthContext';

export const PersonalizedCTA = () => {
  const { personaConfig } = usePersona();
  const { user } = useAuth();

  const getIcon = () => {
    switch (personaConfig.id) {
      case 'hnw_client':
        return Crown;
      case 'pre_retiree':
        return Calendar;
      case 'next_gen':
        return Target;
      case 'family_office_admin':
        return Users;
      default:
        return Target;
    }
  };

  const IconComponent = getIcon();

  const getGradient = () => {
    switch (personaConfig.id) {
      case 'hnw_client':
        return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'pre_retiree':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'next_gen':
        return 'from-emerald-50 to-green-50 border-emerald-200';
      case 'family_office_admin':
        return 'from-purple-50 to-violet-50 border-purple-200';
      default:
        return 'from-primary/5 to-secondary/5 border-primary/20';
    }
  };

  const getDescription = () => {
    switch (personaConfig.id) {
      case 'hnw_client':
        return 'Schedule a private consultation with your dedicated wealth advisor. Direct calendar access included.';
      case 'pre_retiree':
        return 'Review your retirement readiness with a certified advisor. Discuss Social Security timing and income strategies.';
      case 'next_gen':
        return 'Start building wealth with personalized goal setting. Track your progress with milestone rewards.';
      case 'family_office_admin':
        return 'Coordinate your family\'s wealth management. Add members, share documents, and manage permissions.';
      default:
        return 'Take the next step in your wealth journey.';
    }
  };

  return (
    <Card className={`bg-gradient-to-r ${getGradient()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-lg">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {personaConfig.primaryCTA}
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {getDescription()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {personaConfig.secondaryCTA && (
              <Button variant="outline" size="lg">
                {personaConfig.secondaryCTA}
              </Button>
            )}
            <Button size="lg" className="shadow-md">
              {personaConfig.primaryCTA}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};