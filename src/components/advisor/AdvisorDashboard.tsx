import React, { useState, useEffect } from 'react';
import { ToolGate } from '@/components/tools/ToolGate';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  Download, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Target,
  BarChart3,
  Calendar,
  Trophy,
  Sparkles,
  Upload,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { EnhancedCalculatorChart } from '@/components/calculators/EnhancedCalculatorChart';
import { Celebration } from '@/components/ConfettiAnimation';
import { PortfolioToolsModal } from './PortfolioToolsModal';
import { QuickActionsPanel } from './QuickActionsPanel';
import { AdvisorAlertsPanel } from './AdvisorAlertsPanel';
import { MyLeadsPanel } from './MyLeadsPanel';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PlanImportWizard } from './PlanImportWizard';
import { AdvisorOnboardingBanner } from './AdvisorOnboardingBanner';
import { SWAGDashboardMetrics } from './SWAGDashboardMetrics';
import { VoiceMicButton } from '@/components/voice/VoiceMicButton';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { AdvisorBenchmarkWidget } from './AdvisorBenchmarkWidget';
import { getFlag } from '@/lib/flags';
import { useAdvisorClients } from '@/hooks/useAdvisorClients';
import { ClientProfileCard } from './ClientProfileCard';
import { AccountAggregationPanel } from './AccountAggregationPanel';
import { WorkflowAutomationPanel } from './WorkflowAutomationPanel';
import { AdvisorGoalsDashboard } from './fintello/AdvisorGoalsDashboard';
import { PostsLibrary } from './fintello/PostsLibrary';
import { EnhancedLeadSearch } from './fintello/EnhancedLeadSearch';

// Removed - now using AdvisorClient from useAdvisorClients hook

export function AdvisorDashboard() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [showPortfolioTools, setShowPortfolioTools] = useState(false);
  const [showPlanImport, setShowPlanImport] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'accounts' | 'automation' | 'goals' | 'posts' | 'leads'>('overview');
  
  // Use the new comprehensive client management hook
  const { clients, metrics, loading } = useAdvisorClients();

  useEffect(() => {
    // Generate mock revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const projectionData = months.map((month, index) => ({
      month,
      revenue: 95000 + (index * 5000) + (Math.random() * 10000)
    }));
    setChartData(projectionData);
  }, []);

  const recentActivity = [
    { id: 1, client: 'John Smith', action: 'Tax optimization completed', time: '2 hours ago', status: 'completed', savings: '$15,000' },
    { id: 2, client: 'Sarah Johnson', action: 'Portfolio review scheduled', time: '1 day ago', status: 'scheduled', savings: null },
    { id: 3, client: 'Michael Brown', action: 'Estate plan updated', time: '2 days ago', status: 'completed', savings: '$8,500' },
    { id: 4, client: 'Emily Davis', action: 'Tax strategy meeting due', time: '3 days ago', status: 'pending', savings: '$22,000' }
  ];

  const upcomingTasks = [
    { client: 'John Smith', task: 'Quarterly Review Meeting', due: 'Tomorrow', priority: 'high' },
    { client: 'Emily Davis', task: 'Tax Document Collection', due: 'March 15', priority: 'high' },
    { client: 'Robert Wilson', task: 'Investment Rebalancing', due: 'March 20', priority: 'medium' },
    { client: 'Lisa Anderson', task: 'Insurance Review', due: 'March 25', priority: 'low' }
  ];

  const handleCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleAddClient = () => {
    navigate('/advisor/clients');
  };

  const handleExportReport = () => {
    // Create and download a sample report
    const reportData = {
      date: new Date().toISOString().split('T')[0],
      totalClients: metrics.totalClients,
      monthlyRevenue: metrics.monthlyRevenue,
      completionRate: metrics.completionRate,
      aiOpportunities: metrics.aiFlaggedOpportunities
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advisor-report-${reportData.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewTaxCenter = () => {
    navigate('/tax-center');
  };

  const handleScheduleMeeting = () => {
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleImportPlans = () => {
    setShowPlanImport(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Celebration trigger={showConfetti} />
      
      {/* Onboarding Banner */}
      {showOnboardingBanner && (
        <AdvisorOnboardingBanner 
          onDismiss={() => setShowOnboardingBanner(false)}
          onImportPlans={handleImportPlans}
        />
      )}
      
      {/* Hero Header */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary-foreground text-white">
          <div className="absolute inset-0 bg-black/10" />
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">Advisor Command Center</h1>
                    <p className="text-white/90 text-lg">
                      Complete practice management with real-time client insights
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{metrics.totalClients}</div>
                    <div className="text-white/80 text-sm">Total Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">${(metrics.totalAUM / 1000000).toFixed(1)}M</div>
                    <div className="text-white/80 text-sm">Total AUM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{metrics.upcomingMeetings}</div>
                    <div className="text-white/80 text-sm">This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-300">{metrics.upcomingRMDs}</div>
                    <div className="text-white/80 text-sm">RMDs Due</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{metrics.aiFlaggedOpportunities}</div>
                    <div className="text-white/80 text-sm">Opportunities</div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex flex-col gap-2">
                <VoiceMicButton onClick={() => setVoiceOpen(true)} />
                <div className="flex gap-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'overview' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'clients' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'clients' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('clients')}
                  >
                    Clients
                  </Button>
                  <Button 
                    variant={activeTab === 'accounts' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'accounts' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('accounts')}
                  >
                    Accounts
                  </Button>
                  <Button 
                    variant={activeTab === 'automation' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'automation' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('automation')}
                  >
                    Automation
                  </Button>
                  <Button 
                    variant={activeTab === 'goals' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'goals' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('goals')}
                  >
                    Goals
                  </Button>
                  <Button 
                    variant={activeTab === 'posts' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'posts' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
                  </Button>
                  <Button 
                    variant={activeTab === 'leads' ? 'secondary' : 'outline'}
                    size="sm"
                    className={activeTab === 'leads' ? '' : 'text-white border-white/30 hover:bg-white/10'}
                    onClick={() => setActiveTab('leads')}
                  >
                    Leads
                  </Button>
                </div>
                <Button 
                  variant="secondary"
                  className="gap-2"
                  onClick={handleAddClient}
                >
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SWAG Lead Score™ Metrics */}
      <motion.div variants={itemVariants}>
        <SWAGDashboardMetrics 
          metrics={{
            totalLeads: 24,
            goldSWAGLeads: 8,
            silverSWAGLeads: 12,
            bronzeSWAGLeads: 4,
            averageSWAGScore: 78,
            conversionByBand: {
              gold: 85,
              silver: 65,
              bronze: 35
            },
            verifiedSWAGLeads: 15
          }}
        />
      </motion.div>

      {/* Enhanced KPI Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                +3 new this month
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-500/10 to-transparent" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Required</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{metrics.clientsRequiringAction}</div>
              <p className="text-xs text-muted-foreground">
                Clients need attention
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-500/10 to-transparent" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-green-500/10 to-transparent" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Opportunities</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.aiFlaggedOpportunities}</div>
              <p className="text-xs text-muted-foreground">
                Potential optimizations
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/10 to-transparent" />
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Animated Revenue Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Projection
            </CardTitle>
            <CardDescription>
              Monthly recurring revenue and growth trajectory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedCalculatorChart
              data={chartData}
              type="area"
              xKey="month"
              yKey="revenue"
              title=""
              color="#10b981"
              animated={true}
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Client Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest client interactions and completed actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                    {activity.savings && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.savings} saved
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                Important deadlines and scheduled activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {task.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {task.task}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.due}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tax Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Strategies Implemented</span>
                  <span>47/52</span>
                </div>
                <Progress value={90.4} className="w-full" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleViewTaxCenter}>
                  View Tax Center
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/advisor/billing')}>
                  Billing & Invoicing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Portfolio Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Portfolios Optimized</span>
                  <span>38/42</span>
                </div>
                <Progress value={90.5} className="w-full" />
              </div>
              <div className="space-y-2">
                <ToolGate toolKey="portfolio-analytics" fallbackRoute="/tools/portfolio-tools">
                  <Button variant="outline" className="w-full">
                    Portfolio Tools
                  </Button>
                </ToolGate>
                <ToolGate toolKey="compliance-tracker" fallbackRoute="/tools/compliance-tracker">
                  <Button variant="outline" className="w-full">
                    Compliance Tracker
                  </Button>
                </ToolGate>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Client Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meetings This Month</span>
                  <span>28/30</span>
                </div>
                <Progress value={93.3} className="w-full" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleScheduleMeeting}>
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/advisor/regulatory-reporting')}>
                  Regulatory Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Enhanced with ADV_V1 Feature */}
      {getFlag('ADV_V1') && (
        <motion.div variants={itemVariants}>
          <AdvisorBenchmarkWidget />
        </motion.div>
      )}

      {/* Real-time Alerts Panel */}
      <motion.div variants={itemVariants}>
        <AdvisorAlertsPanel />
      </motion.div>

      {/* My Leads Dashboard */}
      <motion.div variants={itemVariants}>
        <MyLeadsPanel />
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'goals' && (
        <motion.div variants={itemVariants}>
          <AdvisorGoalsDashboard />
        </motion.div>
      )}
      
      {activeTab === 'posts' && (
        <motion.div variants={itemVariants}>
          <PostsLibrary />
        </motion.div>
      )}
      
      {activeTab === 'leads' && (
        <motion.div variants={itemVariants}>
          <EnhancedLeadSearch />
        </motion.div>
      )}

      {activeTab === 'clients' && (
        <motion.div variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <ClientProfileCard 
                key={client.id} 
                client={client}
              />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'accounts' && (
        <motion.div variants={itemVariants}>
          <AccountAggregationPanel />
        </motion.div>
      )}

      {activeTab === 'automation' && (
        <motion.div variants={itemVariants}>
          <WorkflowAutomationPanel />
        </motion.div>
      )}

      {/* Quick Actions Panel */}
      <motion.div variants={itemVariants}>
        <QuickActionsPanel />
      </motion.div>

      {/* Portfolio Tools Modal */}
      <PortfolioToolsModal 
        isOpen={showPortfolioTools} 
        onClose={() => setShowPortfolioTools(false)} 
      />

      {/* Plan Import Wizard */}
      <PlanImportWizard 
        open={showPlanImport} 
        onOpenChange={setShowPlanImport} 
      />
      
      {/* Voice Drawer */}
      <VoiceDrawer 
        open={voiceOpen} 
        onClose={() => setVoiceOpen(false)} 
        persona="advisor" 
        endpoint="meeting-summary" 
      />
    </motion.div>
  );
}