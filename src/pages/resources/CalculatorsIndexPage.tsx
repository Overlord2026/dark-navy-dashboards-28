import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, PiggyBank, Home } from 'lucide-react';

const CalculatorsIndexPage: React.FC = () => {
  const calculators = [
    {
      title: 'Retirement Calculator',
      description: 'Plan for your retirement with our comprehensive calculator',
      icon: PiggyBank,
      status: 'Available'
    },
    {
      title: 'Investment Growth',
      description: 'Calculate potential investment returns over time',
      icon: TrendingUp,
      status: 'Available'
    },
    {
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payments and total interest',
      icon: Home,
      status: 'Coming Soon'
    },
    {
      title: 'Tax Planning',
      description: 'Estimate tax implications of financial decisions',
      icon: Calculator,
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Financial Calculators
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Use our suite of financial calculators to plan and analyze your wealth management strategies.
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calculators.map((calc) => {
                const Icon = calc.icon;
                return (
                  <Card key={calc.title} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{calc.title}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            calc.status === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {calc.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {calc.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalculatorsIndexPage;