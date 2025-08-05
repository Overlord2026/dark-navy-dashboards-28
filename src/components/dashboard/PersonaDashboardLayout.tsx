import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonaOnboardingFlow } from '@/components/onboarding/PersonaOnboardingFlow';
import { InviteFlowModal } from '@/components/viral/InviteFlowModal';
import { VIPBadge, getVIPStatus } from '@/components/badges/VIPBadgeSystem';
import { useUser } from '@/context/UserContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PersonaType } from '@/types/personas';
import { 
  TrendingUp, 
  Users, 
  Target, 
  ArrowRight, 
  Plus, 
  Bell,
  ChevronRight,
  Star,
  BookOpen,
  Calculator,
  Shield,
  Crown,
  UserPlus
} from 'lucide-react';

interface DashboardSection {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'coming-soon' | 'premium';
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  metrics?: {
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
  };
}

interface PersonaDashboardLayoutProps {
  children?: React.ReactNode;
}

export const PersonaDashboardLayout: React.FC<PersonaDashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const role = userProfile?.role || 'client';
  const tier = userProfile?.client_tier || 'basic';
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Check for VIP status
  const vipStatus = getVIPStatus(role as PersonaType, userProfile);
  const isVIP = vipStatus !== null;

  useEffect(() => {
    const onboardingKey = `onboarding-completed-${role}-${tier}`;
    const hasCompleted = localStorage.getItem(onboardingKey);
    
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, [role, tier]);

  const getDashboardSections = (): DashboardSection[] => {
    const sections = {
      client: [
        {
          id: 'wealth-overview',
          title: 'Wealth Overview',
          description: 'Track your net worth and investment performance',
          priority: 'high' as const,
          status: 'active' as const,
          icon: TrendingUp,
          href: '/wealth',
          metrics: {
            value: '$2.4M',
            label: 'Total Net Worth',
            trend: 'up' as const
          }
        },
        {
          id: 'education',
          title: 'Education Center',
          description: 'Learn about financial planning and investment strategies',
          priority: 'medium' as const,
          status: 'active' as const,
          icon: BookOpen,
          href: '/education'
        },
        {
          id: 'tax-planning',
          title: 'Tax Planning',
          description: 'Optimize your tax strategy with our calculators',
          priority: 'high' as const,
          status: tier === 'premium' ? 'active' as const : 'premium' as const,
          icon: Calculator,
          href: '/tax-planning'
        },
        {
          id: 'insurance',
          title: 'Insurance Review',
          description: 'Ensure adequate protection for your family',
          priority: 'medium' as const,
          status: 'active' as const,
          icon: Shield,
          href: '/insurance'
        }
      ] as DashboardSection[],
      advisor: [
        {
          id: 'client-overview',
          title: 'Client Overview',
          description: 'Manage your client relationships and portfolios',
          priority: 'high' as const,
          status: 'active' as const,
          icon: Users,
          href: '/advisor/clients',
          metrics: {
            value: '42',
            label: 'Active Clients',
            trend: 'up' as const
          }
        },
        {
          id: 'aum-tracking',
          title: 'AUM Tracking',
          description: 'Monitor total assets under management',
          priority: 'high' as const,
          status: 'active' as const,
          icon: TrendingUp,
          metrics: {
            value: '$347.9M',
            label: 'Total AUM',
            trend: 'up' as const
          }
        },
        {
          id: 'prospect-pipeline',
          title: 'Prospect Pipeline',
          description: 'Track and nurture potential new clients',
          priority: 'medium' as const,
          status: 'active' as const,
          icon: Target,
          href: '/advisor/prospects'
        }
      ] as DashboardSection[],
      accountant: [
        {
          id: 'tax-deadlines',
          title: 'Tax Deadlines',
          description: 'Upcoming filing deadlines and important dates',
          priority: 'high' as const,
          status: 'active' as const,
          icon: Calculator,
          metrics: {
            value: '7',
            label: 'Upcoming Deadlines',
            trend: 'neutral' as const
          }
        },
        {
          id: 'client-returns',
          title: 'Client Returns',
          description: 'Manage tax preparation for all clients',
          priority: 'high' as const,
          status: 'active' as const,
          icon: Users
        }
      ] as DashboardSection[],
      consultant: [
        {
          id: 'active-projects',
          title: 'Active Projects',
          description: 'Current consulting engagements and deliverables',
          priority: 'high' as const,
          status: 'active' as const,
          icon: Target,
          metrics: {
            value: '5',
            label: 'Active Projects',
            trend: 'up' as const
          }
        }
      ] as DashboardSection[],
      attorney: [
        {
          id: 'estate-planning',
          title: 'Estate Planning',
          description: 'Manage client estate plans and legal documents',
          priority: 'high' as const,
          status: 'active' as const,
          icon: Shield,
          href: '/estate-planning'
        }
      ] as DashboardSection[],
      admin: [
        {
          id: 'system-overview',
          title: 'System Overview',
          description: 'Platform health and user activity metrics',
          priority: 'high' as const,
          status: 'active' as const,
          icon: TrendingUp,
          href: '/admin-portal'
        }
      ] as DashboardSection[]
    };

    return sections[role as keyof typeof sections] || sections.client;
  };

  const getNextSteps = (): string[] => {
    const nextSteps = {
      client: [
        'Complete your risk assessment',
        'Set up your financial goals',
        'Schedule a portfolio review'
      ],
      advisor: [
        'Import your client database',
        'Set up automated reporting',
        'Configure your referral program'
      ],
      accountant: [
        'Set up tax calendar reminders',
        'Configure client communication preferences',
        'Review upcoming filing deadlines'
      ],
      consultant: [
        'Create your first project template',
        'Set up client assessment tools',
        'Configure project tracking'
      ],
      attorney: [
        'Review estate planning templates',
        'Set up document management workflow',
        'Configure client intake process'
      ],
      admin: [
        'Review user permissions',
        'Configure platform settings',
        'Set up monitoring alerts'
      ]
    };

    return nextSteps[role as keyof typeof nextSteps] || nextSteps.client;
  };

  const handleNextStepClick = (step: string) => {
    // Map next steps to appropriate routes
    const routeMap: Record<string, string> = {
      // Client routes
      'Complete your risk assessment': '/investment-risk',
      'Set up your financial goals': '/goals/create',
      'Schedule a portfolio review': '/portfolio',
      
      // Advisor routes
      'Import your client database': '/advisor/clients',
      'Set up automated reporting': '/advisor/performance',
      'Configure your referral program': '/advisor/resource-center',
      
      // Accountant routes
      'Set up tax calendar reminders': '/accountant/tax-planning',
      'Configure client communication preferences': '/accountant/statements',
      'Review upcoming filing deadlines': '/accountant/tax-planning',
      
      // Consultant routes
      'Create your first project template': '/consultant/projects',
      'Set up client assessment tools': '/longevity-scorecard',
      'Configure project tracking': '/consultant/projects',
      
      // Attorney routes
      'Review estate planning templates': '/attorney/estate-planning',
      'Set up document management workflow': '/attorney/contracts',
      'Configure client intake process': '/attorney/estate-planning',
      
      // Admin routes
      'Review user permissions': '/admin/roles',
      'Configure platform settings': '/admin/settings',
      'Set up monitoring alerts': '/admin/monitoring'
    };

    const route = routeMap[step];
    if (route) {
      navigate(route);
    } else {
      console.warn(`No route mapped for step: ${step}`);
    }
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const sections = getDashboardSections();
  const nextSteps = getNextSteps();
  const highPrioritySections = sections.filter(s => s.priority === 'high');
  const mediumPrioritySections = sections.filter(s => s.priority === 'medium');

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                Welcome back
              </h1>
              {isVIP && (
                <VIPBadge 
                  type={vipStatus?.tier === 'founding_member' ? 'founding_member' : 'early_adopter'} 
                  size="md" 
                  animated={true}
                />
              )}
            </div>
            <p className="text-muted-foreground">
              Here's what's happening with your {role === 'client' ? 'financial portfolio' : 'practice'} today.
              {isVIP && " • VIP Member"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowInviteModal(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Colleagues
            </Button>
            {tier === 'premium' && (
              <Badge variant="outline" className="gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/education')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Getting Started
            </Button>
          </div>
        </div>

        {/* High Priority Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highPrioritySections.map((section) => (
            <Card key={section.id} className="relative overflow-hidden">
              {section.status === 'premium' && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
              
              {section.metrics && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {section.metrics.value}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{section.metrics.label}</span>
                      {section.metrics.trend === 'up' && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
              
              <CardContent className={section.metrics ? "pt-0" : ""}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between"
                  disabled={section.status === 'coming-soon'}
                >
                  <span>
                    {section.status === 'coming-soon' ? 'Coming Soon' : 'View Details'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Next Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Next Steps
              </CardTitle>
              <CardDescription>
                Actions to help you get the most out of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextSteps.map((step, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="flex items-center gap-3 p-3 h-auto w-full justify-start hover:bg-muted/50 transition-colors"
                    onClick={() => handleNextStepClick(step)}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm">{step}</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Explore More Features
              </CardTitle>
              <CardDescription>
                Additional tools and resources available to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mediumPrioritySections.map((section) => (
                  <div key={section.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <section.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{section.title}</div>
                      <div className="text-xs text-muted-foreground">{section.description}</div>
                    </div>
                    {section.status === 'premium' && (
                      <Badge variant="outline" className="text-xs">Premium</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Content */}
        {children}
      </div>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <PersonaOnboardingFlow 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)} 
        />
      )}

      {/* Invite Flow Modal */}
      <InviteFlowModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        persona={role as PersonaType}
      />
    </MainLayout>
  );
};

export default PersonaDashboardLayout;