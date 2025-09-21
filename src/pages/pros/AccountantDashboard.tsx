import PersonaSideNav from '@/components/persona/PersonaSideNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileText, BookOpen, TrendingUp, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FLAGS } from '@/config/flags';
import AssistedBadge from '@/components/badges/AssistedBadge';
import { createProof } from '@/lib/proofs';
import { buildExplainPack, downloadExplainPack } from '@/lib/explainpack';
import { toast } from '@/hooks/use-toast';

export default function AccountantDashboard() {
  const handleLogCheckPassed = async () => {
    const mockJobId = `job-${Date.now()}`;
    const proof = await createProof(mockJobId, 'check_passed', 'CheckPack passed', { sandbox: 'content' });
    if (proof) {
      toast({
        title: "ProofSlip Logged",
        description: `Check passed proof logged for job ${mockJobId}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to log proof slip",
        variant: "destructive",
      });
    }
  };

  const handleExportExplainPack = async () => {
    const mockJobId = `job-${Date.now()}`;
    const explainPack = await buildExplainPack(mockJobId);
    if (explainPack) {
      downloadExplainPack(explainPack);
      toast({
        title: "ExplainPack Exported",
        description: `Policy version ${explainPack.policy_version} with ${explainPack.proof_slips.length} proof slips`,
      });
    } else {
      toast({
        title: "Error", 
        description: "Failed to build explain pack",
        variant: "destructive",
      });
    }
  };

  const metrics = {
    totalClients: 85,
    activeTaxReturns: 23,
    completedReturns: 147,
    monthlyRevenue: '$42,500',
    pendingReviews: 12,
    upcomingDeadlines: 8
  };

  const recentActivity = [
    { id: 1, client: 'Smith LLC', action: 'Tax return filed', time: '2 hours ago', status: 'completed' },
    { id: 2, client: 'Johnson Family', action: 'Quarterly review due', time: '1 day ago', status: 'pending' },
    { id: 3, client: 'Wilson Corp', action: 'Bookkeeping updated', time: '2 days ago', status: 'completed' },
    { id: 4, client: 'Davis Trust', action: 'Tax planning session', time: '3 days ago', status: 'scheduled' }
  ];

  const upcomingDeadlines = [
    { client: 'ABC Corp', task: 'Quarterly Tax Filing', due: 'March 15, 2024', priority: 'high' },
    { client: 'XYZ LLC', task: 'Annual Report', due: 'March 20, 2024', priority: 'medium' },
    { client: 'Smith Family', task: 'Personal Tax Return', due: 'April 15, 2024', priority: 'low' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <PersonaSideNav />
        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-bfo-gold">Accountant Dashboard</h1>
                {FLAGS.__ENABLE_AGENT_AUTOMATIONS__ && <AssistedBadge />}
              </div>
              <p className="text-white/80">Manage tax services, bookkeeping, and financial reporting</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleLogCheckPassed}
                variant="outline" 
                size="sm" 
                className="gap-2 border-bfo-gold/40 text-white hover:bg-bfo-gold/10"
              >
                <CheckCircle className="h-4 w-4" />
                Log Check Passed
              </Button>
              <Button 
                onClick={handleExportExplainPack}
                variant="outline" 
                size="sm" 
                className="gap-2 border-bfo-gold/40 text-white hover:bg-bfo-gold/10"
              >
                <FileText className="h-4 w-4" />
                Export ExplainPack
              </Button>
              <Button className="gap-2 bg-bfo-gold text-bfo-black hover:bg-bfo-gold/90">
                <FileText className="h-4 w-4" />
                New Tax Return
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-bfo-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.totalClients}</div>
                <p className="text-xs text-white/60">+5% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Tax Returns</CardTitle>
                <Calculator className="h-4 w-4 text-bfo-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.activeTaxReturns}</div>
                <p className="text-xs text-white/60">In progress this quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-bfo-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.monthlyRevenue}</div>
                <p className="text-xs text-white/60">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-bfo-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.pendingReviews}</div>
                <p className="text-xs text-white/60">Require attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Activity */}
            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader>
                <CardTitle className="text-bfo-gold">Recent Activity</CardTitle>
                <CardDescription className="text-white/70">Latest client activities and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' : 
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{activity.client}</p>
                      <p className="text-sm text-white/60">{activity.action}</p>
                    </div>
                    <div className="text-sm text-white/60">{activity.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader>
                <CardTitle className="text-bfo-gold">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-white/70">Important dates and filing deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{deadline.client}</p>
                      <p className="text-sm text-white/60">{deadline.task}</p>
                      <p className="text-xs text-white/60">Due: {deadline.due}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      deadline.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      deadline.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {deadline.priority}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Service Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-bfo-gold" />
                  Tax Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Tax Returns Filed</span>
                    <span>147/200</span>
                  </div>
                  <Progress value={73.5} className="w-full" />
                </div>
                <Button variant="outline" className="w-full border-bfo-gold/40 text-white hover:bg-bfo-gold/10">
                  Manage Tax Returns
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-bfo-gold" />
                  Bookkeeping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Books Updated</span>
                    <span>78/85</span>
                  </div>
                  <Progress value={91.8} className="w-full" />
                </div>
                <Button variant="outline" className="w-full border-bfo-gold/40 text-white hover:bg-bfo-gold/10">
                  View Ledgers
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-bfo-gold" />
                  Financial Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Reports Generated</span>
                    <span>65/70</span>
                  </div>
                  <Progress value={92.9} className="w-full" />
                </div>
                <Button variant="outline" className="w-full border-bfo-gold/40 text-white hover:bg-bfo-gold/10">
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}