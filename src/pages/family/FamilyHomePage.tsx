import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Upload, 
  Map, 
  Heart, 
  Calculator,
  UserPlus,
  Shield,
  FileText,
  TrendingUp,
  Play,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { ToolGate, ToolCard } from '@/components/shared/ToolGate';
import { ReadyBanner } from '@/components/shared/ReadyBanner';
import { listReceiptsForPro } from '@/features/receipts/selectors';

interface OnboardingData {
  segment: 'aspiring' | 'retirees';
  goals: string[];
  email: string;
  completedAt: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  toolKey: string;
  onClick: () => void;
}

interface FamilyTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  toolKey: string;
}

const familyTools: FamilyTool[] = [
  // Retirement Planning
  {
    id: 'retirement-roadmap',
    name: 'Retirement Roadmap',
    description: 'Comprehensive retirement planning and timeline',
    category: 'retirement',
    icon: 'Map',
    toolKey: 'retirement-roadmap'
  },
  {
    id: 'roth-ladder',
    name: 'Roth Conversion Ladder',
    description: 'Optimize Roth IRA conversion strategies',
    category: 'retirement',
    icon: 'TrendingUp',
    toolKey: 'roth-ladder'
  },
  {
    id: 'ss-timing',
    name: 'Social Security Timing',
    description: 'Optimize Social Security claiming strategy',
    category: 'retirement',
    icon: 'Clock',
    toolKey: 'ss-timing'
  },
  {
    id: 'rmd-check',
    name: 'RMD Calculator',
    description: 'Required minimum distribution planning',
    category: 'retirement',
    icon: 'Calculator',
    toolKey: 'rmd-check'
  },
  // Tax Planning
  {
    id: 'taxhub-diy',
    name: 'Tax Hub DIY',
    description: 'Self-service tax planning and optimization',
    category: 'tax',
    icon: 'FileText',
    toolKey: 'taxhub-diy'
  },
  // Wealth Management
  {
    id: 'wealth-vault',
    name: 'Wealth Vault',
    description: 'Secure document storage and management',
    category: 'wealth',
    icon: 'Shield',
    toolKey: 'wealth-vault'
  },
  {
    id: 'beneficiary-center',
    name: 'Beneficiary Center',
    description: 'Manage and review beneficiary designations',
    category: 'wealth',
    icon: 'Users',
    toolKey: 'beneficiary-center'
  },
  {
    id: 'financial-poa',
    name: 'Financial POA',
    description: 'Power of attorney management and verification',
    category: 'wealth',
    icon: 'FileText',
    toolKey: 'financial-poa'
  },
  // Health & Longevity
  {
    id: 'longevity-hub',
    name: 'Longevity Hub',
    description: 'Health and longevity planning tools',
    category: 'health',
    icon: 'Heart',
    toolKey: 'longevity-hub'
  },
  {
    id: 'consent-passport',
    name: 'Consent Passport',
    description: 'Healthcare consent and directive management',
    category: 'health',
    icon: 'Shield',
    toolKey: 'consent-passport'
  }
];

export const FamilyHomePage: React.FC = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState('retirement');
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);

  useEffect(() => {
    // Load onboarding data
    const stored = localStorage.getItem('family_onboarding');
    if (stored) {
      setOnboardingData(JSON.parse(stored));
    }

    // Load recent receipts
    const receipts = listReceiptsForPro().slice(0, 5);
    setRecentReceipts(receipts);

    // Track page view
    analytics.trackEvent('family.home.viewed');
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'invite-advisor',
      title: 'Invite Advisor',
      description: 'Connect with a financial advisor',
      icon: <UserPlus className="h-5 w-5" />,
      toolKey: 'advisor-invitation',
      onClick: () => {
        analytics.trackFamilyQuickAction('invite_advisor');
        toast.success('Advisor invitation feature opened');
      }
    },
    {
      id: 'vault-upload',
      title: 'Vault Upload',
      description: 'Securely store important documents',
      icon: <Upload className="h-5 w-5" />,
      toolKey: 'vault-upload',
      onClick: () => {
        analytics.trackFamilyQuickAction('vault_upload');
        toast.success('Document vault opened');
      }
    },
    {
      id: 'roadmap',
      title: 'Retirement Roadmap',
      description: 'Plan your retirement timeline',
      icon: <Map className="h-5 w-5" />,
      toolKey: 'retirement-roadmap',
      onClick: () => {
        analytics.trackFamilyQuickAction('roadmap');
        setActiveTab('retirement');
      }
    },
    {
      id: 'longevity',
      title: 'Longevity Planning',
      description: 'Health and longevity insights',
      icon: <Heart className="h-5 w-5" />,
      toolKey: 'longevity-hub',
      onClick: () => {
        analytics.trackFamilyQuickAction('longevity');
        setActiveTab('health');
      }
    },
    {
      id: 'annuity-calc',
      title: 'Annuity Calculator',
      description: 'Evaluate annuity products',
      icon: <Calculator className="h-5 w-5" />,
      toolKey: 'annuity-calculator',
      onClick: () => {
        analytics.trackFamilyQuickAction('annuity_calc');
        toast.success('Annuity calculator opened');
      }
    }
  ];

  const handleStartDemo = () => {
    analytics.trackEvent('demo.e2e.start', { persona: 'family', type: 'retiree' });
    toast.success('Starting 90-second family demo...');
    
    // In a real implementation, this would open the demo overlay
    setTimeout(() => {
      toast.success('Demo completed! Check your receipts.');
    }, 3000);
  };

  const getToolsByCategory = (category: string) => {
    return familyTools.filter(tool => tool.category === category);
  };

  const getSegmentTitle = () => {
    return onboardingData?.segment === 'aspiring' ? 'Aspiring Families' : 'Retiree Families';
  };

  const categories = [
    { id: 'retirement', label: 'Retirement', icon: TrendingUp },
    { id: 'tax', label: 'Tax Planning', icon: FileText },
    { id: 'wealth', label: 'Wealth Management', icon: Shield },
    { id: 'health', label: 'Health & Longevity', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Family Office Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              {onboardingData && (
                <Badge variant="secondary">
                  {getSegmentTitle()}
                </Badge>
              )}
              <Badge variant="outline" className="text-green-600">
                Demo Mode
              </Badge>
            </div>
          </div>
          <Button onClick={handleStartDemo} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Play Retiree Demo
          </Button>
        </div>

        {/* Ready Check Banner */}
        <ReadyBanner persona="family" />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map((action) => (
                <ToolCard
                  key={action.id}
                  toolKey={action.toolKey}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onClick={action.onClick}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tools Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Family Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        <category.icon className="h-4 w-4 mr-1" />
                        {category.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getToolsByCategory(category.id).map((tool) => (
                          <ToolCard
                            key={tool.id}
                            toolKey={tool.toolKey}
                            title={tool.name}
                            description={tool.description}
                            icon={<div className="h-5 w-5 bg-primary/20 rounded" />}
                            onClick={() => {
                              analytics.trackToolCardOpen(tool.toolKey);
                              toast.success(`${tool.name} opened`);
                            }}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Receipts Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentReceipts.length > 0 ? (
                  <div className="space-y-3">
                    {recentReceipts.map((receipt, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {receipt.type || 'Decision-RDS'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {receipt.action || 'calculation_completed'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {receipt.anchor_ref && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Verified ✓
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {new Date(receipt.timestamp || Date.now()).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <Download className="h-3 w-3 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No receipts yet. Use tools to generate proof slips.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};