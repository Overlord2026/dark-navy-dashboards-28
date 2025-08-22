import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  Target, 
  Calculator, 
  FileText, 
  Shield, 
  TrendingUp, 
  Users,
  Wallet,
  Heart,
  Building,
  BookOpen,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/seo/SEOHead';
import catalogConfig from '@/config/catalogConfig.json';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  route: string;
  icon: any;
}

const SEGMENT_CHECKLISTS = {
  aspiring: [
    {
      id: 'connect-accounts',
      title: 'Connect accounts',
      description: 'Link bank and investment accounts for a complete view',
      category: 'organize',
      completed: false,
      route: '/family/accounts',
      icon: Wallet
    },
    {
      id: 'upload-docs',
      title: 'Upload key documents',
      description: 'Store important financial and estate documents securely',
      category: 'organize', 
      completed: false,
      route: '/family/vault',
      icon: FileText
    },
    {
      id: 'invite-professionals',
      title: 'Invite advisor/CPA/attorney',
      description: 'Collaborate with your trusted professionals',
      category: 'collaborate',
      completed: false,
      route: '/family/team',
      icon: Users
    },
    {
      id: 'retirement-roadmap',
      title: 'Run Retirement Roadmap',
      description: 'Plan your path to financial independence',
      category: 'plan',
      completed: false,
      route: '/tools/retirement-roadmap',
      icon: Target
    },
    {
      id: 'roth-ladder',
      title: 'Set Roth Ladder plan',
      description: 'Multi-year tax optimization strategy',
      category: 'plan',
      completed: false,
      route: '/tools/roth-ladder',
      icon: Calculator
    },
    {
      id: 'longevity-hub',
      title: 'Start Longevity Hub',
      description: 'Begin your health and wellness journey',
      category: 'plan',
      completed: false,
      route: '/family/longevity',
      icon: Heart
    }
  ],
  retirees: [
    {
      id: 'ss-optimizer',
      title: 'Run SS Optimizer',
      description: 'Find the best Social Security claiming strategy',
      category: 'plan',
      completed: false,
      route: '/tools/social-security',
      icon: Calculator
    },
    {
      id: 'rmd-check',
      title: 'Check RMD path',
      description: 'Ensure compliance with required distributions',
      category: 'comply',
      completed: false,
      route: '/tools/rmd-check',
      icon: Shield
    },
    {
      id: 'upload-estate',
      title: 'Upload Will/Trust to Vault',
      description: 'Secure storage for estate planning documents',
      category: 'organize',
      completed: false,
      route: '/tools/wealth-vault',
      icon: FileText
    },
    {
      id: 'financial-poa',
      title: 'Add Financial POA',
      description: 'Set up power of attorney documentation',
      category: 'collaborate',
      completed: false,
      route: '/tools/financial-poa',
      icon: Users
    },
    {
      id: 'annuities-review',
      title: 'Review Annuities (calcs)',
      description: 'Explore income generation options',
      category: 'plan',
      completed: false,
      route: '/solutions/annuities/calculators',
      icon: TrendingUp
    },
    {
      id: 'private-markets',
      title: 'Explore Private Markets (readiness)',
      description: 'Check eligibility for private investments',
      category: 'plan',
      completed: false,
      route: '/solutions/investments/private-markets',
      icon: Building
    }
  ]
};

const TOOL_CATEGORIES = [
  { id: 'money', label: 'Money & Planning', icon: Calculator, color: 'text-blue-600' },
  { id: 'tax', label: 'Tax Planning', icon: FileText, color: 'text-green-600' },
  { id: 'estate', label: 'Estate & Legacy', icon: Shield, color: 'text-purple-600' },
  { id: 'health', label: 'Health & Longevity', icon: Heart, color: 'text-red-600' },
  { id: 'vault', label: 'Vault & Receipts', icon: FileText, color: 'text-indigo-600' },
  { id: 'markets', label: 'Annuities & Private Markets', icon: TrendingUp, color: 'text-orange-600' }
];

export const FamilyHome: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const isWelcome = searchParams.get('welcome') === 'true';

  useEffect(() => {
    // Load onboarding data
    const stored = localStorage.getItem('family_onboarding');
    if (stored) {
      const data = JSON.parse(stored);
      setOnboardingData(data);
      
      // Load appropriate checklist
      const segmentChecklist = SEGMENT_CHECKLISTS[data.segment as keyof typeof SEGMENT_CHECKLISTS] || [];
      setChecklist(segmentChecklist);
    }

    // Show welcome toast
    if (isWelcome) {
      toast({
        title: "Welcome to your family workspace!",
        description: "Everything you need to organize, plan, and protect your family's future—in one place.",
      });
    }
  }, [isWelcome, toast]);

  const handleChecklistToggle = (itemId: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const completedItems = checklist.filter(item => item.completed).length;
  const progressPercentage = checklist.length > 0 ? (completedItems / checklist.length) * 100 : 0;

  const getCategoryTools = (category: string) => {
    const categoryMap: Record<string, string[]> = {
      money: ['retirement-roadmap', 'ss-optimizer', 'roth-ladder'],
      tax: ['taxhub-diy', 'nua-analyzer', 'daf-crt'],
      estate: ['wealth-vault', 'beneficiary-center', 'financial-poa'],
      health: ['longevity-hub', 'consent-passport'],
      vault: ['receipts-viewer'],
      markets: ['annuities-education', 'annuities-calcs', 'private-markets']
    };

    return (catalogConfig as any[])
      .filter(tool => categoryMap[category]?.includes(tool.key))
      .slice(0, 4);
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      {onboardingData && (
        <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-gold" />
              {onboardingData.segment === 'aspiring' ? 'Aspiring Family' : 'Retiree Family'} Workspace
            </CardTitle>
            <CardDescription>
              Your goals: {onboardingData.goals?.map((g: string) => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Connect Accounts', icon: Wallet, route: '/family/accounts', description: 'Link bank & investment accounts' },
          { title: 'Upload Documents', icon: FileText, route: '/family/vault', description: 'Store important documents' },
          { title: 'Invite Team', icon: Users, route: '/family/team', description: 'Add trusted professionals' },
          { title: 'View Receipts', icon: Shield, route: '/receipts', description: 'See proof of all actions' }
        ].map((action) => (
          <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow group">
            <CardHeader className="text-center pb-2">
              <action.icon className="h-8 w-8 mx-auto text-primary group-hover:scale-110 transition-transform" />
              <CardTitle className="text-sm">{action.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs text-center">
                {action.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      {checklist.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Getting Started Checklist</CardTitle>
              <Badge variant="outline">
                {completedItems} of {checklist.length} complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklist.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleChecklistToggle(item.id)}
                >
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            
            {checklist.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => setActiveTab('checklist')}
              >
                View all {checklist.length} items
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderToolsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Family Office Tools</h2>
        <p className="text-muted-foreground">
          Everything you need to organize, plan, and protect your family's future
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOL_CATEGORIES.map((category) => {
          const tools = getCategoryTools(category.id);
          const IconComponent = category.icon;
          
          return (
            <Card key={category.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-6 w-6 ${category.color}`} />
                  <CardTitle className="text-lg">{category.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tools.map((tool: any) => (
                  <div 
                    key={tool.key}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(tool.route)}
                  >
                    <div>
                      <div className="font-medium text-sm">{tool.label}</div>
                      <div className="text-xs text-muted-foreground">{tool.summary}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                
                {tools.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Plus className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Tools coming soon</div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderChecklistTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <p className="text-muted-foreground">
            Complete these steps to set up your family workspace
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-muted-foreground">Complete</div>
        </div>
      </div>

      <Progress value={progressPercentage} className="h-3" />

      <div className="space-y-4">
        {checklist.map((item) => (
          <Card 
            key={item.id} 
            className={`cursor-pointer transition-all duration-200 ${
              item.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
            }`}
            onClick={() => navigate(item.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChecklistToggle(item.id);
                  }}
                  className="flex-shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                
                <item.icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                
                <div className="flex-1">
                  <div className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Family Home - Your Family Office Dashboard"
        description="Your secure family office workspace. Organize finances, plan for the future, and collaborate with trusted professionals—all in one place."
        keywords={['family office', 'financial planning', 'family dashboard', 'wealth management']}
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Family Workspace</h1>
          <p className="text-muted-foreground">
            Your secure hub for organizing, planning, and protecting your family's future
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="checklist" className="relative">
              Checklist
              {checklist.length > 0 && completedItems < checklist.length && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {checklist.length - completedItems}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="tools">
            {renderToolsTab()}
          </TabsContent>

          <TabsContent value="checklist">
            {renderChecklistTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};