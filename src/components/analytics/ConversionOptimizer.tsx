import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Eye,
  MousePointer,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ConversionMetric {
  id: string;
  name: string;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused';
  variants: {
    name: string;
    traffic: number;
    conversion: number;
    confidence: number;
  }[];
  startDate: string;
  endDate?: string;
}

interface Funnel {
  step: string;
  visitors: number;
  conversions: number;
  rate: number;
  dropoff: number;
}

export const ConversionOptimizer: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeFunnel, setActiveFunnel] = useState('signup');

  const conversionMetrics: ConversionMetric[] = [
    {
      id: 'landing_conversion',
      name: 'Landing Page Conversion',
      current: 3.2,
      previous: 2.8,
      target: 4.0,
      trend: 'up',
      status: 'good'
    },
    {
      id: 'signup_completion',
      name: 'Signup Completion',
      current: 68.5,
      previous: 72.1,
      target: 75.0,
      trend: 'down',
      status: 'warning'
    },
    {
      id: 'onboarding_completion',
      name: 'Onboarding Completion',
      current: 45.3,
      previous: 41.2,
      target: 60.0,
      trend: 'up',
      status: 'warning'
    },
    {
      id: 'first_action',
      name: 'Time to First Action',
      current: 2.1,
      previous: 2.8,
      target: 1.5,
      trend: 'up',
      status: 'good'
    }
  ];

  const abTests: ABTest[] = [
    {
      id: 'hero_cta',
      name: 'Hero CTA Button Text',
      status: 'running',
      variants: [
        { name: 'Schedule Consultation', traffic: 50, conversion: 3.4, confidence: 89 },
        { name: 'Get Started Today', traffic: 50, conversion: 2.8, confidence: 89 }
      ],
      startDate: '2024-01-15'
    },
    {
      id: 'signup_form',
      name: 'Signup Form Length',
      status: 'completed',
      variants: [
        { name: 'Short Form (3 fields)', traffic: 50, conversion: 72.1, confidence: 95 },
        { name: 'Long Form (8 fields)', traffic: 50, conversion: 64.3, confidence: 95 }
      ],
      startDate: '2024-01-08',
      endDate: '2024-01-14'
    }
  ];

  const signupFunnel: Funnel[] = [
    { step: 'Landing Page Visit', visitors: 10000, conversions: 10000, rate: 100, dropoff: 0 },
    { step: 'Clicked Primary CTA', visitors: 10000, conversions: 320, rate: 3.2, dropoff: 96.8 },
    { step: 'Started Signup', visitors: 320, conversions: 280, rate: 87.5, dropoff: 12.5 },
    { step: 'Completed Signup', visitors: 280, conversions: 219, rate: 78.2, dropoff: 21.8 },
    { step: 'Email Verified', visitors: 219, conversions: 195, rate: 89.0, dropoff: 11.0 },
    { step: 'Started Onboarding', visitors: 195, conversions: 170, rate: 87.2, dropoff: 12.8 },
    { step: 'Completed Onboarding', visitors: 170, conversions: 88, rate: 51.8, dropoff: 48.2 }
  ];

  const getMetricTrendIcon = (trend: ConversionMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ConversionMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getTestStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conversion Optimization</h2>
          <p className="text-muted-foreground">
            Monitor and improve your conversion rates across all touchpoints
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="funnels">Conversion Funnels</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {conversionMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold">
                      {metric.name.includes('Time') ? `${metric.current}min` : `${metric.current}%`}
                    </span>
                    {getMetricTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: {metric.name.includes('Time') ? `${metric.target}min` : `${metric.target}%`}</span>
                      <span>
                        {metric.trend === 'up' ? '+' : ''}{(metric.current - metric.previous).toFixed(1)}
                        {metric.name.includes('Time') ? 'min' : '%'}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Optimization Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex flex-col items-start">
                  <div className="font-semibold mb-1">Optimize Landing CTAs</div>
                  <div className="text-sm text-left opacity-80">
                    A/B testing suggests 23% improvement potential
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="font-semibold mb-1">Reduce Signup Friction</div>
                  <div className="text-sm text-left">
                    Progressive profiling could boost completion by 15%
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="font-semibold mb-1">Improve Onboarding</div>
                  <div className="text-sm text-left">
                    Add progress indicators and quick wins
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
              <CardDescription>
                Track user journey and identify optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signupFunnel.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium w-4">{index + 1}</div>
                        <div>
                          <div className="font-medium">{step.step}</div>
                          <div className="text-sm text-muted-foreground">
                            {step.conversions.toLocaleString()} users
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold">{step.rate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">conversion</div>
                        </div>
                        
                        {index > 0 && step.dropoff > 20 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High Dropoff
                          </Badge>
                        )}
                        
                        <div className="w-32">
                          <Progress value={step.rate} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    {index < signupFunnel.length - 1 && step.dropoff > 15 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="bg-white text-xs">
                          -{step.dropoff.toFixed(1)}% dropoff
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active & Recent Tests</h3>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Create New Test
            </Button>
          </div>

          <div className="space-y-4">
            {abTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    <Badge className={getTestStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Started {test.startDate}
                    {test.endDate && ` • Ended ${test.endDate}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {test.variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <div className="font-medium">{variant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {variant.traffic}% traffic
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-semibold">{variant.conversion}%</div>
                            <div className="text-sm text-muted-foreground">conversion</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold">{variant.confidence}%</div>
                            <div className="text-sm text-muted-foreground">confidence</div>
                          </div>
                          
                          {variant.confidence >= 95 && index === 0 && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="font-semibold text-green-800 mb-1">
                    High Impact Opportunity
                  </div>
                  <p className="text-green-700 text-sm">
                    Implementing exit-intent popups could recover 12-18% of abandoning visitors. 
                    Estimated impact: +$2,400 monthly revenue.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="font-semibold text-yellow-800 mb-1">
                    Medium Impact Opportunity
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Adding social proof elements to the signup form could improve completion rates by 8-12%.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="font-semibold text-blue-800 mb-1">
                    Quick Win
                  </div>
                  <p className="text-blue-700 text-sm">
                    Mobile users have 23% lower conversion rates. Consider implementing a mobile-first signup flow.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>
                  How you compare to industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Landing Page Conversion', yours: 3.2, industry: 2.8, status: 'above' },
                    { metric: 'Signup Completion', yours: 68.5, industry: 74.2, status: 'below' },
                    { metric: 'Time to First Value', yours: 2.1, industry: 3.4, status: 'above' }
                  ].map((benchmark, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{benchmark.metric}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">
                          You: {benchmark.metric.includes('Time') ? `${benchmark.yours}min` : `${benchmark.yours}%`}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Industry: {benchmark.metric.includes('Time') ? `${benchmark.industry}min` : `${benchmark.industry}%`}
                        </span>
                        <Badge variant={benchmark.status === 'above' ? 'default' : 'secondary'}>
                          {benchmark.status === 'above' ? 'Above avg' : 'Below avg'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};