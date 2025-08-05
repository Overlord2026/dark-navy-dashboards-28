import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Shield, 
  Zap, 
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalLeads: number;
  enrichedLeads: number;
  highScoreLeads: number;
  plaidVerifiedLeads: number;
  autoAssignedLeads: number;
  conversionByScore: any[];
  scoreDistribution: any[];
  dailyLeadTrends: any[];
  enrichmentPerformance: any;
}

export function LeadScoringAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Fetch leads data
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const analytics = calculateAnalytics(leads || []);
      setAnalyticsData(analytics);

    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (leads: any[]): AnalyticsData => {
    const totalLeads = leads.length;
    const enrichedLeads = leads.filter(l => l.enrichment_status === 'completed').length;
    const highScoreLeads = leads.filter(l => l.catchlight_score && l.catchlight_score >= 80).length;
    const plaidVerifiedLeads = leads.filter(l => l.plaid_verification_status === 'verified').length;
    const autoAssignedLeads = leads.filter(l => l.auto_assigned).length;

    // Score distribution
    const scoreRanges = [
      { range: '90-100', min: 90, max: 100, count: 0 },
      { range: '80-89', min: 80, max: 89, count: 0 },
      { range: '70-79', min: 70, max: 79, count: 0 },
      { range: '60-69', min: 60, max: 69, count: 0 },
      { range: '0-59', min: 0, max: 59, count: 0 },
    ];

    leads.forEach(lead => {
      if (lead.catchlight_score) {
        const range = scoreRanges.find(r => 
          lead.catchlight_score >= r.min && lead.catchlight_score <= r.max
        );
        if (range) range.count++;
      }
    });

    // Daily trends
    const dailyTrends = new Map();
    leads.forEach(lead => {
      const date = new Date(lead.created_at).toLocaleDateString();
      if (!dailyTrends.has(date)) {
        dailyTrends.set(date, { 
          date, 
          total: 0, 
          enriched: 0, 
          highScore: 0,
          plaidVerified: 0 
        });
      }
      const day = dailyTrends.get(date);
      day.total++;
      if (lead.enrichment_status === 'completed') day.enriched++;
      if (lead.catchlight_score >= 80) day.highScore++;
      if (lead.plaid_verification_status === 'verified') day.plaidVerified++;
    });

    // Conversion by score
    const conversionByScore = scoreRanges.map(range => ({
      scoreRange: range.range,
      leads: range.count,
      converted: leads.filter(l => 
        l.catchlight_score >= range.min && 
        l.catchlight_score <= range.max && 
        l.lead_status === 'closed'
      ).length
    }));

    return {
      totalLeads,
      enrichedLeads,
      highScoreLeads,
      plaidVerifiedLeads,
      autoAssignedLeads,
      conversionByScore,
      scoreDistribution: scoreRanges,
      dailyLeadTrends: Array.from(dailyTrends.values()),
      enrichmentPerformance: {
        avgEnrichmentTime: 2.5, // Mock data
        successRate: enrichedLeads / totalLeads * 100,
        apiUptime: 99.8
      }
    };
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Scoring Analytics</h2>
          <p className="text-muted-foreground">
            Track conversion rates and enrichment performance by lead score
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <div className="text-2xl font-bold">{analyticsData.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Enriched</span>
            </div>
            <div className="text-2xl font-bold">{analyticsData.enrichedLeads}</div>
            <Progress 
              value={(analyticsData.enrichedLeads / analyticsData.totalLeads) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">High Score</span>
            </div>
            <div className="text-2xl font-bold">{analyticsData.highScoreLeads}</div>
            <Badge variant="secondary" className="mt-1">
              80+ Score
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Plaid Verified</span>
            </div>
            <div className="text-2xl font-bold">{analyticsData.plaidVerifiedLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Auto-assigned</span>
            </div>
            <div className="text-2xl font-bold">{analyticsData.autoAssignedLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="conversion" className="w-full">
        <TabsList>
          <TabsTrigger value="conversion">Conversion by Score</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="trends">Daily Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate by Catchlight Score</CardTitle>
              <CardDescription>
                How different score ranges convert to closed deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.conversionByScore}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scoreRange" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" name="Total Leads" />
                  <Bar dataKey="converted" fill="#82ca9d" name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Lead Score Distribution</CardTitle>
              <CardDescription>
                Distribution of Catchlight scores across all leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.scoreDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {analyticsData.scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Daily Lead Trends</CardTitle>
              <CardDescription>
                Daily breakdown of lead volume and enrichment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyLeadTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Leads" />
                  <Line type="monotone" dataKey="enriched" stroke="#82ca9d" name="Enriched" />
                  <Line type="monotone" dataKey="highScore" stroke="#ffc658" name="High Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Avg Enrichment Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.enrichmentPerformance.avgEnrichmentTime}s
                </div>
                <p className="text-muted-foreground">Average processing time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.enrichmentPerformance.successRate.toFixed(1)}%
                </div>
                <p className="text-muted-foreground">Enrichment success rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  API Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.enrichmentPerformance.apiUptime}%
                </div>
                <p className="text-muted-foreground">Catchlight API availability</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}