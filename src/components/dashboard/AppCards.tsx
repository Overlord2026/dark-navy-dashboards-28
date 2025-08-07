import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  TrendingUp, 
  Shield, 
  Home, 
  Heart, 
  DollarSign, 
  Shield as Insurance, 
  FileText, 
  Users, 
  GraduationCap,
  Building,
  Lock,
  ChevronDown,
  ChevronUp,
  Calculator,
  PiggyBank,
  CreditCard,
  BarChart3,
  Briefcase,
  UserCheck,
  MessageSquare,
  Crown,
  Star,
  Target,
  Archive,
  Receipt,
  Stethoscope,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface FeatureItem {
  name: string;
  status: 'free' | 'premium' | 'elite';
  description?: string;
}

interface AppCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  status: 'free' | 'premium' | 'elite';
  route?: string;
  preview: string;
  features: FeatureItem[];
  category: 'wealth' | 'planning' | 'collaboration' | 'profile';
}

const appCards: AppCard[] = [
  {
    id: 'education',
    title: 'Education & Solutions Center',
    description: 'Master your finances with world-class learning resources',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    status: 'free',
    route: '/education',
    preview: 'Access comprehensive financial education - always free',
    category: 'wealth',
    features: [
      { name: 'Education Hub', status: 'free', description: 'Financial literacy courses and guides' },
      { name: 'Learning Center', status: 'free', description: 'Video tutorials and webinars' },
      { name: 'Tax Planning Education', status: 'free', description: 'Tax optimization strategies' },
      { name: 'Retirement Planning Guides', status: 'free', description: 'Step-by-step retirement planning' },
      { name: 'Estate Planning Basics', status: 'free', description: 'Understand wills, trusts, and legacy' }
    ]
  },
  {
    id: 'investments',
    title: 'Investment Strategies',
    description: 'Build and optimize your investment portfolio',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    status: 'premium',
    route: '/investments',
    preview: 'Advanced portfolio management and exclusive opportunities',
    category: 'wealth',
    features: [
      { name: 'Investment Strategies', status: 'free', description: 'Basic portfolio guidance' },
      { name: 'Private Market Alpha', status: 'premium', description: 'Exclusive private investments' },
      { name: 'Portfolio Builder', status: 'premium', description: 'AI-powered portfolio optimization' },
      { name: 'Investment Performance Analytics', status: 'premium', description: 'Advanced performance tracking' },
      { name: 'Alternative Investments', status: 'elite', description: 'Hedge funds, private equity access' }
    ]
  },
  {
    id: 'lending',
    title: 'Smart Lending Solutions',
    description: 'Access premium credit and lending opportunities',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    status: 'premium',
    route: '/lending',
    preview: 'Exclusive lending rates and securities-based credit',
    category: 'wealth',
    features: [
      { name: 'Smart Lending Portal', status: 'premium', description: 'Securities-based lines of credit' },
      { name: 'Credit Facilities', status: 'premium', description: 'Specialized lending products' },
      { name: 'Lending Dashboard', status: 'premium', description: 'Track all credit facilities' },
      { name: 'Portfolio Financing', status: 'elite', description: 'Institutional-grade financing' }
    ]
  },
  {
    id: 'insurance',
    title: 'Insurance & Annuities',
    description: 'Comprehensive protection and income solutions',
    icon: Shield,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    status: 'premium',
    route: '/insurance',
    preview: 'Life insurance, annuities, and advanced protection strategies',
    category: 'planning',
    features: [
      { name: 'Insurance Hub', status: 'free', description: 'Basic insurance guidance' },
      { name: 'Annuities Marketplace', status: 'premium', description: 'Curated annuity products' },
      { name: 'Personal Insurance Review', status: 'premium', description: 'Professional insurance analysis' },
      { name: 'Advanced Protection Strategies', status: 'elite', description: 'Sophisticated insurance planning' }
    ]
  },
  {
    id: 'estate',
    title: 'Estate & Legacy Planning',
    description: 'Preserve and transfer wealth across generations',
    icon: Crown,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    status: 'premium',
    route: '/estate',
    preview: 'Wills, trusts, and sophisticated legacy strategies',
    category: 'planning',
    features: [
      { name: 'Estate Planning Basics', status: 'free', description: 'Will and trust fundamentals' },
      { name: 'Family Legacy Box™', status: 'premium', description: 'Digital legacy preservation' },
      { name: 'Advanced Estate Calculators', status: 'premium', description: 'Tax and planning calculators' },
      { name: 'Dynasty Trust Planning', status: 'elite', description: 'Multi-generational wealth transfer' }
    ]
  },
  {
    id: 'tax',
    title: 'Advanced Tax Planning',
    description: 'Optimize your tax strategy year-round',
    icon: Calculator,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    status: 'premium',
    route: '/tax',
    preview: 'Tax optimization, Roth conversions, and state residency',
    category: 'planning',
    features: [
      { name: 'Tax Planning Basics', status: 'free', description: 'Basic tax optimization tips' },
      { name: 'High Net Worth Tax Strategies', status: 'premium', description: 'Advanced tax planning' },
      { name: 'Roth Conversion Analyzer', status: 'premium', description: 'Optimize Roth conversions' },
      { name: 'State Residency Optimization', status: 'elite', description: 'Multi-state tax planning' }
    ]
  },
  {
    id: 'wealth-tools',
    title: 'Wealth Management Tools',
    description: 'Organize and track all aspects of your financial life',
    icon: Briefcase,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    status: 'free',
    route: '/wealth-tools',
    preview: 'Net worth tracking, digital vault, and goal management',
    category: 'wealth',
    features: [
      { name: 'Net Worth Dashboard', status: 'free', description: 'Track all accounts and assets' },
      { name: 'Secure Digital Vault', status: 'free', description: 'Store important documents' },
      { name: 'Bill Pay & Banking', status: 'premium', description: 'Consolidated bill management' },
      { name: 'Property Management', status: 'premium', description: 'Real estate portfolio tracking' },
      { name: 'Goals & Budget Planning', status: 'free', description: 'Set and track financial goals' }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    description: 'Comprehensive health and wellness optimization',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    status: 'premium',
    route: '/healthcare',
    preview: 'Proactive health management and wellness optimization',
    category: 'planning',
    features: [
      { name: 'Proactive Health Dashboard', status: 'premium', description: 'Health records and tracking' },
      { name: 'Healthcare Optimization', status: 'premium', description: 'Personalized health strategies' },
      { name: 'Concierge Medicine Access', status: 'elite', description: 'Executive health programs' },
      { name: 'Wellness Coordinator', status: 'elite', description: 'Personal wellness management' }
    ]
  },
  {
    id: 'collaboration',
    title: 'Family Collaboration',
    description: 'Connect and coordinate with family and advisors',
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    status: 'free',
    route: '/collaboration',
    preview: 'Secure family communication and document sharing',
    category: 'collaboration',
    features: [
      { name: 'Document Sharing', status: 'free', description: 'Share files with family members' },
      { name: 'Family Collaboration Hub', status: 'premium', description: 'Family communication center' },
      { name: 'Secure Messaging', status: 'premium', description: 'Encrypted family communications' },
      { name: 'Advisor Coordination', status: 'premium', description: 'Coordinate with your advisory team' }
    ]
  },
  {
    id: 'profile',
    title: 'Profile & Preferences',
    description: 'Manage your account and customize your experience',
    icon: UserCheck,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    status: 'free',
    route: '/profile',
    preview: 'Personal info, preferences, and account settings',
    category: 'profile',
    features: [
      { name: 'Basic Profile', status: 'free', description: 'Name, email, and preferences' },
      { name: 'Family Setup', status: 'free', description: 'Add family members and roles' },
      { name: 'KYC Verification', status: 'premium', description: 'Complete client verification' },
      { name: 'Advisor Matching', status: 'premium', description: 'Get matched with advisors' }
    ]
  }
];

export const AppCards: React.FC = () => {
  const navigate = useNavigate();
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const handleCardAction = (app: AppCard, action: 'explore' | 'start' | 'upgrade') => {
    if (action === 'upgrade') {
      // Navigate to upgrade page or show upgrade modal
      navigate('/upgrade');
      return;
    }
    
    if (app.route) {
      navigate(app.route);
    }
  };

  const getStatusBadge = (status: AppCard['status']) => {
    switch (status) {
      case 'free':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">Free</Badge>;
      case 'premium':
        return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">Premium</Badge>;
      case 'elite':
        return <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">Elite</Badge>;
    }
  };

  const getFeatureBadge = (status: FeatureItem['status']) => {
    switch (status) {
      case 'free':
        return <Badge variant="outline" className="text-xs text-green-600 border-green-300">Free</Badge>;
      case 'premium':
        return <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Premium</Badge>;
      case 'elite':
        return <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">Elite</Badge>;
    }
  };

  const getActionButton = (app: AppCard) => {
    const hasAccess = checkFeatureAccess(app.status);
    
    if (hasAccess || app.status === 'free') {
      return (
        <Button
          variant="default"
          size="sm"
          className="w-full btn-primary-gold"
          onClick={(e) => {
            e.stopPropagation();
            handleCardAction(app, app.status === 'free' ? 'explore' : 'start');
          }}
        >
          {app.status === 'free' ? 'Explore' : 'Start'}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          handleCardAction(app, 'upgrade');
        }}
      >
        Upgrade to Access
      </Button>
    );
  };

  const groupedCards = appCards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, AppCard[]>);

  const categoryTitles = {
    wealth: 'Wealth Management',
    planning: 'Planning & Protection',
    collaboration: 'Family & Collaboration',
    profile: 'Account Setup'
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Your Boutique Family Office™ Portal</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive solutions at your own pace. Free features are always available, premium tools unlock with membership.
        </p>
      </div>

      {Object.entries(groupedCards).map(([category, cards], categoryIndex) => (
        <div key={category} className="space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (categoryIndex * 0.2) + (index * 0.1) }}
              >
                <Collapsible
                  open={expandedCards.has(app.id)}
                  onOpenChange={() => toggleCardExpansion(app.id)}
                >
                  <Card className={`${app.borderColor} hover:shadow-lg transition-all duration-200`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 ${app.bgColor} rounded-lg flex items-center justify-center`}>
                          <app.icon className={`w-6 h-6 ${app.color}`} />
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">{app.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                      
                      <div className={`text-xs ${app.color} bg-gray-50 dark:bg-gray-800 p-3 rounded-md`}>
                        <span className="font-medium">What's inside: </span>
                        {app.preview}
                      </div>

                      {/* Expandable Features */}
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full flex items-center justify-between p-2 h-auto text-xs"
                        >
                          <span>View Features ({app.features.length})</span>
                          {expandedCards.has(app.id) ? 
                            <ChevronUp className="h-3 w-3" /> : 
                            <ChevronDown className="h-3 w-3" />
                          }
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="space-y-2">
                        {app.features.map((feature, featureIndex) => (
                          <div 
                            key={featureIndex}
                            className="flex items-start justify-between p-2 rounded-md bg-muted/30 text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground">{feature.name}</div>
                              {feature.description && (
                                <div className="text-muted-foreground mt-1">{feature.description}</div>
                              )}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              {getFeatureBadge(feature.status)}
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>

                      {/* Action Button */}
                      <div className="pt-2">
                        {getActionButton(app)}
                      </div>
                    </CardContent>
                  </Card>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Progress & Navigation Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center pt-4"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Archive className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Progress Auto-Saved</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Your progress is automatically saved. Feel free to explore at your own pace and return anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Complete Profile Later
              </Button>
              <Button className="btn-primary-gold" onClick={() => navigate('/upgrade')}>
                <Star className="h-4 w-4 mr-2" />
                Become a Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};