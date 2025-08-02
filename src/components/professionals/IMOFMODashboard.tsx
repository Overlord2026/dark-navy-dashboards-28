import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar, 
  DollarSign,
  Award,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Building2,
  GraduationCap,
  Shield,
  Target,
  BarChart3,
  Bell,
  Settings,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  status: 'active' | 'pending' | 'inactive';
  production_ytd: number;
  licenses: string[];
  appointments: string[];
  ce_status: 'current' | 'expiring' | 'expired';
  last_activity: string;
  recruiting_source: string;
}

export function IMOFMODashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual Supabase queries
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'j.smith@email.com',
          phone: '(555) 123-4567',
          state: 'CA',
          status: 'active',
          production_ytd: 145000,
          licenses: ['Life', 'Health', 'Variable'],
          appointments: ['Company A', 'Company B', 'Company C'],
          ce_status: 'current',
          last_activity: '2024-01-15',
          recruiting_source: 'Referral'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 's.johnson@email.com',
          phone: '(555) 987-6543',
          state: 'TX',
          status: 'active',
          production_ytd: 89000,
          licenses: ['Life', 'Health'],
          appointments: ['Company A', 'Company D'],
          ce_status: 'expiring',
          last_activity: '2024-01-10',
          recruiting_source: 'Online'
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'm.wilson@email.com',
          phone: '(555) 456-7890',
          state: 'FL',
          status: 'pending',
          production_ytd: 0,
          licenses: ['Life'],
          appointments: [],
          ce_status: 'current',
          last_activity: '2024-01-18',
          recruiting_source: 'Career Fair'
        }
      ];

      const mockAnalytics = {
        totalAgents: 247,
        activeAgents: 189,
        pendingOnboarding: 23,
        totalProduction: 12750000,
        avgProduction: 67460,
        topProducers: 15,
        complianceAlerts: 8,
        newRecruits: 12,
        ceCreditsDue: 45,
        upcomingEvents: 3
      };

      setAgents(mockAgents);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching IMO/FMO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active' },
      pending: { variant: 'secondary' as const, label: 'Pending' },
      inactive: { variant: 'outline' as const, label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCEStatusBadge = (status: string) => {
    const statusConfig = {
      current: { variant: 'default' as const, label: 'Current', icon: CheckCircle },
      expiring: { variant: 'secondary' as const, label: 'Expiring Soon', icon: Clock },
      expired: { variant: 'destructive' as const, label: 'Expired', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.expired;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IMO/FMO Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your agent network and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Agents
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAgents}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-green-600">+{analytics.newRecruits}</span>
              <span className="text-xs text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.pendingOnboarding} pending onboarding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Production</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalProduction?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${analytics.avgProduction?.toLocaleString()}/agent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.complianceAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.ceCreditsDue} CE credits due
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              upcoming this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
          <TabsTrigger value="agents">Agent CRM</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Producers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Producers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.slice(0, 5).map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${agent.production_ytd.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">YTD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <UserPlus className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">New Agent Onboarded</p>
                      <p className="text-sm text-muted-foreground">Mike Wilson - Florida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Carrier Appointment</p>
                      <p className="text-sm text-muted-foreground">Company D approved for 3 agents</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Training Completed</p>
                      <p className="text-sm text-muted-foreground">15 agents completed product training</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruiting Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Recruiting Pipeline</h3>
                <p className="text-muted-foreground">
                  Track prospects, applications, and onboarding progress.
                </p>
                <Button className="mt-4">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Prospect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          {/* Agent CRM Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search agents by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Directory */}
          <div className="grid gap-4">
            {filteredAgents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{agent.name}</h3>
                          {getStatusBadge(agent.status)}
                          {getCEStatusBadge(agent.ce_status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {agent.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {agent.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {agent.state}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium">YTD Production</p>
                            <p className="text-lg font-bold text-green-600">
                              ${agent.production_ytd.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Licenses</p>
                            <div className="flex gap-1 mt-1">
                              {agent.licenses.map((license, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {license}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Appointments</p>
                            <p className="text-sm text-muted-foreground">
                              {agent.appointments.length} carriers
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="carriers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Carrier Products</h3>
                <p className="text-muted-foreground">
                  Access rate sheets, product brochures, and marketing materials.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Product Training Modules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Sales Techniques Webinar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Compliance Updates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CE Credits Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Credits Due Soon</p>
                      <p className="text-sm text-muted-foreground">45 agents</p>
                    </div>
                    <Badge variant="secondary">Action Needed</Badge>
                  </div>
                  <Button className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Send CE Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">189</div>
                  <p className="text-sm text-muted-foreground">Compliant Agents</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <p className="text-sm text-muted-foreground">Alerts Pending</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Events & Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Event Management</h3>
                <p className="text-muted-foreground">
                  Plan training events, road shows, and co-op marketing campaigns.
                </p>
                <Button className="mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}