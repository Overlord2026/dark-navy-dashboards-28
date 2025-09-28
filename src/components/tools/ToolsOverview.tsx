import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, TrendingUp, Shield, DollarSign, FileText, PieChart, CreditCard, Building, Users, Briefcase, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEGACY_TIERS } from '@/config/tiers';
import PricingBadge from '@/components/pricing/PricingBadge';
import type { FamilyPlanKey } from '@/config/tiers';

const toolCategories = [
  {
    category: 'Tax Planning',
    description: 'Optimize your tax strategies with advanced planning tools',
    tools: [
      {
        id: 'roth-conversion',
        name: 'Roth IRA Conversion',
        description: 'Calculate optimal conversion timing and amounts',
        icon: Calculator,
        planKey: 'free' as FamilyPlanKey,
        route: '/tools/tax/roth-conversion'
      },
      {
        id: 'tax-bracket-manager',
        name: 'Tax Bracket Manager',
        description: 'Manage income across tax brackets efficiently',
        icon: PieChart,
        planKey: 'premium' as FamilyPlanKey,
        route: '/tools/tax/bracket-manager'
      },
      {
        id: 'charitable-giving',
        name: 'Charitable Giving Optimizer',
        description: 'Maximize charitable deductions and impact',
        icon: FileText,
        planKey: 'pro' as FamilyPlanKey,
        route: '/tools/tax/charitable-giving'
      }
    ]
  },
  {
    category: 'Investment Analysis',
    description: 'Make informed investment decisions with professional-grade tools',
    tools: [
      {
        id: 'portfolio-analyzer',
        name: 'Portfolio Risk Analyzer',
        description: 'Comprehensive portfolio risk assessment',
        icon: TrendingUp,
        planKey: 'free' as FamilyPlanKey,
        route: '/tools/investment/portfolio-analyzer'
      },
      {
        id: 'asset-allocation',
        name: 'Asset Allocation Optimizer',
        description: 'Optimize your asset allocation strategy',
        icon: PieChart,
        planKey: 'premium' as FamilyPlanKey,
        route: '/tools/investment/asset-allocation'
      },
      {
        id: 'due-diligence',
        name: 'Investment Due Diligence',
        description: 'Professional investment research tools',
        icon: Shield,
        planKey: 'pro' as FamilyPlanKey,
        route: '/tools/investment/due-diligence'
      }
    ]
  },
  {
    category: 'Estate Planning',
    description: 'Secure your family\'s future with comprehensive estate tools',
    tools: [
      {
        id: 'estate-calculator',
        name: 'Estate Tax Calculator',
        description: 'Calculate potential estate tax liabilities',
        icon: Calculator,
        planKey: 'free' as FamilyPlanKey,
        route: '/tools/estate/tax-calculator'
      },
      {
        id: 'trust-analyzer',
        name: 'Trust Structure Analyzer',
        description: 'Analyze optimal trust structures',
        icon: Building,
        planKey: 'premium' as FamilyPlanKey,
        route: '/tools/estate/trust-analyzer'
      },
      {
        id: 'succession-planner',
        name: 'Business Succession Planner',
        description: 'Plan your business succession strategy',
        icon: Briefcase,
        planKey: 'pro' as FamilyPlanKey,
        route: '/tools/estate/succession-planner'
      }
    ]
  },
  {
    category: 'Retirement Planning',
    description: 'Plan and track your path to financial independence',
    tools: [
      {
        id: 'retirement-calculator',
        name: 'Retirement Calculator',
        description: 'Calculate retirement savings needs',
        icon: Calculator,
        planKey: 'free' as FamilyPlanKey,
        route: '/tools/retirement/calculator'
      },
      {
        id: 'social-security',
        name: 'Social Security Optimizer',
        description: 'Optimize your Social Security benefits',
        icon: Users,
        planKey: 'premium' as FamilyPlanKey,
        route: '/tools/retirement/social-security'
      },
      {
        id: 'withdrawal-strategy',
        name: 'Withdrawal Strategy Planner',
        description: 'Plan optimal retirement withdrawals',
        icon: DollarSign,
        planKey: 'pro' as FamilyPlanKey,
        route: '/tools/retirement/withdrawal-strategy'
      }
    ]
  }
];

const getToolFootnotes = (planKey: string) => {
  switch (planKey) {
    case 'premium':
      return `Account aggregation limit: ${LEGACY_TIERS.PREMIUM.aggLimit} accounts`;
    case 'pro':
      return `Account aggregation limit: ${LEGACY_TIERS.PRO.aggLimit} accounts`;
    default:
      return null;
  }
};

export function ToolsOverview() {
  const navigate = useNavigate();

  const handleToolClick = (route: string) => {
    navigate(route);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Professional <span className="text-brand-gold">Financial Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access sophisticated financial planning tools designed for family offices and high-net-worth individuals.
          </p>
        </div>

        <div className="space-y-12">
          {toolCategories.map((category, categoryIndex) => (
            <div key={category.category} className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{category.category}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {category.tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card 
                      key={tool.id} 
                      className="border-border hover:border-brand-gold/50 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                      onClick={() => handleToolClick(tool.route)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <IconComponent className="h-8 w-8 text-brand-gold" />
                          <PricingBadge planKey={tool.planKey} />
                        </div>
                        <CardTitle className="text-lg group-hover:text-brand-gold transition-colors">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {tool.description}
                        </CardDescription>
                        {getToolFootnotes(tool.planKey) && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {getToolFootnotes(tool.planKey)}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button 
                          variant="outline" 
                          className="w-full border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-black group-hover:scale-105 transition-all"
                          size="sm"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
            onClick={() => navigate('/tools')}
          >
            View All Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}