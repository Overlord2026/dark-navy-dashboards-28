import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users, Clock } from 'lucide-react';

interface PersonaSelectionProps {
  onSelect: (persona: 'aspiring' | 'retiree') => void;
  currentPersona: 'aspiring' | 'retiree';
  isLoading?: boolean;
}

export function PersonaSelection({ onSelect, currentPersona, isLoading }: PersonaSelectionProps) {
  const personas = [
    {
      id: 'aspiring' as const,
      title: 'Building Wealth',
      description: 'Growing your financial foundation',
      icon: TrendingUp,
      features: [
        'Goal-based planning',
        'Investment basics',
        'Emergency fund guidance',
        'Career optimization'
      ],
      timeToValue: '< 10 minutes',
      color: 'emerald'
    },
    {
      id: 'retiree' as const,
      title: 'Retirement Focus',
      description: 'Preserving and optimizing for retirement',
      icon: Target,
      features: [
        'Income planning',
        'Healthcare costs',
        'Social Security optimization',
        'Legacy planning'
      ],
      timeToValue: '< 12 minutes',
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What describes your financial stage?</h2>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isSelected = currentPersona === persona.id;
          
          return (
            <Card 
              key={persona.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? `ring-2 ring-${persona.color}-500 bg-${persona.color}-50` 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => !isLoading && onSelect(persona.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${persona.color}-100`}>
                    <Icon className={`h-5 w-5 text-${persona.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{persona.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {persona.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${persona.color}-500`} />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Time to dashboard: {persona.timeToValue}
                  </span>
                </div>

                <Button 
                  className="w-full mt-3"
                  variant={isSelected ? "default" : "outline"}
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(persona.id);
                  }}
                >
                  {isLoading && isSelected ? 'Setting up...' : `Choose ${persona.title}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Don't worry - you can always change this later in your profile settings
        </p>
      </div>
    </div>
  );
}