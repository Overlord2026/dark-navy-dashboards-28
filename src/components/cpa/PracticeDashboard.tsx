import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Calendar,
  MessageSquare,
  PenTool,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PracticeMetrics {
  outstandingReturns: number;
  incompleteOrganizers: number;
  pendingEsigns: number;
  activeClients: number;
  totalRevenue: number;
  hoursLogged: number;
  clientCommunicationsSent: number;
  documentsProcessed: number;
}

interface StaffProductivity {
  name: string;
  hoursLogged: number;
  clientsHandled: number;
  tasksCompleted: number;
  utilization: number;
}

interface ClientActivity {
  date: string;
  newClients: number;
  documents: number;
  communications: number;
  revenue: number;
}

interface WorkflowStatus {
  type: string;
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

const mockMetrics: PracticeMetrics = {
  outstandingReturns: 23,
  incompleteOrganizers: 15,
  pendingEsigns: 8,
  activeClients: 142,
  totalRevenue: 45680,
  hoursLogged: 312,
  clientCommunicationsSent: 67,
  documentsProcessed: 89
};

const mockStaffProductivity: StaffProductivity[] = [
  { name: 'Sarah Johnson', hoursLogged: 38, clientsHandled: 25, tasksCompleted: 12, utilization: 95 },
  { name: 'Mike Chen', hoursLogged: 40, clientsHandled: 15, tasksCompleted: 18, utilization: 100 },
  { name: 'Lisa Rodriguez', hoursLogged: 42, clientsHandled: 20, tasksCompleted: 15, utilization: 105 },
  { name: 'David Kim', hoursLogged: 35, clientsHandled: 18, tasksCompleted: 10, utilization: 88 }
];

const mockClientActivity: ClientActivity[] = [
  { date: '2024-01-01', newClients: 3, documents: 12, communications: 8, revenue: 2400 },
  { date: '2024-01-02', newClients: 2, documents: 15, communications: 12, revenue: 3200 },
  { date: '2024-01-03', newClients: 5, documents: 18, communications: 10, revenue: 4100 },
  { date: '2024-01-04', newClients: 1, documents: 22, communications: 15, revenue: 3800 },
  { date: '2024-01-05', newClients: 4, documents: 20, communications: 18, revenue: 5200 },
  { date: '2024-01-06', newClients: 2, documents: 16, communications: 14, revenue: 2900 },
  { date: '2024-01-07', newClients: 3, documents: 25, communications: 20, revenue: 6100 }
];

const mockWorkflowStatus: WorkflowStatus[] = [
  { type: 'Tax Returns', total: 45, completed: 22, inProgress: 18, overdue: 5 },
  { type: 'Organizers', total: 35, completed: 20, inProgress: 12, overdue: 3 },
  { type: 'Document Requests', total: 28, completed: 15, inProgress: 10, overdue: 3 },
  { type: 'E-Signatures', total: 20, completed: 12, inProgress: 6, overdue: 2 },
  { type: 'Client Communications', total: 67, completed: 45, inProgress: 18, overdue: 4 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PracticeDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Dashboard refreshed",
        description: "All metrics have been updated with the latest data",
      });
    }, 1500);
  };

  const getStatusColor = (status: 'completed' | 'inProgress' | 'overdue') => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'inProgress': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Practice Dashboard
          </h3>
          <p className="text-muted-foreground">
            Real-time firm-wide status and performance metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1">
            {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Outstanding Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockMetrics.outstandingReturns}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((mockMetrics.outstandingReturns / 45) * 100)}% of total workload
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Incomplete Organizers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockMetrics.incompleteOrganizers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Waiting for client responses
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-600 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Pending E-Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockMetrics.pendingEsigns}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting client signatures
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Client Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockMetrics.activeClients}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Active this {timeRange}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="activity">Client Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue & Hours This {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">${mockMetrics.totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <Badge className="bg-green-500 text-white">+12%</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{mockMetrics.hoursLogged}</div>
                      <div className="text-sm text-muted-foreground">Hours Logged</div>
                    </div>
                    <Badge className="bg-blue-500 text-white">+8%</Badge>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      Average Rate: ${Math.round(mockMetrics.totalRevenue / mockMetrics.hoursLogged)}/hr
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communications & Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communications & Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{mockMetrics.clientCommunicationsSent}</div>
                      <div className="text-sm text-muted-foreground">Communications Sent</div>
                    </div>
                    <Badge className="bg-purple-500 text-white">+15%</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{mockMetrics.documentsProcessed}</div>
                      <div className="text-sm text-muted-foreground">Documents Processed</div>
                    </div>
                    <Badge className="bg-indigo-500 text-white">+22%</Badge>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      Response Rate: 89%
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Trend</CardTitle>
              <CardDescription>
                Client interactions and document processing over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockClientActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="documents" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Documents"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="communications" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Communications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="space-y-4">
            {mockWorkflowStatus.map((workflow) => (
              <Card key={workflow.type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workflow.type}</CardTitle>
                    <Badge variant="outline">
                      {workflow.total} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{workflow.completed}/{workflow.total} completed</span>
                    </div>
                    <Progress value={calculateProgress(workflow.completed, workflow.total)} className="h-2" />
                    
                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor('completed')}`}></div>
                        <span className="text-sm text-muted-foreground">
                          {workflow.completed} Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor('inProgress')}`}></div>
                        <span className="text-sm text-muted-foreground">
                          {workflow.inProgress} In Progress
                        </span>
                      </div>
                      {workflow.overdue > 0 && (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor('overdue')}`}></div>
                          <span className="text-sm text-red-600">
                            {workflow.overdue} Overdue
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Staff Performance Tab */}
        <TabsContent value="staff" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Utilization</CardTitle>
                <CardDescription>Hours logged vs. capacity this {timeRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockStaffProductivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
                <CardDescription>Productivity metrics by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockStaffProductivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasksCompleted" fill="#82ca9d" name="Tasks Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStaffProductivity.map((staff) => (
                  <div key={staff.name} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <h4 className="font-medium">{staff.name}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{staff.hoursLogged}h logged</span>
                        <span>{staff.clientsHandled} clients</span>
                        <span>{staff.tasksCompleted} tasks</span>
                      </div>
                    </div>
                    <Badge 
                      className={
                        staff.utilization >= 100 ? 'bg-green-500 text-white' :
                        staff.utilization >= 80 ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }
                    >
                      {staff.utilization}% util
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Activity Over Time</CardTitle>
              <CardDescription>
                New clients, document uploads, and revenue trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockClientActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="newClients" 
                    stroke="#8884d8" 
                    name="New Clients"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="documents" 
                    stroke="#82ca9d" 
                    name="Documents"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="communications" 
                    stroke="#ffc658" 
                    name="Communications"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New Clients This {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockClientActivity.reduce((sum, day) => sum + day.newClients, 0)}
                </div>
                <div className="text-xs text-muted-foreground">+25% vs last {timeRange}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Documents Uploaded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockClientActivity.reduce((sum, day) => sum + day.documents, 0)}
                </div>
                <div className="text-xs text-muted-foreground">+18% vs last {timeRange}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockClientActivity.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">+12% vs last {timeRange}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}