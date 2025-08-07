import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { 
  TrendingUp, 
  Shield, 
  Home, 
  Crown, 
  Calculator, 
  Heart,
  Briefcase,
  Users,
  Lock,
  Star,
  Zap,
  FileText,
  CreditCard,
  Target,
  ChevronRight,
  Video,
  Bell,
  Archive,
  PiggyBank,
  BarChart3,
  Building2,
  Receipt,
  Brain,
  MessagesSquare
} from 'lucide-react';

interface PremiumModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  features: string[];
  basicFeatures?: string[];
  route?: string;
  status: 'basic' | 'premium';
}

const premiumModules: PremiumModule[] = [
  {
    id: 'retirement-roadmap',
    title: 'Retirement Roadmap™',
    description: 'Interactive scenario builder with Monte Carlo simulations',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'premium',
    route: '/retirement-roadmap',
    basicFeatures: [
      'Basic retirement calculators',
      'Simple goal tracking'
    ],
    features: [
      'Interactive scenario builder',
      'Goal tracking with milestones',
      'Monte Carlo simulations',
      'Downloadable retirement income reports',
      'Risk assessment tools',
      'Withdrawal strategy optimization'
    ]
  },
  {
    id: 'advanced-properties',
    title: 'Advanced Properties Management',
    description: 'Unlimited real estate tracking with analytics',
    icon: Building2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    status: 'premium',
    route: '/properties',
    basicFeatures: [
      'Basic property tracking (up to 3 properties)',
      'Simple value estimates'
    ],
    features: [
      'Unlimited asset tracking for real estate',
      'Document uploads and management',
      'Automated reminders and alerts',
      'Property analytics and reporting',
      'Secure sharing with family/advisors',
      'Market value tracking and trends',
      'Rental income optimization'
    ]
  },
  {
    id: 'bill-pay-premium',
    title: 'Bill Pay (Premium)',
    description: 'Automated payment scheduling with banking integration',
    icon: Receipt,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    status: 'premium',
    route: '/bill-pay',
    basicFeatures: [
      'Manual bill tracking',
      'Basic payment reminders'
    ],
    features: [
      'Automated payment scheduling',
      'Recurring payment management',
      'Unlimited payees',
      'Banking integration',
      'Smart reminders and alerts',
      'Payment analytics and insights',
      'Cashflow forecasting'
    ]
  },
  {
    id: 'family-vault-estate',
    title: 'Secure Family Vault™ & Estate Planning',
    description: 'Central hub for all estate and legacy planning documents',
    icon: Archive,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    status: 'premium',
    route: '/family-vault',
    basicFeatures: [
      'Basic document storage (100MB)',
      'Simple folder organization'
    ],
    features: [
      'Unlimited encrypted storage for all documents',
      'Wills, trusts, POA, medical directives storage',
      'Insurance policies and deeds management',
      '"Legacy Avatar" - video/audio messages for heirs',
      'Event-based triggers for document release',
      'Estate planning checklists and reminders',
      'Smart vault search and organization',
      'Secure family member access controls'
    ]
  },
  {
    id: 'advanced-tax-planning',
    title: 'Advanced Tax Planning',
    description: 'Multi-year tax optimization and planning suite',
    icon: Calculator,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    status: 'premium',
    route: '/tax-planning',
    basicFeatures: [
      'Basic tax tips and guides',
      'Simple deduction tracker'
    ],
    features: [
      'Multi-Year Roth Conversion Analyzer',
      'Withdrawal Sequencing Simulator',
      'Lifetime Tax Projection Engine',
      'Federal and state tax optimization',
      'SECURE Act scenario modeling',
      'Advanced Charitable and Gifting Analyzer',
      'All premium tax calculators and guides'
    ]
  },
  {
    id: 'family-concierge-ai',
    title: 'Family Concierge & AI Copilot',
    description: 'Premium smart assistant for proactive financial management',
    icon: Brain,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    status: 'premium',
    route: '/ai-concierge',
    basicFeatures: [
      'Basic chatbot support',
      'Simple FAQ responses'
    ],
    features: [
      'Premium smart assistant for reminders',
      'Due date and deadline management',
      'Secure "Ask Anything" interface',
      'Proactive nudges for profile completion',
      'Document and bill completion reminders',
      'Personalized financial insights',
      'Advanced support and guidance'
    ]
  }
];

export const ClientPortalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const isPremium = checkFeatureAccess('premium');
  
  const handleModuleAction = (module: PremiumModule) => {
    if (module.status === 'premium' && !isPremium) {
      navigate('/subscription');
      return;
    }
    
    if (module.route) {
      navigate(module.route);
    }
  };

  const getActionButton = (module: PremiumModule) => {
    const hasAccess = module.status === 'basic' || checkFeatureAccess('premium');
    
    if (hasAccess) {
      return (
        <Button
          variant="default"
          className="w-full btn-primary-gold"
          onClick={() => handleModuleAction(module)}
        >
          Launch <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        onClick={() => handleModuleAction(module)}
      >
        <Crown className="h-4 w-4 mr-2" />
        Upgrade to Premium
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Your Family Office Portal
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Comprehensive wealth management tools designed for your family's unique needs
              </p>
              
              {/* Current Plan Badge */}
              <div className="flex justify-center mb-8">
                {isPremium ? (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Premium Client
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-4 py-2 text-sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Basic Plan
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* Tier Comparison */}
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="overview">Module Overview</TabsTrigger>
              <TabsTrigger value="comparison">Basic vs Premium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Premium Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumModules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`hover:shadow-lg transition-all duration-200 ${
                      module.status === 'premium' && !isPremium ? 'border-amber-200' : ''
                    }`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center`}>
                            <module.icon className={`w-6 h-6 ${module.color}`} />
                          </div>
                          {module.status === 'premium' && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {module.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Premium Features */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">Premium Features:</h4>
                          <div className="space-y-1">
                            {module.features.slice(0, 3).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 text-xs">
                                <Star className="h-3 w-3 text-amber-500" />
                                <span className="text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                            {module.features.length > 3 && (
                              <div className="text-xs text-muted-foreground pl-5">
                                +{module.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          {getActionButton(module)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              {/* Basic vs Premium Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Plan */}
                <Card className="border-2">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">Basic Plan</CardTitle>
                    <Badge variant="outline" className="w-fit mx-auto">
                      Current Plan
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Essential financial tools to get started
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {premiumModules.map((module) => (
                      <div key={`basic-${module.id}`} className="border rounded-lg p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <module.icon className={`w-5 h-5 ${module.color}`} />
                          <span className="font-medium text-sm">{module.title}</span>
                        </div>
                        <div className="space-y-1 pl-8">
                          {module.basicFeatures?.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                      <Crown className="h-5 w-5 text-amber-600" />
                      Premium Plan
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white w-fit mx-auto">
                      Upgrade Available
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Complete family office experience
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {premiumModules.map((module) => (
                      <div key={`premium-${module.id}`} className="border rounded-lg p-3 bg-white/50">
                        <div className="flex items-center gap-3 mb-2">
                          <module.icon className={`w-5 h-5 ${module.color}`} />
                          <span className="font-medium text-sm">{module.title}</span>
                        </div>
                        <div className="space-y-1 pl-8">
                          {module.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <Star className="w-3 h-3 text-amber-500" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                          {module.features.length > 4 && (
                            <div className="text-xs text-muted-foreground pl-5">
                              +{module.features.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upgrade CTA */}
              {!isPremium && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <Card className="max-w-md mx-auto border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardContent className="pt-6">
                      <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Ready to unlock Premium?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get full access to all premium modules and advanced features
                      </p>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        onClick={() => navigate('/subscription')}
                      >
                        Upgrade to Premium
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};