import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolGate } from '@/components/tools/ToolGate';
import { 
  Shield, 
  Users, 
  FileText, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Upload,
  Mail,
  CreditCard,
  Clock,
  CheckCircle,
  Bell,
  Globe,
  Building2,
  UserPlus,
  Settings,
  BarChart3,
  Archive,
  Video,
  MessageSquare,
  Car,
  Home,
  Heart,
  DollarSign,
  Award,
  Target,
  Briefcase
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const InsuranceDashboard = () => {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            BFO Insurance Experience™
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.displayName}! Manage your practice with modern tools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Award className="h-3 w-3 mr-1" />
            BFO Certified Partner
          </Badge>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Producer
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Premium</p>
                <p className="text-2xl font-bold">$124K</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              All up to date
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: UserPlus, text: "New agent John Smith joined", time: "2 hours ago", type: "success" },
                    { icon: FileText, text: "Policy application submitted", time: "4 hours ago", type: "info" },
                    { icon: AlertTriangle, text: "License renewal due for 3 agents", time: "1 day ago", type: "warning" },
                    { icon: CheckCircle, text: "CE requirements completed", time: "2 days ago", type: "success" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                      <activity.icon className={`h-4 w-4 ${
                        activity.type === 'success' ? 'text-green-600' :
                        activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <ToolGate toolKey="agent-invite" fallbackRoute="/tools/agent-invite">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" data-tool-card="agent-invite">
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Invite Agent</span>
                  </Button>
                </ToolGate>
                <ToolGate toolKey="insurance-vault" fallbackRoute="/tools/insurance-vault">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" data-tool-card="insurance-vault">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Upload Docs</span>
                  </Button>
                </ToolGate>
                <ToolGate toolKey="insurance-reports" fallbackRoute="/tools/insurance-reports">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" data-tool-card="insurance-reports">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                </ToolGate>
                <ToolGate toolKey="insurance-settings" fallbackRoute="/settings">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" data-tool-card="insurance-settings">
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </ToolGate>
              </CardContent>
            </Card>
          </div>

          {/* Policy Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Policy Performance by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: "Life Insurance", icon: Heart, count: 487, premium: "$45K", growth: "+12%" },
                  { type: "Auto Insurance", icon: Car, count: 623, premium: "$58K", growth: "+8%" },
                  { type: "Home Insurance", icon: Home, count: 137, premium: "$21K", growth: "+15%" }
                ].map((policy, index) => (
                  <Card key={index} className="p-4 bg-secondary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <policy.icon className="h-6 w-6 text-primary" />
                      <h4 className="font-semibold">{policy.type}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Policies</span>
                        <span className="font-semibold">{policy.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Premium</span>
                        <span className="font-semibold">{policy.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="text-green-600 font-semibold">{policy.growth}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Agent Management</h3>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Agent
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", email: "sarah.j@agency.com", role: "Senior Agent", status: "Active", policies: 89, compliance: "100%" },
                  { name: "Mike Chen", email: "mike.c@agency.com", role: "Agent", status: "Active", policies: 67, compliance: "95%" },
                  { name: "Lisa Williams", email: "lisa.w@agency.com", role: "Producer", status: "Training", policies: 23, compliance: "88%" }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-semibold">{agent.role}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Policies</p>
                        <p className="font-semibold">{agent.policies}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Compliance</p>
                        <p className="font-semibold text-green-600">{agent.compliance}</p>
                      </div>
                      <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Policy Management</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-6 w-6 text-red-500" />
                <h4 className="font-semibold">Life Insurance</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Policies</span>
                  <span className="font-semibold">487</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending Applications</span>
                  <span className="font-semibold text-yellow-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Premium</span>
                  <span className="font-semibold text-green-600">$45,230</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Car className="h-6 w-6 text-blue-500" />
                <h4 className="font-semibold">Auto Insurance</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Policies</span>
                  <span className="font-semibold">623</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending Applications</span>
                  <span className="font-semibold text-yellow-600">31</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Premium</span>
                  <span className="font-semibold text-green-600">$58,940</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Home className="h-6 w-6 text-green-500" />
                <h4 className="font-semibold">Home Insurance</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Policies</span>
                  <span className="font-semibold">137</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending Applications</span>
                  <span className="font-semibold text-yellow-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Premium</span>
                  <span className="font-semibold text-green-600">$21,670</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Compliance Center</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload Licenses
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { agent: "Mike Chen", issue: "Life license expires in 30 days", priority: "high" },
                    { agent: "Sarah Johnson", issue: "CE credits due in 45 days", priority: "medium" },
                    { agent: "Lisa Williams", issue: "E&O renewal required", priority: "high" }
                  ].map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{alert.agent}</p>
                          <p className="text-sm text-muted-foreground">{alert.issue}</p>
                        </div>
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  CE Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { agent: "Sarah Johnson", completed: 18, required: 20, due: "Dec 31, 2024" },
                    { agent: "Mike Chen", completed: 12, required: 20, due: "Dec 31, 2024" },
                    { agent: "Lisa Williams", completed: 8, required: 16, due: "Jun 30, 2024" }
                  ].map((ce, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{ce.agent}</p>
                        <p className="text-sm text-muted-foreground">Due: {ce.due}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{ce.completed}/{ce.required} hours</span>
                          <span>{Math.round((ce.completed / ce.required) * 100)}%</span>
                        </div>
                        <Progress value={(ce.completed / ce.required) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Training & Development</h3>
            <Button>
              <Video className="h-4 w-4 mr-2" />
              Schedule Training
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Life Insurance Fundamentals", duration: "2 hours", ce: "2.0 CE", status: "Available" },
                    { title: "Compliance & Ethics", duration: "1.5 hours", ce: "1.5 CE", status: "Available" },
                    { title: "Digital Sales Strategies", duration: "3 hours", ce: "3.0 CE", status: "New" }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.duration} • {course.ce}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={course.status === 'New' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                        <Button size="sm">Start</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { agent: "Sarah Johnson", courses: 8, progress: 95 },
                    { agent: "Mike Chen", courses: 5, progress: 70 },
                    { agent: "Lisa Williams", courses: 3, progress: 45 }
                  ].map((progress, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{progress.agent}</p>
                        <p className="text-sm text-muted-foreground">{progress.courses} courses</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">BFO Marketplace</h3>
            <Button>
              <Globe className="h-4 w-4 mr-2" />
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Refer to Advisors</h4>
                </div>
                <p className="text-muted-foreground">
                  Connect clients with vetted financial advisors in the BFO network for comprehensive planning.
                </p>
                <Button className="w-full">
                  Start Referral
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-primary/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Training Programs</h4>
                </div>
                <p className="text-muted-foreground">
                  Offer specialized training courses to the BFO community and earn additional revenue.
                </p>
                <Button variant="outline" className="w-full">
                  Create Program
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Community</h4>
                </div>
                <p className="text-muted-foreground">
                  Join discussions, share best practices, and network with other insurance professionals.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Partnership Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Estate Planning Attorneys", description: "Connect with qualified estate planning professionals", partners: 47 },
                  { title: "Tax Professionals", description: "Partner with CPAs and tax preparers", partners: 89 },
                  { title: "Financial Advisors", description: "Comprehensive financial planning partnerships", partners: 156 },
                  { title: "Business Consultants", description: "Commercial insurance and business planning", partners: 23 }
                ].map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary">{opportunity.partners} partners available</span>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};