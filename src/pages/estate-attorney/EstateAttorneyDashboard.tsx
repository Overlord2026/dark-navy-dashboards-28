import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  Shield, 
  Users, 
  FileText, 
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EstateAttorneyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const dashboardStats = [
    { label: 'Active Clients', value: '24', icon: Users, change: '+3 this week' },
    { label: 'Documents Pending', value: '8', icon: FileText, change: '2 due today' },
    { label: 'Vault Storage Used', value: '67%', icon: Shield, change: '1.2GB available' },
    { label: 'Monthly Revenue', value: '$18,500', icon: DollarSign, change: '+12% vs last month' }
  ];

  const recentClients = [
    { name: 'Johnson Family Trust', status: 'Review Pending', priority: 'high', dueDate: 'Today' },
    { name: 'Martinez Estate Plan', status: 'Documents Complete', priority: 'low', dueDate: 'Next Week' },
    { name: 'Chen Digital Assets', status: 'In Progress', priority: 'medium', dueDate: 'Tomorrow' },
    { name: 'Wilson Business Succession', status: 'Initial Consultation', priority: 'medium', dueDate: '3 days' }
  ];

  const upcomingTasks = [
    { task: 'Notary appointment - Johnson Trust', time: '2:00 PM', type: 'appointment' },
    { task: 'Review Martinez will updates', time: '4:30 PM', type: 'review' },
    { task: 'Client vault setup - Chen family', time: 'Tomorrow 10 AM', type: 'setup' },
    { task: 'Legacy planning session', time: 'Friday 3 PM', type: 'consultation' }
  ];

  const legacyPlanningCases = [
    { client: 'Johnson Family', phase: 'Legacy Distribution', progress: 85, value: '$2.4M' },
    { client: 'Martinez Estate', phase: 'Tax Planning', progress: 60, value: '$1.8M' },
    { client: 'Chen Holdings', phase: 'Asset Protection', progress: 40, value: '$3.2M' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Scale className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Estate Planning Portal</h1>
                <p className="text-muted-foreground">Good morning, Sarah Thompson</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation */}
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="vaults">Client Vaults</TabsTrigger>
            <TabsTrigger value="legacy">Legacy Planning</TabsTrigger>
            <TabsTrigger value="roadmap">Retirement Roadmap™</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Hub</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Clients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Recent Client Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{client.name}</h4>
                            <p className="text-sm text-muted-foreground">{client.status}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(client.priority)}>
                              {client.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{client.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingTasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium">{task.task}</p>
                            <p className="text-sm text-muted-foreground">{task.time}</p>
                          </div>
                          <Badge variant="outline">{task.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Legacy Planning Cases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    SWAG Legacy Phase Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {legacyPlanningCases.map((case_, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{case_.client}</h4>
                          <Badge variant="outline">{case_.value}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{case_.phase}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{case_.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${case_.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="vaults">
            <Card>
              <CardHeader>
                <CardTitle>Client Vaults</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Secure document storage and management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legacy">
            <Card>
              <CardHeader>
                <CardTitle>Legacy Planning Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Legacy impact reports and planning tools would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle>SWAG Retirement Roadmap™ Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Retirement roadmap and wealth planning integration would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Document tracking, notarizations, and compliance monitoring would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Client presentations, referral tools, and marketing materials would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Practice settings, branding, and configuration options would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
