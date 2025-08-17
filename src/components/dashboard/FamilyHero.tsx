import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Users, 
  PiggyBank,
  GraduationCap,
  Heart,
  ArrowRight,
  Star,
  Target,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeatureFlag } from '@/lib/featureFlags';

interface FamilyHeroProps {
  userName?: string;
  familyName?: string;
  totalAssets?: number;
  recentActivity?: string;
}

const quickActions = [
  {
    title: 'Retirement Calculator',
    description: 'Plan your retirement with our Monte Carlo simulation',
    icon: Calculator,
    href: '/calculators/retirement',
    flagKey: 'calc.monte' as const,
    category: 'Planning'
  },
  {
    title: 'Education Planning',
    description: 'Save for your children\'s education',
    icon: GraduationCap,
    href: '/family/education-planning',
    flagKey: 'guides.retirement' as const,
    category: 'Planning'
  },
  {
    title: 'Estate Planning Guide',
    description: 'Protect your family\'s future',
    icon: Shield,
    href: '/guides/estate-planning',
    flagKey: 'guides.estatePlanning' as const,
    category: 'Guide'
  },
  {
    title: 'Tax Optimization',
    description: 'Minimize your tax burden',
    icon: DollarSign,
    href: '/guides/tax-planning',
    flagKey: 'guides.taxPlanning' as const,
    category: 'Guide'
  }
];

const familyStates = [
  {
    label: 'Net Worth',
    value: '$2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp
  },
  {
    label: 'Investment Growth',
    value: '+8.2%',
    change: 'YTD',
    trend: 'up',
    icon: PiggyBank
  },
  {
    label: 'Retirement Progress',
    value: '67%',
    change: 'On Track',
    trend: 'stable',
    icon: Target
  },
  {
    label: 'Risk Score',
    value: '6/10',
    change: 'Moderate',
    trend: 'stable',
    icon: Shield
  }
];

const personalizedGuides = [
  {
    title: 'First-Time Home Buyer Guide',
    description: 'Navigate the home buying process with confidence',
    progress: 30,
    estimatedTime: '15 min read',
    priority: 'high'
  },
  {
    title: 'Investment Diversification',
    description: 'Build a balanced portfolio for long-term growth',
    progress: 60,
    estimatedTime: '20 min read',
    priority: 'medium'
  },
  {
    title: 'Life Insurance Planning',
    description: 'Protect your family\'s financial security',
    progress: 0,
    estimatedTime: '12 min read',
    priority: 'high'
  }
];

export const FamilyHero: React.FC<FamilyHeroProps> = ({
  userName = 'John',
  familyName = 'The Johnson Family',
  totalAssets = 2400000,
  recentActivity = 'Last login: Today at 10:30 AM'
}) => {
  const navigate = useNavigate();
  const familyHeroEnabled = useFeatureFlag('dashboard.familyHero');

  if (!familyHeroEnabled) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/10 border-b">
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {getTimeOfDayGreeting()}, {userName}
              </h1>
              <p className="text-xl text-muted-foreground mb-1">{familyName}</p>
              <p className="text-sm text-muted-foreground">{recentActivity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalAssets)}</p>
            </div>
          </div>
        </div>

        {/* Family States */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {familyStates.map((state, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <state.icon className="h-5 w-5 text-primary" />
                  <Badge variant={state.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                    {state.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-1">{state.value}</p>
                <p className="text-sm text-muted-foreground">{state.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Star className="h-6 w-6 mr-2 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const flagEnabled = useFeatureFlag(action.flagKey);
                
                if (!flagEnabled) return null;

                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <action.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <Badge variant="outline" className="text-xs">
                          {action.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => navigate(action.href)}
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Personalized Guides */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Your Learning Path
            </h2>
            <div className="space-y-4">
              {personalizedGuides.map((guide, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm leading-tight">{guide.title}</h3>
                      <Badge 
                        variant={guide.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs ml-2"
                      >
                        {guide.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{guide.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{guide.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${guide.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{guide.estimatedTime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                <BookOpen className="h-4 w-4 mr-2" />
                View All Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};