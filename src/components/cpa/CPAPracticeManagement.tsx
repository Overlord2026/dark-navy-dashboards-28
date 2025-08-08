import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CPACrmClientOverview } from './CPACrmClientOverview';
import { CPAAdvancedTaxPlanning } from './CPAAdvancedTaxPlanning';
import { CPAMarketingEngine } from './CPAMarketingEngine';
import { CPAComplianceTracking } from './CPAComplianceTracking';
import { CPAReportsAnalytics } from './CPAReportsAnalytics';
import { PremiumUpgradePrompt } from '../advisor/PremiumUpgradePrompt';
import { 
  Users, 
  Calculator, 
  Target, 
  Shield, 
  BarChart3,
  Crown,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface CPAPracticeManagementProps {
  isPremium?: boolean;
}

export const CPAPracticeManagement: React.FC<CPAPracticeManagementProps> = ({ 
  isPremium = false 
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const practiceModules = [
    {
      id: 'crm',
      title: 'CRM & Client Overview',
      description: 'Manage clients, notes, and tax-related tasks',
      icon: Users,
      isPremium: false,
      metrics: { clients: 78, tasks: 23, deadlines: 8 },
      component: CPACrmClientOverview
    },
    {
      id: 'tax-planning',
      title: 'Advanced Tax Planning',
      description: 'Multi-year scenarios, Roth conversions, entity structure',
      icon: Calculator,
      isPremium: true,
      metrics: { scenarios: 12, conversions: 5, entities: 18 },
      component: CPAAdvancedTaxPlanning
    },
    {
      id: 'marketing',
      title: 'Marketing Engine',
      description: 'Tax deadline campaigns and client outreach',
      icon: Target,
      isPremium: true,
      metrics: { campaigns: 6, leads: 42, conversion: '15%' },
      component: CPAMarketingEngine
    },
    {
      id: 'compliance',
      title: 'Compliance & CE Tracking',
      description: 'IRS/state compliance and continuing education',
      icon: Shield,
      isPremium: true,
      metrics: { credits: 28, required: 40, alerts: 3 },
      component: CPAComplianceTracking
    },
    {
      id: 'analytics',
      title: 'Reports & Analytics',
      description: 'Client profitability and service tracking',
      icon: BarChart3,
      isPremium: true,
      metrics: { growth: '+31%', profit: '285%', retention: '94%' },
      component: CPAReportsAnalytics
    }
  ];

  const handleModuleClick = (moduleId: string, isPremiumFeature: boolean) => {
    if (isPremiumFeature && !isPremium) {
      setShowUpgrade(true);
      return;
    }
    setActiveTab(moduleId);
  };

  const renderModuleCard = (module: typeof practiceModules[0]) => {
    const IconComponent = module.icon;
    const isLocked = module.isPremium && !isPremium;

    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        className="cursor-pointer"
        onClick={() => handleModuleClick(module.id, module.isPremium)}
      >
        <Card className={`h-full border-2 transition-all duration-200 hover:border-primary/50 ${
          isLocked ? 'bg-muted/20' : 'hover:shadow-lg'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isLocked ? 'bg-muted' : 'bg-primary/10'
                }`}>
                  <IconComponent className={`h-5 w-5 ${
                    isLocked ? 'text-muted-foreground' : 'text-primary'
                  }`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </div>
              </div>
              {module.isPremium && (
                <Badge variant={isPremium ? "default" : "secondary"} className="text-xs">
                  {isPremium ? <CheckCircle className="h-3 w-3 mr-1" /> : <Crown className="h-3 w-3 mr-1" />}
                  Premium
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(module.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className={`text-lg font-bold ${
                    isLocked ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {isLocked ? '---' : value}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {key}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant={isLocked ? "outline" : "default"} 
              size="sm" 
              className="w-full"
              disabled={isLocked}
            >
              {isLocked ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Access
                </>
              ) : (
                <>
                  Open Module
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (activeTab !== 'overview') {
    const activeModule = practiceModules.find(m => m.id === activeTab);
    if (activeModule) {
      const ComponentToRender = activeModule.component;
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Overview
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{activeModule.title}</h2>
              <p className="text-muted-foreground">{activeModule.description}</p>
            </div>
          </div>
          <ComponentToRender isPremium={isPremium} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">CPA Practice Management</h2>
          <p className="text-muted-foreground">
            Your complete CPA toolkit for tax planning, client management, and practice growth
          </p>
        </div>
        {!isPremium && (
          <Button onClick={() => setShowUpgrade(true)} className="gap-2">
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practiceModules.map(renderModuleCard)}
      </div>

      {showUpgrade && (
        <PremiumUpgradePrompt 
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="CPA Practice Management Tools"
        />
      )}
    </div>
  );
};