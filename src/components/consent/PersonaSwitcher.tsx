// @ts-nocheck
import { useState } from 'react';
import { Check, User, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePersonaAuth, type Persona, type PersonaKind } from '@/hooks/usePersonaAuth';
import { toast } from 'sonner';

const PERSONA_LABELS: Record<PersonaKind, string> = {
  client: 'Client',
  advisor: 'Advisor',
  agent: 'Agent',
  guardian: 'Guardian',
  coach: 'Coach',
  sponsor: 'Sponsor',
  admin: 'Administrator'
};

const PERSONA_ICONS: Record<PersonaKind, typeof User> = {
  client: User,
  advisor: User,
  agent: Shield,
  guardian: Shield,
  coach: User,
  sponsor: User,
  admin: AlertCircle
};

interface PersonaSwitcherProps {
  onPersonaChange?: (persona: Persona) => void;
}

export default function PersonaSwitcher({ onPersonaChange }: PersonaSwitcherProps) {
  const { 
    currentPersona, 
    personas, 
    switchPersona, 
    isLoading 
  } = usePersonaAuth();
  const [switching, setSwitching] = useState(false);

  const handlePersonaSwitch = async (persona: Persona) => {
    if (persona.id === currentPersona?.id) return;

    setSwitching(true);
    try {
      const receipt = await switchPersona(persona);
      
      if (receipt) {
        toast.success(`Switched to ${PERSONA_LABELS[persona.kind]} mode`, {
          description: `Reason: ${receipt.reason_code}`
        });
        onPersonaChange?.(persona);
      } else {
        toast.error('Failed to switch persona');
      }
    } catch (error) {
      console.error('Persona switch error:', error);
      toast.error('Error switching persona');
    } finally {
      setSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-64">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded flex-1"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPersona) {
    return (
      <Card className="w-64">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">No active persona</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CurrentIcon = PERSONA_ICONS[currentPersona.kind];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-64 justify-start"
          disabled={switching}
        >
          <CurrentIcon className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left">
            {PERSONA_LABELS[currentPersona.kind]}
          </span>
          <Badge variant="secondary" className="ml-2 text-xs">
            Active
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {personas.map((persona) => {
          const Icon = PERSONA_ICONS[persona.kind];
          const isActive = persona.id === currentPersona.id;
          
          return (
            <DropdownMenuItem
              key={persona.id}
              onClick={() => handlePersonaSwitch(persona)}
              className="flex items-center justify-between"
              disabled={switching || isActive}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{PERSONA_LABELS[persona.kind]}</span>
              </div>
              {isActive && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}