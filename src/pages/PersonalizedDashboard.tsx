import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Crown, TrendingUp, User, Settings } from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getModuleOrder } from '@/features/personalization/personalization';
import { NudgePanel } from '@/components/NudgePanel';

// Mock dashboard modules for demonstration
const moduleComponents = {
  goals: () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Track your financial goals and progress</p>
      </CardContent>
    </Card>
  ),
  cashflow: () => (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Monitor income and expenses</p>
      </CardContent>
    </Card>
  ),
  vault: () => (
    <Card>
      <CardHeader>
        <CardTitle>Document Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Secure document storage</p>
      </CardContent>
    </Card>
  ),
  properties: () => (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Real estate portfolio</p>
      </CardContent>
    </Card>
  ),
  education: () => (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Financial education resources</p>
      </CardContent>
    </Card>
  ),
  income: () => (
    <Card>
      <CardHeader>
        <CardTitle>Income Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Retirement income strategies</p>
      </CardContent>
    </Card>
  ),
  hsa: () => (
    <Card>
      <CardHeader>
        <CardTitle>Health Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">HSA and healthcare planning</p>
      </CardContent>
    </Card>
  ),
  entities: () => (
    <Card>
      <CardHeader>
        <CardTitle>Legal Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Business entities and structures</p>
      </CardContent>
    </Card>
  ),
  'tax-planning': () => (
    <Card>
      <CardHeader>
        <CardTitle>Tax Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Advanced tax optimization</p>
      </CardContent>
    </Card>
  ),
  'estate-planning': () => (
    <Card>
      <CardHeader>
        <CardTitle>Estate Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Wealth transfer strategies</p>
      </CardContent>
    </Card>
  )
};

export default function PersonalizedDashboard() {
  const { persona, tier, setPersona, updateFacts } = usePersonalizationStore();
  const [showFamilyOfficeCard, setShowFamilyOfficeCard] = useState(tier === 'advanced');
  
  // Get module order based on current persona and tier
  const moduleOrder = getModuleOrder(persona, tier);
  
  React.useEffect(() => {
    if (tier === 'advanced') {
      setShowFamilyOfficeCard(true);
    }
  }, [tier]);

  const handlePersonaSwitch = (newPersona: typeof persona) => {
    setPersona(newPersona);
  };

  const handleTestFactsUpdate = () => {
    // Demo function to test tier changes
    updateFacts({
      entitiesCount: 3,
      estimatedLinkedAssetsUSD: 4_000_000,
      equityCompPresent: true
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with persona controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personalized Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your personalized financial dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Persona Switcher */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Mode:</span>
            <div className="flex gap-1">
              <Button
                variant={persona === 'aspiring' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePersonaSwitch('aspiring')}
                className="h-7 px-2 text-xs"
              >
                Aspiring
              </Button>
              <Button
                variant={persona === 'retiree' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePersonaSwitch('retiree')}
                className="h-7 px-2 text-xs"
              >
                Retiree
              </Button>
            </div>
          </div>
          
          {/* Tier Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={tier === 'advanced' ? 'default' : 'outline'}
              className="flex items-center gap-1"
            >
              {tier === 'advanced' && <Crown className="h-3 w-3" />}
              {tier}
            </Badge>
          </div>

          {/* Demo button to test tier changes */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTestFactsUpdate}
            className="text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            Test Advanced
          </Button>
        </div>
      </div>

      {/* Family Office Mode Card */}
      {showFamilyOfficeCard && tier === 'advanced' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">Family Office mode enabled</p>
                <p className="text-sm text-muted-foreground">
                  Advanced tools and features are now available
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFamilyOfficeCard(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Nudge Panel */}
      <NudgePanel />

      {/* Current Configuration Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Persona:</span> {persona}
            </div>
            <div>
              <span className="font-medium">Tier:</span> {tier}
            </div>
            <div>
              <span className="font-medium">Module Order:</span> {moduleOrder.join(' → ')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleOrder.map((moduleId, index) => {
          const ModuleComponent = moduleComponents[moduleId as keyof typeof moduleComponents];
          
          if (!ModuleComponent) {
            return (
              <Card key={moduleId}>
                <CardHeader>
                  <CardTitle>Unknown Module</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Module "{moduleId}" not found</p>
                </CardContent>
              </Card>
            );
          }
          
          return (
            <div 
              key={moduleId} 
              className="transform transition-all duration-300 ease-in-out animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 100}ms`
              }}
            >
              <ModuleComponent />
            </div>
          );
        })}
      </div>

      {/* Debug Information */}
      <Card className="mt-8 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Debug: Module Ordering Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Current Persona:</strong> {persona} → Base order: {
              persona === 'aspiring' 
                ? "['goals', 'cashflow', 'vault', 'properties', 'education']"
                : "['income', 'goals', 'hsa', 'vault', 'properties']"
            }
          </div>
          <div>
            <strong>Current Tier:</strong> {tier} → {
              tier === 'advanced' 
                ? "Base order + ['entities', 'tax-planning', 'estate-planning']"
                : "Base order only"
            }
          </div>
          <div>
            <strong>Final Order:</strong> [{moduleOrder.map(m => `'${m}'`).join(', ')}]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}