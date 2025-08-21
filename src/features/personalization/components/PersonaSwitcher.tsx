import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, TrendingUp } from 'lucide-react';
import { usePersonalization } from '../PersonalizationContext';
import { Persona } from '../types';

interface PersonaSwitcherProps {
  className?: string;
  showTier?: boolean;
}

export function PersonaSwitcher({ className, showTier = false }: PersonaSwitcherProps) {
  const { state, updatePersona } = usePersonalization();

  const handlePersonaSwitch = (persona: Persona) => {
    if (persona !== state.persona) {
      updatePersona(persona);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">Mode:</span>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant={state.persona === 'aspiring' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePersonaSwitch('aspiring')}
          className="h-7 px-2 text-xs"
        >
          Aspiring
        </Button>
        <Button
          variant={state.persona === 'retiree' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePersonaSwitch('retiree')}
          className="h-7 px-2 text-xs"
        >
          Retiree
        </Button>
      </div>

      {showTier && (
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <Badge 
            variant={state.complexityTier === 'advanced' ? 'default' : 'outline'}
            className="text-xs"
          >
            {state.complexityTier}
          </Badge>
        </div>
      )}
    </div>
  );
}