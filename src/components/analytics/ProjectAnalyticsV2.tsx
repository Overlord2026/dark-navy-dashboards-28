import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  DollarSign,
  Target,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
// Using mock data for demo - will be connected to real analytics hooks
const mockProjectAnalytics = [];
const mockTeamAnalytics = [];
const mockResourceAnalytics = [];
import { format, subDays, subMonths } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export function ProjectAnalyticsV2() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = subDays(end, 30);
    return { from: start, to: end };
  });

  // Mock data for demo - replace with real analytics hooks once database is populated
  const projectAnalytics = mockProjectAnalytics;
  const teamAnalytics = mockTeamAnalytics;
  const resourceAnalytics = mockResourceAnalytics;
  const projectLoading = false;
  const teamLoading = false;
  const resourceLoading = false;
  const projectError = null;
  const teamError = null;
  const resourceError = null;

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const end = new Date();
    let start: Date;
    
    switch (period) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      case '6m':
        start = subMonths(end, 6);
        break;
      case '1y':
        start = subMonths(end, 12);
        break;
      default:
        start = subDays(end, 30);
    }
    
    setDateRange({ from: start, to: end });
  };

  // Calculate summary metrics
  const totalProjects = projectAnalytics.length;
  const avgCompletion = projectAnalytics.length > 0 
    ? projectAnalytics.reduce((sum, p) => sum + p.completion_percentage, 0) / projectAnalytics.length 
    : 0;
  const projectsOnTime = projectAnalytics.filter(p => (p.schedule_variance || 0) >= 0).length;
  const totalBudgetVariance = projectAnalytics.reduce((sum, p) => sum + (p.budget_variance || 0), 0);

  const currentResourceUtilization = resourceAnalytics[0];
  const teamUtilizationRate = currentResourceUtilization?.utilization_rate || 0;
  const capacityUtilization = currentResourceUtilization?.capacity_utilization || 0;

  // Project completion chart data
  const projectChartData = projectAnalytics.slice(0, 10).map((project, index) => ({
    project: `Project ${index + 1}`,
    completion: project.completion_percentage,
    tasks_completed: project.tasks_completed,
    tasks_total: project.tasks_total,
  }));

  const getBarColor = (completion: number) => {
    if (completion >= 90) return 'hsl(var(--success))';
    if (completion >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive project and team performance insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange 
            date={dateRange} 
            onDateChange={(date) => {
              if (date?.from && date?.to) {
                setDateRange({ from: date.from, to: date.to });
              }
            }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Badge variant="secondary">{projectsOnTime} on time</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion.toFixed(1)}%</div>
            <Progress value={avgCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamUtilizationRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              {capacityUtilization.toFixed(1)}% capacity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBudgetVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalBudgetVariance >= 0 ? '+' : ''}${totalBudgetVariance.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {totalBudgetVariance >= 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              {totalBudgetVariance >= 0 ? 'Over budget' : 'Under budget'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Productivity</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Completion Progress</CardTitle>
                <CardDescription>
                  Track completion rates across all active projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : projectError ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {projectError}
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="project" 
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                          formatter={(value: number, name: string) => {
                            if (name === 'completion') {
                              return [`${value.toFixed(1)}%`, 'Completion Rate'];
                            }
                            return [value, name];
                          }}
                        />
                        <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                          {projectChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.completion)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline Performance</CardTitle>
                <CardDescription>
                  Project schedule variance and on-time delivery rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectAnalytics.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Project {project.project_id.slice(0, 8)}</span>
                        <span className="text-xs text-muted-foreground">
                          {project.days_remaining !== null 
                            ? `${project.days_remaining} days remaining`
                            : 'No due date'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={project.schedule_variance >= 0 ? "default" : "destructive"}
                        >
                          {project.schedule_variance >= 0 ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {project.schedule_variance >= 0 ? 'On Track' : 'Behind'}
                        </Badge>
                        <span className="text-sm font-medium">
                          {project.completion_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Productivity Overview</CardTitle>
              <CardDescription>
                Individual and team performance metrics across the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : teamError ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {teamError}
                </div>
              ) : teamAnalytics.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No team productivity data available for the selected period
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teamAnalytics.slice(0, 6).map((member) => (
                    <Card key={member.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">User {member.user_id.slice(0, 8)}</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Completion Rate</span>
                              <span className="font-medium">{member.tasks_completion_rate.toFixed(1)}%</span>
                            </div>
                            <Progress value={member.tasks_completion_rate} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>Tasks: {member.tasks_completed}/{member.tasks_assigned}</div>
                            <div>Hours: {member.hours_logged}h</div>
                            <div>Projects: {member.active_projects}</div>
                            <div>Messages: {member.messages_sent}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization Analysis</CardTitle>
              <CardDescription>
                Team capacity, workload distribution, and budget utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resourceLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : resourceError ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {resourceError}
                </div>
              ) : resourceAnalytics.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No resource utilization data available for the selected period
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Team Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Members</span>
                        <span className="font-medium">{currentResourceUtilization?.total_team_members || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Members</span>
                        <span className="font-medium">{currentResourceUtilization?.active_team_members || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Utilization Rate</span>
                        <span className="font-medium">{teamUtilizationRate.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Project Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Projects</span>
                        <span className="font-medium">{currentResourceUtilization?.active_projects || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed Projects</span>
                        <span className="font-medium">{currentResourceUtilization?.completed_projects || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Overdue Projects</span>
                        <span className="font-medium text-red-600">{currentResourceUtilization?.overdue_projects || 0}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Budget Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Allocated</span>
                        <span className="font-medium">${(currentResourceUtilization?.total_budget_allocated || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Spent</span>
                        <span className="font-medium">${(currentResourceUtilization?.total_budget_spent || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Utilization</span>
                        <span className="font-medium">{(currentResourceUtilization?.budget_utilization || 0).toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}