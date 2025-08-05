import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Cell,
  FunnelChart,
  Funnel
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Shield, 
  Zap, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  Share2,
  Trophy,
  Target,
  Clock,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { Celebration } from '@/components/ConfettiAnimation';

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  value: number;
  avgTimeInStage: number;
}

interface SWAGAnalytics {
  totalLeads: number;
  avgSWAGScore: number;
  conversionRate: number;
  avgTimeToClose: number;
  funnelData: FunnelData[];
  sourceBreakdown: any[];
  personaBreakdown: any[];
  swagTrends: any[];
  closedWins: number;
}

export function SWAGFunnelDashboard() {
  const [analyticsData, setAnalyticsData] = useState<SWAGAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSWAGAnalytics();
  }, [dateRange]);

  const loadSWAGAnalytics = async () => {
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

      const analyticsResults = calculateSWAGAnalytics(leads || []);
      setAnalyticsData(analyticsResults);

      // Track analytics view
      analytics.track('swag_funnel_dashboard_viewed', {
        dateRange,
        totalLeads: analyticsResults.totalLeads
      });

    } catch (error: any) {
      console.error('Error loading SWAG analytics:', error);
      toast({
        title: "Error Loading SWAG Analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSWAGAnalytics = (leads: any[]): SWAGAnalytics => {
    const totalLeads = leads.length;
    const swagScores = leads.filter(l => l.swag_score).map(l => l.swag_score);
    const avgSWAGScore = swagScores.length > 0 ? swagScores.reduce((a, b) => a + b, 0) / swagScores.length : 0;
    const closedLeads = leads.filter(l => l.lead_status === 'closed');
    const closedWins = closedLeads.length;
    const conversionRate = totalLeads > 0 ? (closedWins / totalLeads) * 100 : 0;

    // Calculate average time to close (mock data for now)
    const avgTimeToClose = 14; // days

    // Funnel stages
    const stages = ['New', 'Engaged', 'Qualified', 'Scheduled', 'Closed'];
    const funnelData: FunnelData[] = stages.map((stage, index) => {
      const stageLeads = leads.filter(l => {
        switch (stage) {
          case 'New': return l.lead_status === 'new';
          case 'Engaged': return l.lead_status === 'contacted';
          case 'Qualified': return l.lead_status === 'qualified';
          case 'Scheduled': return l.lead_status === 'scheduled';
          case 'Closed': return l.lead_status === 'closed';
          default: return false;
        }
      });
      
      return {
        stage,
        count: stageLeads.length,
        percentage: totalLeads > 0 ? (stageLeads.length / totalLeads) * 100 : 0,
        value: stageLeads.reduce((sum, lead) => sum + (lead.lead_value || 0), 0),
        avgTimeInStage: Math.random() * 7 + 1 // Mock data
      };
    });

    // Source breakdown
    const sources = leads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const sourceBreakdown = Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: ((count as number) / totalLeads) * 100
    }));

    // Persona breakdown
    const personas = leads.reduce((acc, lead) => {
      const persona = lead.persona || 'Unknown';
      acc[persona] = (acc[persona] || 0) + 1;
      return acc;
    }, {});

    const personaBreakdown = Object.entries(personas).map(([persona, count]) => ({
      persona,
      count,
      percentage: ((count as number) / totalLeads) * 100
    }));

    // SWAG trends (mock data for time series)
    const swagTrends = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      avgScore: Math.random() * 20 + 70,
      newLeads: Math.floor(Math.random() * 10) + 1,
      conversions: Math.floor(Math.random() * 3)
    }));

    return {
      totalLeads,
      avgSWAGScore,
      conversionRate,
      avgTimeToClose,
      funnelData,
      sourceBreakdown,
      personaBreakdown,
      swagTrends,
      closedWins
    };
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!analyticsData) return;
    
    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Downloading SWAG funnel data as ${format.toUpperCase()}...`,
    });

    analytics.track('swag_funnel_exported', {
      format,
      totalLeads: analyticsData.totalLeads
    });
  };

  const handleShare = () => {
    // Mock share functionality
    const shareText = `Check out our SWAG Lead Score™ funnel performance: ${analyticsData?.totalLeads} leads, ${analyticsData?.avgSWAGScore.toFixed(1)} avg score, ${analyticsData?.conversionRate.toFixed(1)}% conversion rate!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SWAG Funnel Dashboard',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Share Text Copied",
        description: "SWAG funnel summary copied to clipboard!",
      });
    }

    analytics.track('swag_funnel_shared', {
      method: navigator.share ? 'native' : 'clipboard'
    });
  };

  const triggerWinCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const COLORS = ['hsl(var(--gold))', 'hsl(var(--emerald))', 'hsl(var(--deep-blue))', '#8dd1e1', '#ffc658'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-deep-blue">Loading SWAG Analytics...</div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
            SWAG Funnel Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your Strategic Wealth Alpha GPS™ pipeline performance
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gold" />
                <span className="text-sm text-muted-foreground">Total Leads</span>
              </div>
              <div className="text-3xl font-bold text-deep-blue">{analyticsData.totalLeads}</div>
              <div className="text-xs text-muted-foreground mt-1">Got SWAG? prospects</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald/10 to-transparent border-emerald/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-emerald" />
                <span className="text-sm text-muted-foreground">Avg SWAG Score™</span>
              </div>
              <div className="text-3xl font-bold text-deep-blue">{analyticsData.avgSWAGScore.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">Strategic Wealth Alpha GPS™</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-deep-blue/10 to-transparent border-deep-blue/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-deep-blue" />
                <span className="text-sm text-muted-foreground">Conversion %</span>
              </div>
              <div className="text-3xl font-bold text-deep-blue">{analyticsData.conversionRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Lead to close rate</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-navy/10 to-transparent border-navy/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-navy" />
                <span className="text-sm text-muted-foreground">Avg Time to Close</span>
              </div>
              <div className="text-3xl font-bold text-deep-blue">{analyticsData.avgTimeToClose}d</div>
              <div className="text-xs text-muted-foreground mt-1">Days from lead to close</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Funnel Visualization */}
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold font-playfair">
            <BarChart3 className="h-5 w-5" />
            SWAG Lead Funnel
          </CardTitle>
          <CardDescription>
            Lead progression through the SWAG pipeline with confetti for wins!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {analyticsData.funnelData.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`relative p-4 rounded-lg border-2 ${
                  stage.stage === 'Closed' 
                    ? 'bg-gradient-to-br from-emerald/20 to-emerald/10 border-emerald' 
                    : 'bg-gradient-to-br from-gold/10 to-transparent border-gold/30'
                }`}>
                  <div className="text-2xl font-bold text-deep-blue">{stage.count}</div>
                  <div className="text-sm font-medium">{stage.stage}</div>
                  <div className="text-xs text-muted-foreground">{stage.percentage.toFixed(1)}%</div>
                  {stage.stage === 'Closed' && stage.count > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={triggerWinCelebration}
                      className="mt-2 text-xs"
                    >
                      🎉 Celebrate Wins!
                    </Button>
                  )}
                </div>
                {index < analyticsData.funnelData.length - 1 && (
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gold"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Tabs */}
      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Source Attribution</TabsTrigger>
          <TabsTrigger value="personas">Persona Breakdown</TabsTrigger>
          <TabsTrigger value="trends">SWAG Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>Where your SWAG leads come from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.sourceBreakdown}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="hsl(var(--gold))"
                    label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                  >
                    {analyticsData.sourceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas">
          <Card>
            <CardHeader>
              <CardTitle>Persona Heatmap</CardTitle>
              <CardDescription>Lead distribution by professional personas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.personaBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
                  <XAxis dataKey="persona" stroke="hsl(var(--gold))" />
                  <YAxis stroke="hsl(var(--gold))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--deep-blue))',
                      border: '1px solid hsl(var(--gold))',
                      borderRadius: '8px',
                      color: 'hsl(var(--gold))'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--emerald))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>SWAG Score Trends</CardTitle>
              <CardDescription>Time-series analysis of SWAG performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.swagTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
                  <XAxis dataKey="date" stroke="hsl(var(--gold))" />
                  <YAxis stroke="hsl(var(--gold))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--deep-blue))',
                      border: '1px solid hsl(var(--gold))',
                      borderRadius: '8px',
                      color: 'hsl(var(--gold))'
                    }}
                  />
                  <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--gold))" strokeWidth={3} />
                  <Line type="monotone" dataKey="newLeads" stroke="hsl(var(--emerald))" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="hsl(var(--deep-blue))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-gold">High SWAG Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep-blue">
                  {analyticsData.funnelData.reduce((sum, stage) => sum + stage.count, 0)}
                </div>
                <p className="text-muted-foreground">Total pipeline leads</p>
                <Badge className="mt-2 bg-gold text-deep-blue">Got SWAG?</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-emerald">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep-blue">
                  {analyticsData.conversionRate.toFixed(1)}%
                </div>
                <p className="text-muted-foreground">Conversion success</p>
                <Progress value={analyticsData.conversionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-deep-blue">Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep-blue">
                  ${analyticsData.funnelData.reduce((sum, stage) => sum + stage.value, 0).toLocaleString()}
                </div>
                <p className="text-muted-foreground">Total opportunity value</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confetti for wins */}
      {showConfetti && <Celebration trigger={showConfetti} />}
    </div>
  );
}