import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PersonaSelectionProps {
  onSelect: (persona: 'aspiring' | 'retiree') => void;
  currentPersona: 'aspiring' | 'retiree';
  isLoading?: boolean;
}

export function PersonaSelection({ onSelect, currentPersona, isLoading }: PersonaSelectionProps) {
  const navigate = useNavigate();
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

      <div className="grid md:grid-cols-2 gap-6">
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isSelected = currentPersona === persona.id;
          
          return (
            <Card 
              key={persona.id}
              className={`cursor-pointer transition-all duration-300 min-h-[320px] ${
                isSelected 
                  ? 'bg-[hsl(var(--luxury-navy))] border-2 border-[hsl(var(--luxury-gold))] shadow-[0_8px_32px_rgba(212,175,55,0.3)]' 
                  : 'bg-[hsl(var(--luxury-navy))] border border-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-purple))] hover:shadow-[0_12px_48px_rgba(94,23,235,0.4)] hover:scale-[1.02]'
              }`}
              onClick={() => !isLoading && onSelect(persona.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[hsl(var(--luxury-gold))]/20 border border-[hsl(var(--luxury-gold))]/30">
                    <Icon className="h-7 w-7 text-[hsl(var(--luxury-gold))]" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-[hsl(var(--luxury-white))]">{persona.title}</CardTitle>
                    <p className="text-sm text-[hsl(var(--luxury-white))]/80 mt-1">{persona.description}</p>
                  </div>
                  {isSelected && (
                    <Badge className="text-xs bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))] font-semibold">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  {persona.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--luxury-gold))] shadow-sm" />
                      <span className="text-[hsl(var(--luxury-white))]/90 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-[hsl(var(--luxury-gold))]/30">
                  <Clock className="h-4 w-4 text-[hsl(var(--luxury-gold))]" />
                  <span className="text-xs text-[hsl(var(--luxury-white))]/70 font-medium">
                    Time to dashboard: {persona.timeToValue}
                  </span>
                </div>

                <Button 
                  className={`w-full mt-4 h-12 text-base font-semibold transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))] hover:bg-[hsl(var(--luxury-gold))]/90 shadow-[0_4px_16px_rgba(212,175,55,0.4)]' 
                      : 'bg-transparent border-2 border-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-gold))] hover:text-[hsl(var(--luxury-navy))]'
                  }`}
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(persona.id);
                    navigate(`/build-workspace?persona=${persona.id}`);
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