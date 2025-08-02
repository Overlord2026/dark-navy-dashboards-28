import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  BarChart3,
  Star,
  Trophy,
  Activity
} from 'lucide-react';

export function ProgressTracker() {
  const [selectedAdvisor, setSelectedAdvisor] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const advisors = [
    { value: 'all', label: 'All Advisors' },
    { value: 'sarah', label: 'Sarah Johnson' },
    { value: 'mike', label: 'Mike Chen' },
    { value: 'emily', label: 'Emily Davis' },
    { value: 'david', label: 'David Wilson' }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const advisorProgress = [
    {
      id: 1,
      name: 'Sarah Johnson',
      coach: 'Mike Chen',
      program: 'Advanced Prospecting Mastery',
      progress: 85,
      completedModules: 17,
      totalModules: 20,
      currentModule: 'Objection Handling',
      startDate: '2024-01-15',
      expectedCompletion: '2024-03-15',
      keyMetrics: {
        leadGeneration: { current: 45, target: 50, improvement: 28 },
        conversionRate: { current: 18, target: 20, improvement: 35 },
        clientSatisfaction: { current: 4.7, target: 4.8, improvement: 12 }
      },
      recentAchievements: [
        'Completed Sales Psychology Module',
        'Achieved 25% increase in qualified leads',
        'Improved follow-up response rate by 40%'
      ],
      upcomingMilestones: [
        { name: 'Complete Objection Handling', due: '2024-03-01', progress: 60 },
        { name: 'First $150K Month', due: '2024-03-15', progress: 25 }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      coach: 'Lisa Anderson',
      program: 'Client Relationship Excellence',
      progress: 72,
      completedModules: 13,
      totalModules: 18,
      currentModule: 'Advanced Communication',
      startDate: '2024-02-01',
      expectedCompletion: '2024-04-01',
      keyMetrics: {
        clientRetention: { current: 94, target: 96, improvement: 15 },
        referralRate: { current: 32, target: 35, improvement: 45 },
        meetingEfficiency: { current: 78, target: 80, improvement: 22 }
      },
      recentAchievements: [
        'Improved client retention by 15%',
        'Generated 8 referrals this month',
        'Implemented new meeting structure'
      ],
      upcomingMilestones: [
        { name: 'Complete Communication Module', due: '2024-03-05', progress: 40 },
        { name: 'Achieve 96% Retention Rate', due: '2024-03-30', progress: 80 }
      ]
    },
    {
      id: 3,
      name: 'Emily Davis',
      coach: 'David Martinez',
      program: 'Practice Management Optimization',
      progress: 56,
      completedModules: 8,
      totalModules: 15,
      currentModule: 'Technology Integration',
      startDate: '2024-02-15',
      expectedCompletion: '2024-04-15',
      keyMetrics: {
        efficiency: { current: 68, target: 75, improvement: 18 },
        techAdoption: { current: 75, target: 85, improvement: 30 },
        teamProductivity: { current: 82, target: 90, improvement: 12 }
      },
      recentAchievements: [
        'Automated client onboarding process',
        'Reduced admin time by 30%',
        'Improved team collaboration tools'
      ],
      upcomingMilestones: [
        { name: 'Complete Tech Integration', due: '2024-03-10', progress: 70 },
        { name: 'Achieve 75% Efficiency Score', due: '2024-03-25', progress: 45 }
      ]
    }
  ];

  const overallStats = {
    totalAdvisors: 24,
    activePrograms: 18,
    avgCompletionRate: 78,
    avgImprovement: 25,
    milestonesAchieved: 156,
    resourcesCompleted: 234
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricTrend = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progress Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Monitor advisor development and milestone achievements
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {advisors.map((advisor) => (
                <SelectItem key={advisor.value} value={advisor.value}>
                  {advisor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-36">
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

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.activePrograms}</div>
            <p className="text-xs text-muted-foreground">
              {overallStats.totalAdvisors} total advisors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Program completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{overallStats.avgImprovement}%</div>
            <p className="text-xs text-muted-foreground">
              Performance increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.milestonesAchieved}</div>
            <p className="text-xs text-muted-foreground">
              Achieved this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advisor Progress Cards */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Individual Progress</h4>
        
        {advisorProgress.map((advisor) => (
          <Card key={advisor.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{advisor.name}</CardTitle>
                    <CardDescription>
                      Coach: {advisor.coach} • {advisor.program}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={advisor.progress >= 80 ? 'default' : advisor.progress >= 60 ? 'secondary' : 'destructive'}>
                  {advisor.progress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Program Progress</span>
                  <span className="font-medium">{advisor.completedModules}/{advisor.totalModules} modules</span>
                </div>
                <Progress value={advisor.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {advisor.currentModule}</span>
                  <span>Due: {advisor.expectedCompletion}</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h5 className="font-medium mb-3">Key Performance Metrics</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(advisor.keyMetrics).map(([key, metric]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`font-medium ${getMetricTrend(metric.current, metric.target)}`}>
                          {typeof metric.current === 'number' && metric.current < 10 
                            ? metric.current.toFixed(1) 
                            : metric.current}
                          {key.includes('Rate') || key.includes('Retention') ? '%' : ''}
                        </span>
                      </div>
                      <Progress 
                        value={(metric.current / metric.target) * 100} 
                        className="h-1" 
                      />
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.target} (+{metric.improvement}% improvement)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h5 className="font-medium mb-3">Recent Achievements</h5>
                <div className="space-y-2">
                  {advisor.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-green-600" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div>
                <h5 className="font-medium mb-3">Upcoming Milestones</h5>
                <div className="space-y-3">
                  {advisor.upcomingMilestones.map((milestone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{milestone.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{milestone.due}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={milestone.progress} className="flex-1 h-1" />
                        <span className="text-xs text-muted-foreground w-12">
                          {milestone.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Message Coach</Button>
                <Button size="sm" variant="outline">Set Goals</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}