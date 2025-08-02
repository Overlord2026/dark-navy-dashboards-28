import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Home, 
  Building, 
  ChevronDown,
  Crown,
  Briefcase
} from "lucide-react";

type PersonaType = 'family' | 'realtor' | 'property_manager' | 'investor';

interface PersonaSwitcherProps {
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
}

export const PropertyPersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  currentPersona,
  onPersonaChange
}) => {
  const personas = [
    {
      id: 'family' as PersonaType,
      label: 'Family Office',
      icon: Crown,
      description: 'Manage your family\'s real estate portfolio',
      color: 'text-gold'
    },
    {
      id: 'realtor' as PersonaType,
      label: 'Real Estate Agent',
      icon: Home,
      description: 'Connect with clients and manage listings',
      color: 'text-green-600'
    },
    {
      id: 'property_manager' as PersonaType,
      label: 'Property Manager',
      icon: Building,
      description: 'Manage properties and tenant relationships',
      color: 'text-blue-600'
    },
    {
      id: 'investor' as PersonaType,
      label: 'Investor',
      icon: Briefcase,
      description: 'Track investment properties and ROI',
      color: 'text-purple-600'
    }
  ];

  const currentPersonaData = personas.find(p => p.id === currentPersona);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            {currentPersonaData && (
              <>
                <currentPersonaData.icon className={`h-4 w-4 ${currentPersonaData.color}`} />
                <span>{currentPersonaData.label}</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="p-2">
          <p className="text-sm font-medium mb-2">Switch Marketplace View</p>
          <p className="text-xs text-muted-foreground mb-3">
            See content tailored to your role
          </p>
        </div>
        <DropdownMenuSeparator />
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onClick={() => onPersonaChange(persona.id)}
            className={`p-3 cursor-pointer ${
              currentPersona === persona.id ? 'bg-primary/10' : ''
            }`}
          >
            <div className="flex items-start gap-3 w-full">
              <persona.icon className={`h-5 w-5 mt-0.5 ${persona.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{persona.label}</span>
                  {currentPersona === persona.id && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {persona.description}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};