// Task 5: Family Dashboard Hero Component
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calculator, 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  PiggyBank,
  Upload,
  UserPlus,
  LinkIcon
} from 'lucide-react';
import { track } from '@/lib/bfoAnalytics';
import { useAuth } from '@/context/AuthContext';

interface Guide {
  id: string;
  title: string;
  description: string;
  estimatedReadTime: string;
  category: 'retirement' | 'investment' | 'tax' | 'estate';
  icon: React.ReactNode;
}

interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'retirement' | 'investment' | 'tax';
}

const recommendedGuides: Guide[] = [
  {
    id: 'retirement-income-strategies',
    title: 'Retirement Income Strategies',
    description: 'Learn how to create sustainable income streams in retirement',
    estimatedReadTime: '8 min read',
    category: 'retirement',
    icon: <PiggyBank className="h-5 w-5 text-blue-600" />
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting Guide',
    description: 'Optimize your portfolio\'s tax efficiency with strategic harvesting',
    estimatedReadTime: '6 min read',
    category: 'tax',
    icon: <Shield className="h-5 w-5 text-green-600" />
  },
  {
    id: 'estate-planning-basics',
    title: 'Estate Planning Essentials',
    description: 'Protect your legacy with proper estate planning strategies',
    estimatedReadTime: '10 min read',
    category: 'estate',
    icon: <FileText className="h-5 w-5 text-purple-600" />
  }
];

const featuredCalculators: Calculator[] = [
  {
    id: 'monte-carlo',
    name: 'Monte Carlo Analyzer',
    description: 'Stress-test your retirement plan with market simulations',
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
    category: 'retirement'
  },
  {
    id: 'rmd-calculator',
    name: 'RMD Calculator',
    description: 'Calculate your required minimum distributions',
    icon: <Calculator className="h-5 w-5 text-green-600" />,
    category: 'retirement'
  },
  {
    id: 'social-security',
    name: 'Social Security Optimizer',
    description: 'Maximize your Social Security benefits',
    icon: <PiggyBank className="h-5 w-5 text-purple-600" />,
    category: 'retirement'
  }
];

interface FamilyDashboardHeroProps {
  personaSlug?: string;
}

export function FamilyDashboardHero({ personaSlug }: FamilyDashboardHeroProps) {
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track hero view
    track({ name: 'dashboard.hero_viewed', personaSlug });
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [personaSlug]);

  const handleGuideClick = (guideId: string) => {
    track({ name: 'guide.opened', guideId, personaSlug });
  };

  const handleCalculatorClick = (calcId: string) => {
    const startTime = Date.now();
    track({ 
      name: 'calculator.run', 
      calcId, 
      personaSlug, 
      durationMs: Date.now() - startTime 
    });
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Analytics would be handled in the specific action handlers
  };

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return <HeroError error={error} onRetry={() => setError(null)} />;
  }

  const firstName = userProfile?.displayName?.split(' ')[0] || 'Welcome';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hello, {firstName}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ready to optimize your family's financial future?
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with the most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction('link-accounts')}
            >
              <LinkIcon className="h-6 w-6" />
              <span>Link Accounts</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction('upload-document')}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Document</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickAction('invite-professional')}
            >
              <UserPlus className="h-6 w-6" />
              <span>Invite Professional</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Guides</CardTitle>
          <CardDescription>
            Educational content tailored to your situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedGuides.map((guide) => (
              <Link 
                key={guide.id}
                to={`/guides/${guide.id}`}
                onClick={() => handleGuideClick(guide.id)}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {guide.icon}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{guide.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {guide.description}
                        </p>
                        <span className="text-xs text-primary">{guide.estimatedReadTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Calculators */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Calculators</CardTitle>
          <CardDescription>
            Run scenarios and analyze your financial strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCalculators.map((calc) => (
              <Link 
                key={calc.id}
                to={`/calculators/${calc.id}`}
                onClick={() => handleCalculatorClick(calc.id)}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {calc.icon}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{calc.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {calc.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </CardContent>
    </Card>
  );
}