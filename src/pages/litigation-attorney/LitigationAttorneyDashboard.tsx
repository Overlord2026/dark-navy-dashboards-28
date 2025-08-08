import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Gavel, 
  FileText, 
  Shield, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Plus,
  BarChart3,
  Target,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LitigationAttorneyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const activeCases = [
    {
      id: 1,
      title: 'Smith v. Johnson Construction',
      type: 'Personal Injury',
      status: 'Discovery',
      trialDate: '2024-03-15',
      priority: 'high',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      title: 'ABC Corp Employment Dispute',
      type: 'Employment Law',
      status: 'Mediation',
      trialDate: '2024-04-22',
      priority: 'medium',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      title: 'Tech Startup IP Litigation',
      type: 'Intellectual Property',
      status: 'Filed',
      trialDate: '2024-06-10',
      priority: 'high',
      lastActivity: '3 hours ago'
    }
  ];

  const upcomingDeadlines = [
    { task: 'Discovery responses due - Smith case', date: '2024-01-20', priority: 'urgent' },
    { task: 'Expert witness disclosure - ABC Corp', date: '2024-01-25', priority: 'high' },
    { task: 'Motion hearing - Tech Startup', date: '2024-01-30', priority: 'medium' }
  ];

  const evidenceTracker = [
    { 
      caseId: 1, 
      item: 'Medical Records - Dr. Williams', 
      type: 'Document', 
      status: 'Verified',
      lastAccessed: '2024-01-15',
      handler: 'J. Doe'
    },
    { 
      caseId: 2, 
      item: 'Employment Contract - Original', 
      type: 'Physical', 
      status: 'Pending',
      lastAccessed: '2024-01-14',
      handler: 'M. Smith'
    }
  ];

  const settlementPlannings = [
    {
      caseId: 1,
      clientName: 'Robert Smith',
      estimatedSettlement: '$750,000',
      swagScore: 85,
      planStatus: 'In Progress'
    },
    {
      caseId: 2,
      clientName: 'Jane Wilson',
      estimatedSettlement: '$125,000',
      swagScore: 72,
      planStatus: 'Completed'
    }
  ];

  const dashboardStats = {
    activeCases: 12,
    upcomingDeadlines: 8,
    evidenceItems: 156,
    settlementPlanning: 5
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Gavel className="h-8 w-8 text-primary" />
                Litigation Command Center
              </h1>
              <p className="text-muted-foreground mt-2">Manage cases, track evidence, and plan settlements</p>
            </div>
            <div className="flex gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="case-vault">Case Vault</TabsTrigger>
            <TabsTrigger value="evidence">Evidence Tracker</TabsTrigger>
            <TabsTrigger value="settlement">Settlement Planning</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Center</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Hub</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activeCases}</div>
                    <p className="text-xs text-muted-foreground">+3 from last month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.upcomingDeadlines}</div>
                    <p className="text-xs text-muted-foreground">Next in 3 days</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.evidenceItems}</div>
                    <p className="text-xs text-muted-foreground">Chain of custody verified</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Settlement Planning</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.settlementPlanning}</div>
                    <p className="text-xs text-muted-foreground">SWAG™ integration active</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Active Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Active Cases
                  </CardTitle>
                  <CardDescription>Cases requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCases.map((case_) => (
                      <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{case_.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {case_.type} • Trial: {case_.trialDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${getPriorityColor(case_.priority)} text-white`}
                          >
                            {case_.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Important dates and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{deadline.task}</div>
                          <div className="text-sm text-muted-foreground">{deadline.date}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(deadline.priority)} text-white`}
                        >
                          {deadline.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Case Vault Tab */}
          <TabsContent value="case-vault" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Vault</CardTitle>
                <CardDescription>Secure storage for all case documents and filings</CardDescription>
                <div className="flex gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search cases..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cases</SelectItem>
                      <SelectItem value="personal-injury">Personal Injury</SelectItem>
                      <SelectItem value="employment">Employment Law</SelectItem>
                      <SelectItem value="ip">Intellectual Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {activeCases.map((case_) => (
                    <Card key={case_.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{case_.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{case_.type}</span>
                              <span>•</span>
                              <span>Status: {case_.status}</span>
                              <span>•</span>
                              <span>Last activity: {case_.lastActivity}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Files</Button>
                            <Button size="sm">Manage Case</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence Tracker Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Evidence Chain-of-Custody Tracker
                </CardTitle>
                <CardDescription>Complete audit trail for all evidence and exhibits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceTracker.map((evidence, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{evidence.item}</div>
                        <div className="text-sm text-muted-foreground">
                          {evidence.type} • Last accessed: {evidence.lastAccessed} by {evidence.handler}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={evidence.status === 'Verified' ? 'default' : 'secondary'}>
                          {evidence.status}
                        </Badge>
                        <Button variant="outline" size="sm">View Chain</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settlement Planning Tab */}
          <TabsContent value="settlement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Settlement Financial Planning
                </CardTitle>
                <CardDescription>SWAG™ Retirement Roadmap integration for post-settlement planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settlementPlannings.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{plan.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          Estimated Settlement: {plan.estimatedSettlement} • SWAG Score: {plan.swagScore}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={plan.planStatus === 'Completed' ? 'default' : 'secondary'}>
                          {plan.planStatus}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Scenarios
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Center Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Audit Center</CardTitle>
                <CardDescription>Track deadlines, filings, and maintain audit trails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Court Filing Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Motion to Dismiss - Smith case</span>
                        <Badge className="bg-green-500 text-white">Filed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Discovery Request - ABC Corp</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Audit Log Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Document access logs</span>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Evidence chain records</span>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Hub Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Hub</CardTitle>
                <CardDescription>Grow your practice with integrated marketing tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Presentation Deck</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        "Litigation in the Digital Era" - Present to potential clients
                      </p>
                      <Button className="w-full">View Deck</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Marketing Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        PDFs, email templates, and social media banners
                      </p>
                      <Button variant="outline" className="w-full">Download Assets</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Referral Network</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect with other professionals in our network
                      </p>
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Browse Network
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}