import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Trophy, 
  GraduationCap, 
  TrendingUp, 
  Download,
  Calendar,
  School,
  Share2,
  Award
} from 'lucide-react';

interface AnalyticsData {
  userRegistrations: {
    athlete: number;
    parent: number;
    coach: number;
    advisor: number;
  };
  courseCompletion: {
    module: string;
    completionRate: number;
    totalUsers: number;
  }[];
  schoolSignups: {
    school: string;
    athletes: number;
    coaches: number;
  }[];
  referralSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
}

const NILAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock data - in production this would come from your analytics API
  const analyticsData: AnalyticsData = {
    userRegistrations: {
      athlete: 1247,
      parent: 456,
      coach: 89,
      advisor: 23
    },
    courseCompletion: [
      { module: 'NIL Basics', completionRate: 78, totalUsers: 1200 },
      { module: 'Financial Planning', completionRate: 65, totalUsers: 950 },
      { module: 'Contract Guidance', completionRate: 42, totalUsers: 800 },
      { module: 'Brand Building', completionRate: 71, totalUsers: 1100 },
      { module: 'Risk Management', completionRate: 55, totalUsers: 750 },
      { module: 'Real Stories', completionRate: 88, totalUsers: 1300 }
    ],
    schoolSignups: [
      { school: 'University of Texas', athletes: 45, coaches: 3 },
      { school: 'Stanford University', athletes: 38, coaches: 2 },
      { school: 'Ohio State University', athletes: 52, coaches: 4 },
      { school: 'UCLA', athletes: 41, coaches: 3 },
      { school: 'Duke University', athletes: 29, coaches: 2 }
    ],
    referralSources: [
      { source: 'Social Media', count: 567, percentage: 35 },
      { source: 'Coach Referral', count: 324, percentage: 20 },
      { source: 'Teammate Referral', count: 486, percentage: 30 },
      { source: 'School Website', count: 162, percentage: 10 },
      { source: 'Direct', count: 81, percentage: 5 }
    ]
  };

  const totalUsers = Object.values(analyticsData.userRegistrations).reduce((sum, count) => sum + count, 0);

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  const exportReport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting NIL analytics report as ${format.toUpperCase()}`);
    // Implementation for export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NIL Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track engagement, completion rates, and user growth across the NIL education platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Range:</span>
        <div className="flex gap-1">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Athletes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.userRegistrations.athlete.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              69% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools Registered</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.schoolSignups.length}</div>
            <p className="text-xs text-muted-foreground">
              Top 5 shown below
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analyticsData.courseCompletion.reduce((sum, course) => sum + course.completionRate, 0) / analyticsData.courseCompletion.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all modules
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="registrations">User Registrations</TabsTrigger>
          <TabsTrigger value="completion">Course Completion</TabsTrigger>
          <TabsTrigger value="schools">School Analytics</TabsTrigger>
          <TabsTrigger value="referrals">Referral Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Registrations by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analyticsData.userRegistrations).map(([role, count]) => ({
                        name: role.charAt(0).toUpperCase() + role.slice(1),
                        value: count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(analyticsData.userRegistrations).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analyticsData.userRegistrations).map(([role, count], index) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="font-medium capitalize">{role}s</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((count / totalUsers) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Completion Rates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Percentage of users who completed each module
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.courseCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.courseCompletion.map((course, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{course.module}</h3>
                    <Badge variant="outline">{course.completionRate}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {course.totalUsers} total enrollments
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Schools by Registration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Schools with the highest athlete and coach participation
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.schoolSignups.map((school, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{school.school}</h3>
                        <p className="text-sm text-muted-foreground">
                          {school.athletes + school.coaches} total registrations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{school.athletes}</div>
                          <div className="text-xs text-muted-foreground">Athletes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{school.coaches}</div>
                          <div className="text-xs text-muted-foreground">Coaches</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <p className="text-sm text-muted-foreground">
                  How users are discovering the platform
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.referralSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.referralSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.referralSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{source.count}</div>
                      <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referral Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.referralSources.find(s => s.source === 'Teammate Referral')?.count || 0}
                  </div>
                  <div className="text-sm text-blue-700">Teammate Referrals</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.referralSources.find(s => s.source === 'Coach Referral')?.count || 0}
                  </div>
                  <div className="text-sm text-green-700">Coach Referrals</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((analyticsData.referralSources.find(s => s.source === 'Teammate Referral')?.percentage || 0) + 
                    (analyticsData.referralSources.find(s => s.source === 'Coach Referral')?.percentage || 0))}%
                  </div>
                  <div className="text-sm text-purple-700">Referral Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NILAnalyticsDashboard;