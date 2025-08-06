import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Target, Users } from 'lucide-react';
import { ClientPersona, PERSONA_CONFIGS } from '@/types/personas';
import { usePersona } from '@/hooks/usePersona';

export const PersonaSelector = () => {
  const { persona, updatePersona, availablePersonas } = usePersona();

  const getIcon = (personaId: ClientPersona) => {
    switch (personaId) {
      case 'hnw_client': return Crown;
      case 'pre_retiree': return Calendar;
      case 'next_gen': return Target;
      case 'family_office_admin': return Users;
      default: return Target;
    }
  };

  const getGradient = (personaId: ClientPersona) => {
    switch (personaId) {
      case 'hnw_client': return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'pre_retiree': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'next_gen': return 'from-emerald-50 to-green-50 border-emerald-200';
      case 'family_office_admin': return 'from-purple-50 to-violet-50 border-purple-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Choose Your Experience
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize your dashboard for your wealth journey stage
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePersonas.map((personaConfig) => {
          const IconComponent = getIcon(personaConfig.id);
          const isSelected = persona === personaConfig.id;

          return (
            <Card 
              key={personaConfig.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } bg-gradient-to-r ${getGradient(personaConfig.id)}`}
              onClick={() => updatePersona(personaConfig.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-white/80'}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{personaConfig.name}</h4>
                    {isSelected && (
                      <Badge variant="default" className="text-xs mt-1">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {personaConfig.welcomeMessage.replace('{name}', 'you')}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium">Key Features:</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {personaConfig.features.showLegacyVault && <li>• Family Legacy Vault</li>}
                    {personaConfig.features.showRetirementTimeline && <li>• Retirement Timeline</li>}
                    {personaConfig.features.showMilestoneTracker && <li>• Milestone Tracker</li>}
                    {personaConfig.features.showUserManagement && <li>• Family Management</li>}
                    {personaConfig.features.showPrivateInvestments && <li>• Private Investments</li>}
                    {personaConfig.features.showEducationBasics && <li>• Educational Basics</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};