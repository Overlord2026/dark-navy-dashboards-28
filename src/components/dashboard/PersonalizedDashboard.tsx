import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonalizationStore } from '@/features/personalization/store';
import { useEntitlements } from '@/context/EntitlementsContext';
import { useNavigate } from 'react-router-dom';
import { getModuleOrder } from '@/features/personalization/dashboard-modules';
import { ToolsMatrix } from './ToolsMatrix';
import { 
  Target, 
  DollarSign, 
  Vault, 
  Home, 
  GraduationCap, 
  TrendingUp,
  Heart,
  Crown,
  ArrowRight,
  Settings
} from 'lucide-react';

const moduleIcons = {
  goals: Target,
  cashflow: DollarSign,
  vault: Vault,
  properties: Home,
  education: GraduationCap,
  income: TrendingUp,
  hsa: Heart,
  family_office: Crown
};

const moduleDescriptions = {
  goals: 'Set and track your financial objectives',
  cashflow: 'Monitor income, expenses, and cash flow',
  vault: 'Secure document storage and organization',
  properties: 'Real estate and property management',
  education: 'Financial literacy and learning resources',
  income: 'Retirement income planning and optimization',
  hsa: 'Health Savings Account planning and management',
  family_office: 'Advanced multi-entity and trust management'
};

interface PersonalizedDashboardProps {
  className?: string;
}

export function PersonalizedDashboard({ className }: PersonalizedDashboardProps) {
  const { persona, tier, setPersona } = usePersonalizationStore();
  const { plan } = useEntitlements();
  const navigate = useNavigate();

  // Get personalized module order
  const moduleOrder = getModuleOrder(persona, tier);

  // Update module order when persona/tier changes
  useEffect(() => {
    console.log('Module order updated:', { persona, tier, modules: moduleOrder });
  }, [persona, tier, moduleOrder]);

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'family_office') {
      navigate('/family-office');
    } else {
      navigate(`/dashboard/${moduleId}`);
    }
  };

  const handlePersonaSwitch = (newPersona: 'aspiring' | 'retiree') => {
    setPersona(newPersona);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Persona Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Personalized Dashboard</h1>
          <p className="text-muted-foreground">
            Modules ordered for {persona} • {tier} complexity
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Persona Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Switch:</span>
            <div className="flex gap-1">
              <Button
                variant={persona === 'aspiring' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePersonaSwitch('aspiring')}
              >
                Aspiring
              </Button>
              <Button
                variant={persona === 'retiree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePersonaSwitch('retiree')}
              >
                Retiree
              </Button>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tier Badge for Advanced Users */}
      {tier === 'advanced' && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Family Office Mode Activated</h3>
                <p className="text-sm text-yellow-700">
                  Advanced tools and multi-entity features are now available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Modules */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Dashboard Modules</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleOrder.map((moduleId, index) => {
            const IconComponent = moduleIcons[moduleId as keyof typeof moduleIcons] || Target;
            const description = moduleDescriptions[moduleId as keyof typeof moduleDescriptions] || '';
            const isFamilyOffice = moduleId === 'family_office';
            
            return (
              <Card 
                key={moduleId}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${
                  isFamilyOffice ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
                }`}
                onClick={() => handleModuleClick(moduleId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isFamilyOffice ? 'bg-yellow-100' : 'bg-primary/10'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          isFamilyOffice ? 'text-yellow-600' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-base capitalize">
                          {moduleId.replace('_', ' ')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      {isFamilyOffice && (
                        <Badge variant="default" className="bg-yellow-500 text-white text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          FO
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {isFamilyOffice ? 'Advanced tier only' : `${persona} priority`}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      Open <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tools Matrix */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <ToolsMatrix />
        </div>
      </div>

      {/* Plan Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Current Plan: {plan}</h3>
              <p className="text-sm text-blue-700">
                {tier === 'advanced' 
                  ? 'All advanced features unlocked for complex financial situations'
                  : 'Essential tools available for your financial planning needs'
                }
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}