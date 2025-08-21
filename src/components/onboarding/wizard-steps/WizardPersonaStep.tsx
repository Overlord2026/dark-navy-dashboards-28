import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target } from 'lucide-react';

interface WizardPersonaStepProps {
  onSelect: (persona: 'aspiring' | 'retiree') => void;
  currentPersona: 'aspiring' | 'retiree';
}

export function WizardPersonaStep({ onSelect, currentPersona }: WizardPersonaStepProps) {
  const personas = [
    {
      id: 'aspiring' as const,
      title: 'Aspiring',
      description: 'Building wealth and growing your financial foundation',
      icon: TrendingUp,
      color: 'emerald',
      keyFeatures: ['Goal-based planning', 'Investment basics', 'Emergency fund guidance']
    },
    {
      id: 'retiree' as const,
      title: 'Retiree',
      description: 'Preserving wealth and optimizing for retirement',
      icon: Target,
      color: 'blue',
      keyFeatures: ['Income planning', 'Healthcare costs', 'Legacy planning']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Who are we planning for today?</h2>
        <p className="text-muted-foreground">Choose the stage that best describes your situation</p>
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
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onSelect(persona.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
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
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {persona.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full mt-3"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(persona.id);
                  }}
                >
                  Choose {persona.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}