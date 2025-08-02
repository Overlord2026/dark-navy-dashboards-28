import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Upload, 
  Target, 
  TrendingUp, 
  FileText, 
  Video, 
  CheckCircle, 
  Clock,
  Star,
  BarChart3,
  UserPlus,
  MessageSquare,
  Award,
  Lightbulb,
  BookOpen,
  Calendar,
  Plus
} from 'lucide-react';
import { CoachOnboarding } from './CoachOnboarding';
import { ResourceLibrary } from './ResourceLibrary';
import { ProgressTracker } from './ProgressTracker';
import { CoachingMetrics } from './CoachingMetrics';
import { TaskAssignment } from './TaskAssignment';

export function CoachingModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Mock data
  const coachingStats = {
    totalAdvisors: 24,
    activeCoaches: 6,
    completionRate: 78,
    avgPerformanceImprovement: 35,
    resourcesShared: 156,
    activeMilestones: 42
  };

  const recentActivity = [
    {
      id: 1,
      type: 'progress',
      advisor: 'Sarah Johnson',
      coach: 'Mike Chen',
      activity: 'Completed Advanced Prospecting module',
      time: '2 hours ago',
      impact: '+15% lead conversion'
    },
    {
      id: 2,
      type: 'resource',
      advisor: 'David Wilson',
      coach: 'Lisa Anderson',
      activity: 'Shared Client Meeting Playbook',
      time: '1 day ago',
      impact: 'Resource downloaded'
    },
    {
      id: 3,
      type: 'milestone',
      advisor: 'Emily Davis',
      coach: 'Mike Chen',
      activity: 'Achieved First $100K Milestone',
      time: '2 days ago',
      impact: '+25% revenue growth'
    }
  ];

  const topCoaches = [
    {
      id: 1,
      name: 'Mike Chen',
      specialties: ['Prospecting', 'Sales Process'],
      advisors: 12,
      rating: 4.9,
      completionRate: 92,
      avgImprovement: 45
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      specialties: ['Client Relations', 'Practice Management'],
      advisors: 8,
      rating: 4.8,
      completionRate: 89,
      avgImprovement: 38
    },
    {
      id: 3,
      name: 'David Martinez',
      specialties: ['Technology', 'Efficiency'],
      advisors: 6,
      rating: 4.7,
      completionRate: 85,
      avgImprovement: 32
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coaching Hub</h2>
          <p className="text-muted-foreground">
            Professional development and practice optimization through expert coaching
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Find a Coach
          </Button>
          <Button className="gap-2" onClick={() => setShowOnboarding(true)}>
            <Users className="h-4 w-4" />
            Become a Coach
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coaches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachingStats.activeCoaches}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advisors Coached</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachingStats.totalAdvisors}</div>
            <p className="text-xs text-muted-foreground">
              Across all programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachingStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Program completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{coachingStats.avgPerformanceImprovement}%</div>
            <p className="text-xs text-muted-foreground">
              Performance increase
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coaches">Find Coaches</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Coaching Activity</CardTitle>
                <CardDescription>Latest progress and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'progress' ? 'bg-green-500' :
                      activity.type === 'resource' ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.advisor}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">Coach: {activity.coach}</p>
                      {activity.impact && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.impact}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Coaches */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Coaches</CardTitle>
                <CardDescription>Highest rated coaches by results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCoaches.map((coach, index) => (
                  <div key={coach.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{coach.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {coach.specialties.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{coach.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {coach.advisors} advisors
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Completion:</span>
                        <span className="font-medium ml-1">{coach.completionRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Improvement:</span>
                        <span className="font-medium ml-1">+{coach.avgImprovement}%</span>
                      </div>
                    </div>
                    {index < topCoaches.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with coaching or enhance your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <UserPlus className="h-6 w-6" />
                  <span className="text-sm">Find a Coach</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Browse Resources</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule Session</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Progress</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Find Coaches Tab */}
        <TabsContent value="coaches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Coaches</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Request Coaching
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topCoaches.map((coach) => (
              <Card key={coach.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{coach.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{coach.rating}</span>
                    </div>
                  </div>
                  <CardDescription>
                    Specializes in {coach.specialties.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Advisors:</span>
                      <div className="font-medium">{coach.advisors}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <div className="font-medium">{coach.completionRate}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Avg Improvement</span>
                      <span className="font-medium">+{coach.avgImprovement}%</span>
                    </div>
                    <Progress value={coach.avgImprovement} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Connect</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <ResourceLibrary />
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <ProgressTracker />
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <CoachingMetrics />
        </TabsContent>
      </Tabs>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <CoachOnboarding onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}