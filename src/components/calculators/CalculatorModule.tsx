import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  Home, 
  FileText, 
  Heart, 
  DollarSign,
  Target,
  Clock,
  Trophy,
  Crown
} from 'lucide-react';
import { RetirementRoadmapModal } from './RetirementRoadmapModal';
import { TaxPlanningModal } from './TaxPlanningModal';
import { EstatePlanningModal } from './EstatePlanningModal';
import { LendingAffordabilityModal } from './LendingAffordabilityModal';

interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  premium: boolean;
  category: 'retirement' | 'tax' | 'estate' | 'lending' | 'general';
  comingSoon?: boolean;
}

const calculators: Calculator[] = [
  {
    id: 'retirement-roadmap',
    title: 'Retirement Roadmap Analyzer',
    description: 'Multi-year projection with income, expenses, and portfolio growth analysis',
    icon: TrendingUp,
    premium: true,
    category: 'retirement'
  },
  {
    id: 'roth-conversion',
    title: 'Roth Conversion Analyzer',
    description: 'Calculate optimal timing and amounts for Roth IRA conversions',
    icon: PiggyBank,
    premium: true,
    category: 'tax'
  },
  {
    id: 'tax-savings-estimator',
    title: 'Multi-year Tax Savings Estimator',
    description: 'Project tax savings across multiple years with various strategies',
    icon: Calculator,
    premium: true,
    category: 'tax'
  },
  {
    id: 'charitable-gifting',
    title: 'Charitable Gifting Impact Calculator',
    description: 'Analyze tax benefits and impact of charitable giving strategies',
    icon: Heart,
    premium: true,
    category: 'tax'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning Summary',
    description: 'Will/trust readiness checklist and beneficiary overview',
    icon: Shield,
    premium: false,
    category: 'estate'
  },
  {
    id: 'lending-affordability',
    title: 'Lending Affordability Estimator',
    description: 'Payment projections and cash flow impact analysis',
    icon: Home,
    premium: false,
    category: 'lending'
  },
  {
    id: 'fee-comparison',
    title: 'Fee Impact Calculator',
    description: 'Compare investment fees and long-term cost impact',
    icon: DollarSign,
    premium: false,
    category: 'general'
  },
  {
    id: 'social-security',
    title: 'Social Security Optimizer',
    description: 'Maximize your Social Security benefits with claiming strategies',
    icon: Clock,
    premium: true,
    category: 'retirement'
  }
];

export const CalculatorModule: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Calculators', icon: Calculator },
    { id: 'retirement', label: 'Retirement', icon: Trophy },
    { id: 'tax', label: 'Tax Planning', icon: FileText },
    { id: 'estate', label: 'Estate Planning', icon: Shield },
    { id: 'lending', label: 'Lending', icon: Home },
    { id: 'general', label: 'General', icon: Target }
  ];

  const filteredCalculators = selectedCategory === 'all' 
    ? calculators 
    : calculators.filter(calc => calc.category === selectedCategory);

  const closeModal = () => setActiveCalculator(null);

  const handleCalculatorClick = (calculatorId: string) => {
    setActiveCalculator(calculatorId);
  };

  const renderModal = () => {
    if (!activeCalculator) return null;

    switch (activeCalculator) {
      case 'retirement-roadmap':
        return <RetirementRoadmapModal open={true} onClose={closeModal} />;
      case 'roth-conversion':
      case 'tax-savings-estimator':
      case 'charitable-gifting':
        return <TaxPlanningModal open={true} onClose={closeModal} calculatorType={activeCalculator} />;
      case 'estate-planning':
        return <EstatePlanningModal open={true} onClose={closeModal} />;
      case 'lending-affordability':
        return <LendingAffordabilityModal open={true} onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Financial Calculators</h2>
            <p className="text-muted-foreground">
              Powerful tools to analyze your financial decisions and plan your future
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Premium Tools Available
          </Badge>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map((calculator) => {
          const IconComponent = calculator.icon;
          return (
            <Card 
              key={calculator.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                calculator.comingSoon ? 'opacity-50' : 'hover:border-primary/50'
              }`}
              onClick={() => !calculator.comingSoon && handleCalculatorClick(calculator.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      calculator.premium 
                        ? 'bg-gold/10 text-gold' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      {calculator.premium && (
                        <Badge variant="secondary" className="w-fit text-xs bg-gold/10 text-gold border-gold/20">
                          Premium
                        </Badge>
                      )}
                      {calculator.comingSoon && (
                        <Badge variant="outline" className="w-fit text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {calculator.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {calculator.description}
                </CardDescription>
                
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{calculator.category} Planning</span>
                    <span className={calculator.premium ? 'text-gold' : 'text-emerald'}>
                      {calculator.premium ? 'Premium Feature' : 'Free Tool'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Render Active Modal */}
      {renderModal()}
    </div>
  );
};