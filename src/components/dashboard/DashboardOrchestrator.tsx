import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getModuleOrder, getAvailableTools, getToolsByCategory, hasToolAccess, createUpgradeIntentReceipt } from '@/features/personalization/dashboard-modules';
import { useEntitlements } from '@/context/EntitlementsContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, ChevronRight, TrendingUp, Calculator, Building2, Heart, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

const getModuleIcon = (moduleId: string) => {
  switch (moduleId) {
    case 'goals': return <TrendingUp className="h-5 w-5" />;
    case 'cashflow': return <Calculator className="h-5 w-5" />;
    case 'income': return <Calculator className="h-5 w-5" />;
    case 'hsa': return <Heart className="h-5 w-5" />;
    case 'family_office': return <Building2 className="h-5 w-5" />;
    default: return <TrendingUp className="h-5 w-5" />;
  }
};

const getToolIcon = (toolKey: string) => {
  switch (toolKey) {
    case 'roth_conversion_ladder': return <RotateCcw className="h-4 w-4" />;
    case 'entity_trust_summary': return <Building2 className="h-4 w-4" />;
    case 'charitable_trust': return <Heart className="h-4 w-4" />;
    default: return <Calculator className="h-4 w-4" />;
  }
};

export const DashboardOrchestrator: React.FC = () => {
  const { persona, tier } = usePersonalizationStore();
  const { plan } = useEntitlements();
  const navigate = useNavigate();
  const { toast } = useToast();

  const moduleOrder = getModuleOrder(persona, tier);
  const toolsByCategory = getToolsByCategory(persona, tier);

  const handleToolClick = (tool: any) => {
    const userPlan = plan as 'basic' | 'premium' | 'elite';
    
    if (!hasToolAccess(tool, userPlan)) {
      // Create upgrade intent receipt
      const receipt = createUpgradeIntentReceipt(tool, 'dashboard_orchestrator');
      
      analytics.track('upgrade_intent', receipt);
      
      toast({
        title: "Feature Locked",
        description: `${tool.name} requires ${tool.entitlement} plan or higher`,
        action: (
          <Button
            size="sm"
            onClick={() => navigate(`/pricing?feature=${tool.key}&plan_hint=${tool.entitlement}`)}
          >
            Upgrade
          </Button>
        ),
      });
      return;
    }

    // Log tool access
    analytics.track('tool.accessed', {
      toolKey: tool.key,
      toolName: tool.name,
      module: tool.module,
      persona,
      tier,
      timestamp: new Date().toISOString()
    });

    // Navigate to tool
    navigate(`/tools/${tool.key}`);
  };

  return (
    <div className="space-y-6">
      {/* Module Order Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleOrder.map((moduleId, index) => (
          <Card key={moduleId} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getModuleIcon(moduleId)}
                  <CardTitle className="text-lg capitalize">
                    {moduleId.replace('_', ' ')}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
              <CardDescription>
                {moduleId === 'family_office' ? 'Advanced wealth management tools' : 
                 `${persona} focused ${moduleId} tools`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(`/dashboard/${moduleId}`)}
              >
                View Module
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available Tools</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{persona}</Badge>
            <Badge variant={tier === 'advanced' ? 'default' : 'secondary'}>
              {tier}
            </Badge>
          </div>
        </div>

        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize">
                {category.replace('_', ' ')} Tools
              </h3>
              {category === 'family_office' && (
                <Badge variant="default" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Advanced
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {tools.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => {
                const userPlan = plan as 'basic' | 'premium' | 'elite';
                const hasAccess = hasToolAccess(tool, userPlan);
                
                return (
                  <Card 
                    key={tool.key}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !hasAccess ? 'opacity-75 border-dashed' : ''
                    } ${category === 'family_office' ? 'border-primary/20' : ''}`}
                    onClick={() => handleToolClick(tool)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getToolIcon(tool.key)}
                          <CardTitle className="text-base">{tool.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          {!hasAccess && <Lock className="h-3 w-3 text-muted-foreground" />}
                          <Badge 
                            variant={hasAccess ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {tool.entitlement}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant={hasAccess ? "outline" : "ghost"}
                        size="sm" 
                        className="w-full"
                        disabled={!hasAccess}
                      >
                        {hasAccess ? 'Open Tool' : `Requires ${tool.entitlement}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Tier Unlock Notice */}
      {tier === 'foundational' && (
        <Card className="border-dashed bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Family Office Tools Available
            </CardTitle>
            <CardDescription>
              Advanced complexity detected. Unlock Family Office tools including Entity & Trust Summary, 
              Roth Conversion Ladder, and Equity Compensation Planning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/pricing?feature=family_office&plan_hint=premium')}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              Unlock Family Office
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};