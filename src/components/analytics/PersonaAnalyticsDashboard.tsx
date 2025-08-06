import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, TrendingUp, Target, Share2, Play, BookOpen, 
  Calendar, Award, Filter, Download 
} from 'lucide-react';
import { ClientPersona } from '@/types/personas';
import { motion } from 'framer-motion';

interface AnalyticsData {
  onboarding: {
    started: number;
    completed: number;
    byPersona: Record<ClientPersona, { started: number; completed: number }>;
    byChannel: Record<string, { started: number; completed: number }>;
  };
  engagement: {
    demoViews: Record<ClientPersona, number>;
    viralShares: Record<ClientPersona, { clicked: number; shared: number }>;
    trainingAccessed: Record<ClientPersona, number>;
    faqViews: Record<ClientPersona, number>;
  };
  conversion: {
    signupsByChannel: Record<string, Record<ClientPersona, number>>;
    upgradesByPersona: Record<ClientPersona, number>;
    timeToUpgrade: Record<ClientPersona, number>; // days
  };
}

const PERSONA_COLORS = {
  hnw_client: '#3B82F6',
  pre_retiree: '#10B981', 
  next_gen: '#8B5CF6',
  family_office_admin: '#F59E0B'
};

export const PersonaAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPersona, setSelectedPersona] = useState<ClientPersona | 'all'>('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedPersona]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real implementation, this would come from your analytics service
      const mockData: AnalyticsData = {
        onboarding: {
          started: 342,
          completed: 289,
          byPersona: {
            hnw_client: { started: 89, completed: 76 },
            pre_retiree: { started: 45, completed: 38 },
            next_gen: { started: 32, completed: 28 },
            family_office_admin: { started: 28, completed: 24 },
            client: { started: 156, completed: 142 }
          },
          byChannel: {
            linkedin: { started: 156, completed: 142 },
            email: { started: 89, completed: 78 },
            sms: { started: 45, completed: 38 },
            direct: { started: 52, completed: 31 }
          }
        },
        engagement: {
          demoViews: {
            hnw_client: 234, pre_retiree: 123, next_gen: 89, family_office_admin: 76, client: 298
          },
          viralShares: {
            hnw_client: { clicked: 89, shared: 67 }, pre_retiree: { clicked: 45, shared: 32 },
            next_gen: { clicked: 34, shared: 28 }, family_office_admin: { clicked: 28, shared: 23 }, client: { clicked: 156, shared: 123 }
          },
          trainingAccessed: {
            hnw_client: 156, pre_retiree: 89, next_gen: 67, family_office_admin: 54, client: 234
          },
          faqViews: {
            hnw_client: 267, pre_retiree: 134, next_gen: 98, family_office_admin: 76, client: 345
          }
        },
        conversion: {
          signupsByChannel: {
            linkedin: {
              hnw_client: 45, pre_retiree: 23, next_gen: 18, family_office_admin: 15, client: 67
            },
            email: {
              hnw_client: 28, pre_retiree: 15, next_gen: 12, family_office_admin: 9, client: 34
            },
            sms: {
              hnw_client: 16, pre_retiree: 9, next_gen: 7, family_office_admin: 5, client: 23
            },
            direct: {
              hnw_client: 12, pre_retiree: 6, next_gen: 5, family_office_admin: 4, client: 18
            }
          },
          upgradesByPersona: {
            hnw_client: 34, pre_retiree: 18, next_gen: 14, family_office_admin: 11, client: 45
          },
          timeToUpgrade: {
            hnw_client: 5.2, pre_retiree: 7.1, next_gen: 6.8, family_office_admin: 8.3, client: 4.8
          }
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingChartData = () => {
    if (!analyticsData) return [];
    
    return Object.entries(analyticsData.onboarding.byPersona).map(([persona, data]) => ({
      persona: persona.replace('_', ' '),
      started: data.started,
      completed: data.completed,
      rate: Math.round((data.completed / data.started) * 100)
    }));
  };

  const getChannelPerformanceData = () => {
    if (!analyticsData) return [];
    
    return Object.entries(analyticsData.onboarding.byChannel).map(([channel, data]) => ({
      channel,
      started: data.started,
      completed: data.completed,
      rate: Math.round((data.completed / data.started) * 100)
    }));
  };

  const getViralShareData = () => {
    if (!analyticsData) return [];
    
    return Object.entries(analyticsData.engagement.viralShares).map(([persona, data]) => ({
      persona: persona.replace('_', ' '),
      clicked: data.clicked,
      shared: data.shared,
      rate: data.clicked > 0 ? Math.round((data.shared / data.clicked) * 100) : 0
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Funnel performance and engagement metrics by persona
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Signups</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {analyticsData?.onboarding.completed || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {analyticsData ? Math.round((analyticsData.onboarding.completed / analyticsData.onboarding.started) * 100) : 0}% completion rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Viral Shares</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {analyticsData ? Object.values(analyticsData.engagement.viralShares).reduce((sum, data) => sum + data.shared, 0) : 0}
            </div>
            <div className="text-sm text-muted-foreground">
              From {analyticsData ? Object.values(analyticsData.engagement.viralShares).reduce((sum, data) => sum + data.clicked, 0) : 0} clicks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Upgrades</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {analyticsData ? Object.values(analyticsData.conversion.upgradesByPersona).reduce((sum, count) => sum + count, 0) : 0}
            </div>
            <div className="text-sm text-muted-foreground">
              6.8 days avg time to upgrade
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Demo Views</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {analyticsData ? Object.values(analyticsData.engagement.demoViews).reduce((sum, count) => sum + count, 0) : 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Across all personas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="onboarding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="onboarding">Onboarding Funnel</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="viral">Viral Sharing</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Completion by Persona</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getOnboardingChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="persona" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="started" fill="#8884d8" name="Started" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Invite Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChannelPerformanceData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="started" fill="#8884d8" name="Invites Sent" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Signups" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viral">
          <Card>
            <CardHeader>
              <CardTitle>Viral Share Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getViralShareData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="persona" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicked" fill="#8884d8" name="Share Clicks" />
                  <Bar dataKey="shared" fill="#82ca9d" name="Actual Shares" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demo Views by Persona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData && Object.entries(analyticsData.engagement.demoViews)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([persona, views]) => (
                      <div key={persona} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{persona.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(views / 250) * 100} className="w-20" />
                          <span className="text-sm font-medium w-8">{views}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Access by Persona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData && Object.entries(analyticsData.engagement.trainingAccessed)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([persona, accessed]) => (
                      <div key={persona} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{persona.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(accessed / 150) * 100} className="w-20" />
                          <span className="text-sm font-medium w-8">{accessed}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};