import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { KpiTile } from '@/components/admin/KpiTile';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';

// Mock data for demo purposes
const revenueData = [
  { month: 'Jan', revenue: 45000, clients: 23, ar: 5200 },
  { month: 'Feb', revenue: 48000, clients: 25, ar: 4800 },
  { month: 'Mar', revenue: 52000, clients: 28, ar: 6100 },
  { month: 'Apr', revenue: 49000, clients: 26, ar: 5500 },
  { month: 'May', revenue: 54000, clients: 30, ar: 4200 },
  { month: 'Jun', revenue: 58000, clients: 32, ar: 3800 },
];

const onboardingProgress = [
  { step: 'Profile Setup', completed: 89, total: 95, percentage: 94 },
  { step: 'Document Upload', completed: 72, total: 95, percentage: 76 },
  { step: 'Review & Approval', completed: 68, total: 95, percentage: 72 },
  { step: 'First Meeting', completed: 65, total: 95, percentage: 68 },
  { step: 'Engagement Signed', completed: 62, total: 95, percentage: 65 },
];

const clientNpsData = [
  { category: 'Promoters', value: 67, color: 'hsl(var(--primary))' },
  { category: 'Passives', value: 23, color: 'hsl(var(--muted))' },
  { category: 'Detractors', value: 10, color: 'hsl(var(--destructive))' },
];

const partnerRevenueData = [
  { partner: 'John Smith, CPA', clients: 45, revenue: 180000, nps: 8.2 },
  { partner: 'Sarah Johnson, CPA', clients: 38, revenue: 152000, nps: 8.7 },
  { partner: 'Mike Davis, CPA', clients: 32, revenue: 128000, nps: 7.9 },
  { partner: 'Lisa Wilson, CPA', clients: 28, revenue: 112000, nps: 8.4 },
  { partner: 'David Brown, CPA', clients: 25, revenue: 98000, nps: 8.1 },
];

export function PracticeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalClients: 0,
    avgNps: 0,
    onboardingRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPracticeMetrics();
  }, []);

  const fetchPracticeMetrics = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) {
        // Use demo data for now
        setMetrics({
          totalRevenue: 306000,
          totalClients: 164,
          avgNps: 8.3,
          onboardingRate: 74
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('practice_metrics')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Process metrics data
      const processedMetrics = {
        totalRevenue: 306000, // Calculate from data
        totalClients: 164,    // Calculate from data
        avgNps: 8.3,         // Calculate from data
        onboardingRate: 74   // Calculate from data
      };

      setMetrics(processedMetrics);
    } catch (error) {
      console.error('Error fetching practice metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load practice analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="Practice Analytics"
        text="Comprehensive insights into onboarding progress, AR/AP, client satisfaction, and partner performance"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="financial">AR/AP</TabsTrigger>
          <TabsTrigger value="satisfaction">Client NPS</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiTile
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
            />
            <KpiTile
              title="Active Clients"
              value={metrics.totalClients.toString()}
              icon={Users}
            />
            <KpiTile
              title="Average NPS"
              value={metrics.avgNps.toString()}
              icon={Star}
            />
            <KpiTile
              title="Onboarding Rate"
              value={`${metrics.onboardingRate}%`}
              icon={Target}
            />
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Client Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveChart height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Clients"
                  />
                </LineChart>
              </ResponsiveChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Client Onboarding Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingProgress.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{step.step}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {step.completed}/{step.total}
                        </span>
                        <Badge variant={step.percentage >= 80 ? "default" : step.percentage >= 60 ? "secondary" : "destructive"}>
                          {step.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={step.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Completed This Month</span>
                    </div>
                    <span className="font-bold text-lg">42</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <span className="font-bold text-lg">23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Stalled/Overdue</span>
                    </div>
                    <span className="font-bold text-lg">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Onboarding Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">14.2</div>
                    <div className="text-sm text-muted-foreground">Days Average</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: 12 days</span>
                      <span className="text-red-600">+2.2 days over target</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Improvement needed in document collection phase
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Accounts Receivable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="ar" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveChart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AR Aging Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span>Current (0-30 days)</span>
                    <div className="text-right">
                      <div className="font-medium">$12,450</div>
                      <div className="text-sm text-green-600">68%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span>31-60 days</span>
                    <div className="text-right">
                      <div className="font-medium">$4,200</div>
                      <div className="text-sm text-yellow-600">23%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span>61-90 days</span>
                    <div className="text-right">
                      <div className="font-medium">$1,100</div>
                      <div className="text-sm text-orange-600">6%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span>90+ days</span>
                    <div className="text-right">
                      <div className="font-medium">$550</div>
                      <div className="text-sm text-red-600">3%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieIcon className="h-5 w-5" />
                  Client NPS Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart height={250}>
                  <PieChart>
                    <Pie
                      data={clientNpsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {clientNpsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveChart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NPS Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">8.3</div>
                    <div className="text-sm text-muted-foreground">Overall NPS Score</div>
                    <Badge className="mt-2">Excellent</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Service Quality</span>
                      <span className="text-sm">8.7/10</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm">8.1/10</span>
                    </div>
                    <Progress value={81} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Timeliness</span>
                      <span className="text-sm">8.0/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Value for Money</span>
                      <span className="text-sm">8.4/10</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Partner</th>
                      <th className="text-left p-3 font-medium">Clients</th>
                      <th className="text-left p-3 font-medium">Revenue</th>
                      <th className="text-left p-3 font-medium">NPS Score</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerRevenueData.map((partner, index) => (
                      <tr key={index} className="border-b border-border/40">
                        <td className="p-3 font-medium">{partner.partner}</td>
                        <td className="p-3">{partner.clients}</td>
                        <td className="p-3">${partner.revenue.toLocaleString()}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {partner.nps}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={partner.nps >= 8.5 ? "default" : partner.nps >= 8.0 ? "secondary" : "destructive"}>
                            {partner.nps >= 8.5 ? "Excellent" : partner.nps >= 8.0 ? "Good" : "Needs Improvement"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}