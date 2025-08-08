import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Target, 
  FolderOpen, 
  MessageSquare,
  Plus,
  BarChart3,
  Phone,
  Video,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';

export const CoachDashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('clients');

  const clients = [
    {
      id: 1,
      name: 'Sarah Chen',
      program: 'Executive Leadership',
      progress: 75,
      nextSession: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      program: 'Business Strategy',
      progress: 45,
      nextSession: '2024-01-16',
      status: 'active'
    },
    {
      id: 3,
      name: 'Jennifer Walsh',
      program: 'Wealth Mindset',
      progress: 90,
      nextSession: '2024-01-17',
      status: 'completing'
    }
  ];

  const programs = [
    {
      id: 1,
      name: 'Executive Leadership Intensive',
      duration: '12 weeks',
      price: '$15,000',
      activeClients: 5,
      completionRate: 92
    },
    {
      id: 2,
      name: 'Business Strategy Accelerator',
      duration: '8 weeks',
      price: '$8,500',
      activeClients: 3,
      completionRate: 88
    }
  ];

  const leads = [
    {
      id: 1,
      name: 'David Thompson',
      company: 'Thompson Ventures',
      interest: 'Executive Coaching',
      budget: '$10,000+',
      status: 'new',
      submittedAt: '2024-01-14'
    },
    {
      id: 2,
      name: 'Lisa Park',
      company: 'Park Industries',
      interest: 'Leadership Development',
      budget: '$15,000+',
      status: 'contacted',
      submittedAt: '2024-01-13'
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Programs</span>
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Scheduler</span>
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Client CRM</h2>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </div>

          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-muted-foreground">{client.program}</p>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${client.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{client.progress}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Next Session</p>
                      <p className="text-sm font-medium">{client.nextSession}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Meet
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Program Builder</h2>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Program
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{program.name}</span>
                    <Badge variant="secondary">{program.duration}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold">{program.price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Clients</span>
                      <span className="font-semibold">{program.activeClients}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold text-primary">{program.completionRate}%</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">Edit Program</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Create New Program</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Build a structured coaching program with modules, assignments, and outcomes
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Session Scheduler</h2>
            <Button className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Block Time
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Executive Leadership Session 8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Today 2:00 PM</p>
                      <Badge variant="secondary" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Marcus Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Strategy Review</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Tomorrow 10:00 AM</p>
                      <Badge variant="secondary" className="text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        Phone
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-semibold">12 sessions</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Duration</span>
                    <span className="font-semibold">58 minutes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">No-Show Rate</span>
                    <span className="font-semibold text-green-600">2%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue This Week</span>
                    <span className="font-semibold">$4,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Marketplace Leads</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid gap-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <p className="text-muted-foreground">{lead.company}</p>
                    </div>
                    <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                      {lead.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Interest</p>
                      <p className="text-sm font-medium">{lead.interest}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget</p>
                      <p className="text-sm font-medium">{lead.budget}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                      <p className="text-sm font-medium">{lead.submittedAt}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Collaboration Center</h2>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Message
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">Session follow-up questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marcus Rodriguez</p>
                      <p className="text-xs text-muted-foreground">Strategy document shared</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Connect with Advisor</p>
                      <p className="text-xs text-muted-foreground">For client referrals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Program Materials</p>
                      <p className="text-xs text-muted-foreground">15 files</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Client Resources</p>
                      <p className="text-xs text-muted-foreground">8 files</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue (MTD)</p>
                    <p className="text-2xl font-bold">$18,500</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">4.9</p>
                  </div>
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">Based on 156 reviews</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Goal Achievement Rate</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="font-semibold">4.9/5.0</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Referral Rate</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <span className="font-semibold">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Executive Leadership</span>
                    <span className="font-semibold text-green-600">95% completion</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Business Strategy</span>
                    <span className="font-semibold text-green-600">88% completion</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Wealth Mindset</span>
                    <span className="font-semibold text-yellow-600">76% completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};