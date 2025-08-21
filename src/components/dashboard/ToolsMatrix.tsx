import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonalizationStore } from '@/features/personalization/store';
import { useEntitlements } from '@/context/EntitlementsContext';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { 
  getAvailableTools, 
  getToolsByCategory, 
  hasToolAccess, 
  getUpgradePlanHint,
  createUpgradeIntentReceipt,
  ToolConfig 
} from '@/features/personalization/dashboard-modules';
import { 
  Calculator, 
  Clock, 
  TrendingUp, 
  Heart, 
  Building2, 
  Crown, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

interface ToolsMatrixProps {
  module?: string;
  className?: string;
}

const iconMap = {
  Calculator,
  Clock,
  TrendingUp,
  Heart,
  Building2,
  Crown
};

export function ToolsMatrix({ module, className }: ToolsMatrixProps) {
  const { persona, tier } = usePersonalizationStore();
  const { has, plan } = useEntitlements();
  const navigate = useNavigate();

  const toolsByCategory = getToolsByCategory(persona, tier);
  const availableTools = module 
    ? getAvailableTools(persona, tier, module)
    : getAvailableTools(persona, tier);

  const handleToolClick = (tool: ToolConfig) => {
    const userPlan = plan as 'basic' | 'premium' | 'elite';
    
    if (hasToolAccess(tool, userPlan)) {
      // User has access - navigate to tool
      navigate(`/tools/${tool.key}`);
      
      analytics.track('tool.accessed', {
        tool_key: tool.key,
        module: tool.module,
        persona,
        tier,
        plan: userPlan
      });
    } else {
      // User needs upgrade - route to pricing with feature param
      const planHint = getUpgradePlanHint(tool);
      const upgradeReceipt = createUpgradeIntentReceipt(tool, 'tools_matrix');
      
      // Log upgrade intent receipt
      console.log('Upgrade Intent Receipt:', upgradeReceipt);
      
      analytics.track('upgrade.intent', upgradeReceipt);
      
      // Navigate to pricing with specific feature and plan hint
      navigate(`/pricing?feature=${tool.key}&plan_hint=${planHint}`, {
        state: { scrollToCard: planHint }
      });
    }
  };

  const renderTool = (tool: ToolConfig) => {
    const userPlan = plan as 'basic' | 'premium' | 'elite';
    const hasAccess = hasToolAccess(tool, userPlan);
    const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Calculator;
    
    return (
      <Card 
        key={tool.key}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          hasAccess ? 'hover:border-primary/50' : 'opacity-75 hover:border-orange-300'
        }`}
        onClick={() => handleToolClick(tool)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                hasAccess ? 'bg-primary/10' : 'bg-orange-100'
              }`}>
                <IconComponent className={`h-5 w-5 ${
                  hasAccess ? 'text-primary' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!hasAccess && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Lock className="h-3 w-3 mr-1" />
                  {tool.entitlement}
                </Badge>
              )}
              {tool.tier === 'advanced' && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
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
              {tool.module} • {tool.persona} • {tool.tier}
            </div>
            
            <Button 
              variant={hasAccess ? "default" : "outline"}
              size="sm"
              className={hasAccess ? "" : "border-orange-300 text-orange-700 hover:bg-orange-50"}
            >
              {hasAccess ? 'Use Tool' : 'Upgrade'}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (module) {
    // Show tools for specific module
    return (
      <div className={className}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Tools</h3>
            <Badge variant="outline" className="text-xs">
              {availableTools.length} tools
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {availableTools.map(renderTool)}
          </div>
          
          {availableTools.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No tools available for this module with your current persona and tier.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show tools grouped by category
  return (
    <div className={className}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tools Matrix</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {persona} • {tier}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {plan} plan
            </Badge>
          </div>
        </div>

        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize">
                {category.replace(/_/g, ' ')}
              </h3>
              {category === 'family_office' && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Family Office
                </Badge>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {tools.map(renderTool)}
            </div>
          </div>
        ))}

        {Object.keys(toolsByCategory).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <div className="space-y-3">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold">No Tools Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete your onboarding or upgrade your plan to unlock personalized financial tools.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => navigate('/onboarding')}>
                    Complete Setup
                  </Button>
                  <Button onClick={() => navigate('/pricing')}>
                    View Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}