import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedCalculatorChart } from '@/components/calculators/EnhancedCalculatorChart';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3, 
  Activity, 
  Award,
  Clock,
  Smartphone,
  MousePointer,
  UserCheck
} from 'lucide-react';

export function CoachingMetrics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarter');
  const [selectedMetric, setSelectedMetric] = useState('adoption');

  const timeframes = [
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' }
  ];

  const metricTypes = [
    { value: 'adoption', label: 'Adoption Rate' },
    { value: 'conversion', label: 'Conversion Improvements' },
    { value: 'sales', label: 'Lead-to-Sale' },
    { value: 'tech', label: 'Tech Usage Score' }
  ];

  // Mock data for different metrics
  const metricsData = {
    adoption: {
      current: 78,
      target: 85,
      trend: '+12%',
      chartData: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 70 },
        { month: 'Mar', value: 75 },
        { month: 'Apr', value: 78 },
        { month: 'May', value: 82 },
        { month: 'Jun', value: 78 }
      ]
    },
    conversion: {
      current: 35,
      target: 40,
      trend: '+28%',
      chartData: [
        { month: 'Jan', value: 25 },
        { month: 'Feb', value: 28 },
        { month: 'Mar', value: 32 },
        { month: 'Apr', value: 35 },
        { month: 'May', value: 38 },
        { month: 'Jun', value: 35 }
      ]
    },
    sales: {
      current: 24,
      target: 30,
      trend: '+45%',
      chartData: [
        { month: 'Jan', value: 18 },
        { month: 'Feb', value: 20 },
        { month: 'Mar', value: 22 },
        { month: 'Apr', value: 24 },
        { month: 'May', value: 26 },
        { month: 'Jun', value: 24 }
      ]
    },
    tech: {
      current: 72,
      target: 80,
      trend: '+18%',
      chartData: [
        { month: 'Jan', value: 58 },
        { month: 'Feb', value: 62 },
        { month: 'Mar', value: 68 },
        { month: 'Apr', value: 72 },
        { month: 'May', value: 75 },
        { month: 'Jun', value: 72 }
      ]
    }
  };

  const keyMetrics = [
    {
      title: 'Program Adoption Rate',
      value: '78%',
      change: '+12%',
      icon: UserCheck,
      color: 'text-blue-600',
      description: 'Advisors actively participating in coaching programs'
    },
    {
      title: 'Avg Conversion Improvement',
      value: '+35%',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600',
      description: 'Average improvement in conversion rates'
    },
    {
      title: 'Lead-to-Sale Rate',
      value: '24%',
      change: '+45%',
      icon: Target,
      color: 'text-purple-600',
      description: 'Percentage of leads converting to clients'
    },
    {
      title: 'Tech Usage Score',
      value: '72/100',
      change: '+18%',
      icon: Smartphone,
      color: 'text-orange-600',
      description: 'Platform feature adoption and utilization'
    }
  ];

  const coachPerformance = [
    {
      name: 'Mike Chen',
      advisors: 12,
      completionRate: 92,
      avgImprovement: 45,
      retention: 100,
      satisfaction: 4.9
    },
    {
      name: 'Lisa Anderson',
      advisors: 8,
      completionRate: 89,
      avgImprovement: 38,
      retention: 95,
      satisfaction: 4.8
    },
    {
      name: 'David Martinez',
      advisors: 6,
      completionRate: 85,
      avgImprovement: 32,
      retention: 88,
      satisfaction: 4.7
    },
    {
      name: 'Sarah Johnson',
      advisors: 10,
      completionRate: 87,
      avgImprovement: 40,
      retention: 92,
      satisfaction: 4.8
    }
  ];

  const programMetrics = [
    {
      program: 'Prospecting Mastery',
      enrolled: 24,
      completed: 18,
      avgRating: 4.7,
      outcomeImprovement: 42
    },
    {
      program: 'Client Relations Excellence',
      enrolled: 18,
      completed: 14,
      avgRating: 4.8,
      outcomeImprovement: 35
    },
    {
      program: 'Practice Management',
      enrolled: 15,
      completed: 12,
      avgRating: 4.6,
      outcomeImprovement: 28
    },
    {
      program: 'Technology Integration',
      enrolled: 12,
      completed: 9,
      avgRating: 4.5,
      outcomeImprovement: 31
    }
  ];

  const currentMetric = metricsData[selectedMetric as keyof typeof metricsData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Coaching Metrics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Track adoption, performance improvements, and program effectiveness
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600">
                {metric.change} from last period
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="coaches">Coach Performance</TabsTrigger>
          <TabsTrigger value="programs">Program Effectiveness</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        {/* Trend Analysis */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">
              Current: {currentMetric.current}% | Target: {currentMetric.target}%
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Metric Trend Analysis</CardTitle>
              <CardDescription>
                {metricTypes.find(t => t.value === selectedMetric)?.label} over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedCalculatorChart
                data={currentMetric.chartData}
                type="line"
                xKey="month"
                yKey="value"
                title=""
                color="#10b981"
                height={300}
                animated={true}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance vs Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current</span>
                    <span className="font-medium">{currentMetric.current}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target</span>
                    <span className="font-medium">{currentMetric.target}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gap</span>
                    <span className="font-medium text-orange-600">
                      {currentMetric.target - currentMetric.current}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trend Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {currentMetric.trend}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs last period
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Month</span>
                    <span className="font-medium">
                      {Math.min(currentMetric.current + 2, currentMetric.target)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Date</span>
                    <span className="font-medium text-green-600">
                      {currentMetric.current >= currentMetric.target ? 'Achieved' : 'Q3 2024'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Coach Performance */}
        <TabsContent value="coaches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coach Performance Leaderboard</CardTitle>
              <CardDescription>Rankings based on advisor outcomes and satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coachPerformance.map((coach, index) => (
                  <div key={coach.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{coach.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {coach.advisors} advisors coached
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-sm font-medium">{coach.completionRate}%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-600">+{coach.avgImprovement}%</div>
                        <div className="text-xs text-muted-foreground">Improvement</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{coach.retention}%</div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{coach.satisfaction}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Program Effectiveness */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Performance Analysis</CardTitle>
              <CardDescription>Enrollment, completion rates, and outcome improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programMetrics.map((program) => (
                  <div key={program.program} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{program.program}</h4>
                      <Badge variant="outline">
                        {program.completed}/{program.enrolled} completed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{Math.round((program.completed / program.enrolled) * 100)}%</div>
                        <div className="text-xs text-muted-foreground">Completion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{program.avgRating}</div>
                        <div className="text-xs text-muted-foreground">Avg Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">+{program.outcomeImprovement}%</div>
                        <div className="text-xs text-muted-foreground">Improvement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{program.enrolled}</div>
                        <div className="text-xs text-muted-foreground">Enrolled</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Analysis */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coaching ROI Summary</CardTitle>
                <CardDescription>Financial impact of coaching programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Program Investment</span>
                    <span className="font-medium">$48,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Increase</span>
                    <span className="font-medium text-green-600">$156,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net ROI</span>
                    <span className="font-medium text-green-600">+225%</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    Avg payback period: 3.2 months
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Breakdown</CardTitle>
                <CardDescription>Sources of value creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Increased conversion rates</span>
                  <span className="text-sm font-medium">$68,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Higher client retention</span>
                  <span className="text-sm font-medium">$42,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Improved efficiency</span>
                  <span className="text-sm font-medium">$28,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Referral generation</span>
                  <span className="text-sm font-medium">$18,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}