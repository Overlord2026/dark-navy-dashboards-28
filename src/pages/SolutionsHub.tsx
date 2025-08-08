import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  CreditCard, 
  Shield, 
  FileText, 
  Calculator, 
  Heart, 
  Building, 
  Banknote, 
  Home,
  Lock
} from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';

interface Solution {
  id: string;
  title: string;
  description: string;
  features: string[];
  isPremium: boolean;
  demoRoute: string;
  startRoute: string;
  icon: any;
  gradient: string;
}

const solutions: Solution[] = [
  {
    id: 'investments',
    title: 'Investments',
    description: 'Portfolio management, alternative investments, and optimization tools.',
    features: [
      'Portfolio analysis & rebalancing',
      'Alternative investment access',
      'Risk assessment tools',
      'Performance tracking'
    ],
    isPremium: false,
    demoRoute: '/demo/investments',
    startRoute: '/app/investments',
    icon: TrendingUp,
    gradient: 'from-primary to-primary-foreground'
  },
  {
    id: 'lending',
    title: 'Lending',
    description: 'Securities-based lending and credit optimization strategies.',
    features: [
      'Securities-based lending',
      'Credit line optimization',
      'Interest rate monitoring',
      'Collateral management'
    ],
    isPremium: true,
    demoRoute: '/demo/lending',
    startRoute: '/app/lending',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    description: 'Life, disability, and long-term care insurance optimization.',
    features: [
      'Coverage analysis',
      'Premium optimization',
      'Claims management',
      'Policy comparison tools'
    ],
    isPremium: false,
    demoRoute: '/demo/insurance',
    startRoute: '/app/insurance',
    icon: Shield,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'estate',
    title: 'Estate Planning',
    description: 'Comprehensive estate planning and wealth transfer strategies.',
    features: [
      'Estate tax planning',
      'Trust structures',
      'Succession planning',
      'Document management'
    ],
    isPremium: true,
    demoRoute: '/demo/estate',
    startRoute: '/app/estate',
    icon: FileText,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'tax',
    title: 'Tax Planning',
    description: 'Advanced tax optimization and multi-year planning strategies.',
    features: [
      'Multi-year projections',
      'Roth conversion analysis',
      'State residency planning',
      'Tax-loss harvesting'
    ],
    isPremium: true,
    demoRoute: '/demo/tax',
    startRoute: '/app/tax',
    icon: Calculator,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Longevity',
    description: 'Healthcare cost planning and longevity optimization tools.',
    features: [
      'Healthcare cost modeling',
      'HSA optimization',
      'Longevity planning',
      'Provider networks'
    ],
    isPremium: true,
    demoRoute: '/demo/healthcare',
    startRoute: '/app/health',
    icon: Heart,
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    id: 'business',
    title: 'Business & Entity Mgmt',
    description: 'Business entity management and optimization tools.',
    features: [
      'Entity selection guidance',
      'Tax optimization',
      'Compliance tracking',
      'Asset protection strategies'
    ],
    isPremium: true,
    demoRoute: '/demo/business',
    startRoute: '/app/entities',
    icon: Building,
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'billpay',
    title: 'Bill Pay',
    description: 'Automated bill payment and cash flow management.',
    features: [
      'Automated payments',
      'Cash flow optimization',
      'Vendor management',
      'Expense tracking'
    ],
    isPremium: false,
    demoRoute: '/demo/billpay',
    startRoute: '/app/billpay',
    icon: Banknote,
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'properties',
    title: 'Properties',
    description: 'Real estate portfolio management and optimization tools.',
    features: [
      'Property tracking',
      'Performance analysis',
      'Tax optimization',
      'Market insights'
    ],
    isPremium: false,
    demoRoute: '/demo/properties',
    startRoute: '/app/properties',
    icon: Home,
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'vault',
    title: 'Secure Vault',
    description: 'Secure document storage with smart categorization.',
    features: [
      'Encrypted storage',
      'Smart categorization',
      'Document sharing',
      'Version control'
    ],
    isPremium: false,
    demoRoute: '/demo/vault',
    startRoute: '/app/vault',
    icon: Lock,
    gradient: 'from-gray-500 to-gray-600'
  }
];

export default function SolutionsHub() {
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();

  const handleDemo = (solution: Solution) => {
    trackEvent('solution_demo_clicked', solution.id);
    navigate(solution.demoRoute);
  };

  const handleGetStarted = (solution: Solution) => {
    trackEvent('solution_started', solution.id);
    if (solution.isPremium) {
      navigate('/onboarding/client?upgrade=true');
    } else {
      navigate(solution.startRoute);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Building className="h-10 w-10 text-primary" />
            Solutions Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive wealth management tools and services designed for modern families and their advisors.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution) => {
            const IconComponent = solution.icon;
            return (
              <Card
                key={solution.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${solution.gradient}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{solution.title}</CardTitle>
                        {solution.isPremium && (
                          <Badge variant="default" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {solution.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemo(solution)}
                        className="flex-1"
                      >
                        Try Demo
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGetStarted(solution)}
                        className="flex-1"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center p-8 bg-primary/5 rounded-lg border-2 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team can work with you to develop specialized tools and workflows for your unique situation.
          </p>
          <Button 
            size="lg"
            onClick={() => {
              trackEvent('custom_solution_clicked', 'contact');
              navigate('/contact');
            }}
          >
            Contact Our Team
          </Button>
        </div>
      </div>
    </div>
  );
}