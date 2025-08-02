import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Phone, Mail, Award } from 'lucide-react';

export function CRMAnalytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30d');
  const [analytics, setAnalytics] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalDeals: 0,
    dealValue: 0,
    conversionRate: 0,
    activityCounts: [],
    pipelineMetrics: [],
    contactsByStatus: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeframe]);

  const fetchAnalytics = async () => {
    try {
      const cutoffDate = new Date();
      if (timeframe === '7d') cutoffDate.setDate(cutoffDate.getDate() - 7);
      else if (timeframe === '30d') cutoffDate.setDate(cutoffDate.getDate() - 30);
      else if (timeframe === '90d') cutoffDate.setDate(cutoffDate.getDate() - 90);

      // Fetch contacts data
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch pipeline data
      const { data: deals } = await supabase
        .from('crm_pipeline_items')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch activities data
      const { data: activities } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', cutoffDate.toISOString());

      // Process data
      const totalContacts = contacts?.length || 0;
      const newContacts = contacts?.filter(c => 
        new Date(c.created_at) >= cutoffDate
      ).length || 0;
      
      const totalDeals = deals?.length || 0;
      const dealValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
      
      const closedWon = deals?.filter(d => d.stage_id === 'closed_won').length || 0;
      const conversionRate = totalDeals > 0 ? (closedWon / totalDeals) * 100 : 0;

      // Activity counts
      const activityCounts = activities?.reduce((acc, activity) => {
        const existing = acc.find(a => a.type === activity.activity_type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: activity.activity_type, count: 1 });
        }
        return acc;
      }, [] as any[]) || [];

      // Contacts by status
      const contactsByStatus = ['lead', 'prospect', 'client', 'inactive'].map(status => ({
        status,
        count: contacts?.filter(c => c.status === status).length || 0
      }));

      // Pipeline metrics
      const pipelineStages = ['lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
      const pipelineMetrics = pipelineStages.map(stage => ({
        stage,
        count: deals?.filter(d => d.stage_id === stage).length || 0,
        value: deals?.filter(d => d.stage_id === stage).reduce((sum, deal) => sum + (deal.value || 0), 0) || 0
      }));

      setAnalytics({
        totalContacts,
        newContacts,
        totalDeals,
        dealValue,
        conversionRate,
        activityCounts,
        pipelineMetrics,
        contactsByStatus,
        monthlyTrends: [] // Would need more complex date grouping
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Analytics</h2>
          <p className="text-muted-foreground">Performance insights and metrics</p>
        </div>
        
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalContacts}</p>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-xs text-green-600">+{analytics.newContacts} new</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalDeals}</p>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-xs text-blue-600">{analytics.conversionRate.toFixed(1)}% conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">${analytics.dealValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.activityCounts.reduce((sum, a) => sum + a.count, 0)}</p>
                <p className="text-sm text-muted-foreground">Activities</p>
                <p className="text-xs text-muted-foreground">This period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stages */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.pipelineMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.contactsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.contactsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.activityCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Deal Size:</span>
              <span className="font-medium">
                ${analytics.totalDeals > 0 ? (analytics.dealValue / analytics.totalDeals).toFixed(0) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Activities per Contact:</span>
              <span className="font-medium">
                {analytics.totalContacts > 0 
                  ? (analytics.activityCounts.reduce((sum, a) => sum + a.count, 0) / analytics.totalContacts).toFixed(1)
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversion Rate:</span>
              <span className="font-medium text-green-600">{analytics.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Growth Rate:</span>
              <span className="font-medium text-blue-600">
                {analytics.totalContacts > 0 ? ((analytics.newContacts / analytics.totalContacts) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}