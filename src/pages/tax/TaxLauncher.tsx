import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Heart, Building2, FileText, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const taxCalculators = [
  { 
    id: 'roth-conversion', 
    title: 'Roth Conversion Analyzer', 
    route: '/tax/roth-conversion', 
    icon: TrendingUp,
    description: 'Optimize conversion timing and amounts for maximum tax efficiency',
    status: 'active',
    category: 'Retirement'
  },
  { 
    id: 'appreciated-stock', 
    title: 'Appreciated Stock Calculator', 
    route: '/tax/appreciated-stock', 
    icon: BarChart3,
    description: 'Plan stock option exercises and capital gains strategies',
    status: 'todo',
    category: 'Investments'
  },
  { 
    id: 'qsbs', 
    title: 'QSBS Planning Tool', 
    route: '/tax/qsbs', 
    icon: Building2,
    description: 'Maximize Qualified Small Business Stock tax benefits',
    status: 'todo',
    category: 'Business'
  },
  { 
    id: 'nua', 
    title: 'NUA Strategy Analyzer', 
    route: '/tax/nua', 
    icon: TrendingUp,
    description: 'Net Unrealized Appreciation optimization for employer stock',
    status: 'active',
    category: 'Retirement'
  },
  { 
    id: 'loss-harvest', 
    title: 'Tax Loss Harvesting', 
    route: '/tax/loss-harvest', 
    icon: DollarSign,
    description: 'Systematic loss harvesting and wash sale avoidance',
    status: 'todo',
    category: 'Investments'
  },
  { 
    id: 'basis-planning', 
    title: 'Basis Planning Calculator', 
    route: '/tax/basis-planning', 
    icon: Calculator,
    description: 'Cost basis tracking and step-up planning strategies',
    status: 'todo',
    category: 'Estate'
  },
  { 
    id: 'charitable-gift', 
    title: 'Charitable Gift Optimizer', 
    route: '/tax/charitable-gift', 
    icon: Heart,
    description: 'Tax-efficient charitable giving strategies and timing',
    status: 'partial',
    category: 'Charitable'
  },
  { 
    id: 'daf', 
    title: 'Donor Advised Fund Planner', 
    route: '/tax/daf', 
    icon: Heart,
    description: 'DAF contribution timing and distribution strategies',
    status: 'todo',
    category: 'Charitable'
  },
  { 
    id: 'tax-return-analyzer', 
    title: 'Tax Return Analyzer', 
    route: '/tax/tax-return-analyzer', 
    icon: FileText,
    description: 'Upload and analyze tax returns for optimization opportunities',
    status: 'todo',
    category: 'Analysis'
  },
  { 
    id: 'bracket-manager', 
    title: 'Tax Bracket Manager', 
    route: '/tax/bracket-manager', 
    icon: BarChart3,
    description: 'Multi-year tax bracket optimization and income timing',
    status: 'active',
    category: 'Planning'
  },
  { 
    id: 'social-security', 
    title: 'Social Security Tax Planner', 
    route: '/tax/social-security', 
    icon: Shield,
    description: 'Social Security taxation optimization and timing strategies',
    status: 'todo',
    category: 'Retirement'
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
    case 'partial':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Partial</Badge>;
    case 'todo':
      return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">Coming Soon</Badge>;
    default:
      return null;
  }
};

export function TaxLauncher() {
  const categories = [...new Set(taxCalculators.map(calc => calc.category))];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Tax Planning Suite</h1>
        <p className="text-muted-foreground text-lg">
          Professional-grade tax optimization tools for comprehensive financial planning
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary">{category} Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxCalculators
              .filter(calc => calc.category === category)
              .map((calc) => {
                const IconComponent = calc.icon;
                
                return (
                  <Link key={calc.id} to={calc.route} className="block group">
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20 group-hover:bg-muted/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight">{calc.title}</CardTitle>
                            </div>
                          </div>
                          {getStatusBadge(calc.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                          {calc.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}

      <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
        <h3 className="text-lg font-medium mb-2">Integration Status</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This tax planning module is ready for Neptune React Orbit component integration. 
          Active tools use existing implementations, while Coming Soon tools await source imports.
        </p>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 text-xs">Active</Badge>
            <span className="text-muted-foreground">Fully implemented</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">Partial</Badge>
            <span className="text-muted-foreground">Basic implementation</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs">Coming Soon</Badge>
            <span className="text-muted-foreground">Awaiting import</span>
          </div>
        </div>
      </div>
    </div>
  );
}