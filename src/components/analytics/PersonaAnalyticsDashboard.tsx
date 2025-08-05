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
import { PersonaType } from '@/types/personas';
import { motion } from 'framer-motion';

interface AnalyticsData {
  onboarding: {
    started: number;
    completed: number;
    byPersona: Record<PersonaType, { started: number; completed: number }>;
    byChannel: Record<string, { started: number; completed: number }>;
  };
  engagement: {
    demoViews: Record<PersonaType, number>;
    viralShares: Record<PersonaType, { clicked: number; shared: number }>;
    trainingAccessed: Record<PersonaType, number>;
    faqViews: Record<PersonaType, number>;
  };
  conversion: {
    signupsByChannel: Record<string, Record<PersonaType, number>>;
    upgradesByPersona: Record<PersonaType, number>;
    timeToUpgrade: Record<PersonaType, number>; // days
  };
}

const PERSONA_COLORS = {
  advisor: '#3B82F6',
  accountant: '#10B981', 
  attorney: '#8B5CF6',
  coach: '#F59E0B',
  consultant: '#6366F1',
  compliance: '#EF4444',
  insurance_agent: '#06B6D4',
  imo_fmo: '#14B8A6',
  healthcare_consultant: '#10B981',
  organization: '#F59E0B',
  agency: '#EC4899',
  client: '#3B82F6',
  vip_reserved: '#F59E0B'
};

export const PersonaAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | 'all'>('all');

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
            advisor: { started: 89, completed: 76 },
            accountant: { started: 45, completed: 38 },
            attorney: { started: 32, completed: 28 },
            coach: { started: 28, completed: 24 },
            consultant: { started: 25, completed: 21 },
            compliance: { started: 18, completed: 15 },
            insurance_agent: { started: 22, completed: 19 },
            imo_fmo: { started: 15, completed: 12 },
            healthcare_consultant: { started: 20, completed: 17 },
            organization: { started: 12, completed: 10 },
            agency: { started: 14, completed: 12 },
            client: { started: 16, completed: 13 },
            vip_reserved: { started: 6, completed: 6 }
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
            advisor: 234, accountant: 123, attorney: 89, coach: 76, consultant: 65,
            compliance: 54, insurance_agent: 67, imo_fmo: 43, healthcare_consultant: 58,
            organization: 32, agency: 41, client: 45, vip_reserved: 18
          },
          viralShares: {
            advisor: { clicked: 89, shared: 67 }, accountant: { clicked: 45, shared: 32 },
            attorney: { clicked: 34, shared: 28 }, coach: { clicked: 28, shared: 23 },
            consultant: { clicked: 24, shared: 19 }, compliance: { clicked: 18, shared: 14 },
            insurance_agent: { clicked: 22, shared: 17 }, imo_fmo: { clicked: 15, shared: 11 },
            healthcare_consultant: { clicked: 20, shared: 16 }, organization: { clicked: 12, shared: 10 },
            agency: { clicked: 14, shared: 11 }, client: { clicked: 16, shared: 12 },
            vip_reserved: { clicked: 8, shared: 6 }
          },
          trainingAccessed: {
            advisor: 156, accountant: 89, attorney: 67, coach: 54, consultant: 48,
            compliance: 32, insurance_agent: 41, imo_fmo: 28, healthcare_consultant: 35,
            organization: 22, agency: 27, client: 31, vip_reserved: 12
          },
          faqViews: {
            advisor: 267, accountant: 134, attorney: 98, coach: 76, consultant: 65,
            compliance: 43, insurance_agent: 58, imo_fmo: 34, healthcare_consultant: 47,
            organization: 28, agency: 35, client: 42, vip_reserved: 16
          }
        },
        conversion: {
          signupsByChannel: {
            linkedin: {
              advisor: 45, accountant: 23, attorney: 18, coach: 15, consultant: 12,
              compliance: 8, insurance_agent: 11, imo_fmo: 7, healthcare_consultant: 9,
              organization: 5, agency: 6, client: 7, vip_reserved: 3
            },
            email: {
              advisor: 28, accountant: 15, attorney: 12, coach: 9, consultant: 8,
              compliance: 5, insurance_agent: 7, imo_fmo: 4, healthcare_consultant: 6,
              organization: 3, agency: 4, client: 5, vip_reserved: 2
            },
            sms: {
              advisor: 16, accountant: 9, attorney: 7, coach: 5, consultant: 4,
              compliance: 3, insurance_agent: 4, imo_fmo: 2, healthcare_consultant: 3,
              organization: 2, agency: 2, client: 3, vip_reserved: 1
            },
            direct: {
              advisor: 12, accountant: 6, attorney: 5, coach: 4, consultant: 3,
              compliance: 2, insurance_agent: 3, imo_fmo: 2, healthcare_consultant: 2,
              organization: 1, agency: 2, client: 2, vip_reserved: 1
            }
          },
          upgradesByPersona: {
            advisor: 34, accountant: 18, attorney: 14, coach: 11, consultant: 9,
            compliance: 6, insurance_agent: 8, imo_fmo: 5, healthcare_consultant: 7,
            organization: 4, agency: 5, client: 6, vip_reserved: 3
          },
          timeToUpgrade: {
            advisor: 5.2, accountant: 7.1, attorney: 6.8, coach: 8.3, consultant: 9.1,
            compliance: 4.2, insurance_agent: 6.5, imo_fmo: 7.8, healthcare_consultant: 8.9,
            organization: 3.1, agency: 5.7, client: 12.4, vip_reserved: 2.1
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