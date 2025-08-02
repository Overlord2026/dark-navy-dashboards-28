import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Star,
  Target,
  Award,
  Calendar,
  DollarSign,
  UserPlus,
  Upload,
  Play,
  BarChart3,
  Send,
  Settings,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export function CoachDashboard() {
  const [selectedTab, setSelectedTab] = useState('roster');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Mock data - would come from API
  const metrics = {
    totalAdvisors: 24,
    activeAdvisors: 18,
    completionRate: 78,
    avgPerformanceImprovement: 35,
    revenueImpact: 2100000,
    meetingConversion: 84
  };

  const advisorRoster = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com',
      status: 'active', 
      progress: 85, 
      rating: 4.8, 
      clients: 12,
      lastActivity: '2 hours ago',
      engagementScore: 92,
      milestones: ['First Client', 'Revenue Goal', 'Certification'],
      currentModule: 'Advanced Prospecting'
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      email: 'mike@example.com',
      status: 'active', 
      progress: 72, 
      rating: 4.6, 
      clients: 8,
      lastActivity: '1 day ago',
      engagementScore: 78,
      milestones: ['First Client', 'Certification'],
      currentModule: 'Client Relationship Building'
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      email: 'emily@example.com',
      status: 'inactive', 
      progress: 45, 
      rating: 4.2, 
      clients: 5,
      lastActivity: '1 week ago',
      engagementScore: 54,
      milestones: ['First Client'],
      currentModule: 'Sales Process Basics'
    }
  ];

  const practiceAnalytics = [
    { metric: 'Platform Usage', value: '87%', trend: '+12%', color: 'text-green-600' },
    { metric: 'Lead Generation', value: '156', trend: '+23%', color: 'text-green-600' },
    { metric: 'Client Conversion', value: '68%', trend: '+8%', color: 'text-green-600' },
    { metric: 'Revenue Growth', value: '$2.1M', trend: '+35%', color: 'text-green-600' },
    { metric: 'Meeting Show Rate', value: '84%', trend: '+5%', color: 'text-green-600' },
    { metric: 'Avg Deal Size', value: '$125K', trend: '+18%', color: 'text-green-600' }
  ];

  const curriculumLibrary = [
    { 
      id: 1,
      title: 'Prospecting Mastery', 
      lessons: 8, 
      completed: 6, 
      enrolled: 12,
      type: 'course',
      duration: '4 weeks',
      difficulty: 'Intermediate'
    },
    { 
      id: 2,
      title: 'Client Relationship Building', 
      lessons: 12, 
      completed: 9, 
      enrolled: 8,
      type: 'workshop',
      duration: '6 weeks',
      difficulty: 'Advanced'
    },
    { 
      id: 3,
      title: 'Sales Process Optimization', 
      lessons: 10, 
      completed: 7, 
      enrolled: 15,
      type: 'course',
      duration: '3 weeks',
      difficulty: 'Beginner'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'New Module: Advanced Closing Techniques',
      message: 'A new advanced module on closing techniques is now available. This covers objection handling and psychological triggers.',
      date: '2 days ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Weekly Check-in Reminder',
      message: 'Remember to complete your weekly progress check-in by Friday.',
      date: '5 days ago',
      priority: 'medium'
    }
  ];

  const filteredAdvisors = advisorRoster.filter(advisor => 
    filterStatus === 'all' || advisor.status === filterStatus
  );

  return (
    <ThreeColumnLayout title="Coach Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Advisors</CardTitle>
              <Users className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.totalAdvisors}</div>
              <p className="text-xs text-white/80">
                {metrics.activeAdvisors} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">+{metrics.avgPerformanceImprovement}%</div>
              <p className="text-xs text-muted-foreground">avg improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completionRate}%</div>
              <p className="text-xs text-muted-foreground">modules completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${(metrics.revenueImpact / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">generated by advisors</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="roster">Advisor Roster</TabsTrigger>
            <TabsTrigger value="analytics">Practice Analytics</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum Library</TabsTrigger>
            <TabsTrigger value="messaging">Group Messaging</TabsTrigger>
            <TabsTrigger value="sandbox">Demo Sandbox</TabsTrigger>
          </TabsList>

          {/* Advisor Roster Tab */}
          <TabsContent value="roster" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Advisor Roster</h3>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Advisor
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredAdvisors.map((advisor) => (
                <Card key={advisor.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{advisor.name}</CardTitle>
                        <CardDescription>{advisor.email}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={advisor.status === 'active' ? 'default' : 'secondary'}>
                          {advisor.status}
                        </Badge>
                        <Badge variant="outline">
                          Engagement: {advisor.engagementScore}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Progress</span>
                        <div className="font-medium">{advisor.progress}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{advisor.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clients</span>
                        <div className="font-medium">{advisor.clients}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Active</span>
                        <div className="font-medium">{advisor.lastActivity}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Current Module: {advisor.currentModule}</span>
                        <span>{advisor.progress}%</span>
                      </div>
                      <Progress value={advisor.progress} className="h-2" />
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Milestones Achieved:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {advisor.milestones.map((milestone, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {milestone}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Message</Button>
                      <Button variant="outline" size="sm">Set Goals</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Practice Analytics</h3>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Data
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {practiceAnalytics.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className={`text-xs ${item.color}`}>
                      {item.trend} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage & Outcomes Trends</CardTitle>
                <CardDescription>Platform engagement and business outcomes over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics charts would be rendered here</p>
                  <p className="text-sm">Connect to your data source to view trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Library Tab */}
          <TabsContent value="curriculum" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Curriculum Library</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Content
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Module
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {curriculumLibrary.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {module.title}
                          <Badge variant="outline">{module.type}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {module.duration} • {module.difficulty} Level
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{module.enrolled} enrolled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Lessons</span>
                        <div className="font-medium">{module.lessons} total</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion</span>
                        <div className="font-medium">
                          {Math.round((module.completed / module.lessons) * 100)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Enrolled</span>
                        <div className="font-medium">{module.enrolled} advisors</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round((module.completed / module.lessons) * 100)}%</span>
                      </div>
                      <Progress value={(module.completed / module.lessons) * 100} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">Edit Content</Button>
                      <Button variant="outline" size="sm">Track Completion</Button>
                      <Button variant="outline" size="sm">View Analytics</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Group Messaging Tab */}
          <TabsContent value="messaging" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Group Messaging & Announcements</h3>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send Announcement
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
                <CardDescription>Send updates to your advisor group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Announcement title..." />
                <Textarea 
                  placeholder="Your message..." 
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Send to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Advisors</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Send Now</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h4 className="font-medium">Recent Announcements</h4>
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{announcement.title}</h5>
                          <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{announcement.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {announcement.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Demo Sandbox Tab */}
          <TabsContent value="sandbox" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Demo & Training Sandbox</h3>
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Configure Sandbox
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Training Environment
                  </CardTitle>
                  <CardDescription>
                    Safe practice space with mock data for advisor training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mock Clients Created</span>
                      <span className="font-medium">25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Practice Scenarios</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Training Sessions</span>
                      <span className="font-medium">48</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reset Environment</Button>
                    <Button variant="outline" size="sm">Add Scenarios</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Demo Playground
                  </CardTitle>
                  <CardDescription>
                    Interactive demo for prospects and new advisors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Demo Completions</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Demo Time</span>
                      <span className="font-medium">12 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium text-green-600">68%</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Launch Demo</Button>
                    <Button variant="outline" size="sm">Customize</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sandbox Features</CardTitle>
                <CardDescription>Available training and demo capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { feature: 'Mock Client Portal', status: 'active' },
                    { feature: 'Practice Proposals', status: 'active' },
                    { feature: 'Training Scenarios', status: 'active' },
                    { feature: 'Demo Workflows', status: 'active' },
                    { feature: 'Progress Tracking', status: 'active' },
                    { feature: 'Assessment Tools', status: 'coming_soon' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{item.feature}</span>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status === 'active' ? 'Active' : 'Coming Soon'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}