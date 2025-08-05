import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  Shield, 
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Star,
  Crown,
  Gift,
  UserCheck,
  BarChart3,
  Zap,
  Award,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BrokerDealerStats {
  totalAdvisors: number;
  activeClients: number;
  monthlyRevenue: number;
  complianceScore: number;
  seatUtilization: number;
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'warning' | 'violation';
  lastChecked: string;
}

interface AdvisorPerformance {
  id: string;
  name: string;
  clientCount: number;
  aum: number;
  compliance: 'good' | 'warning' | 'action_required';
  lastActivity: string;
}

export function BrokerDealerDashboard() {
  const { userProfile } = useUser();
  const [stats, setStats] = useState<BrokerDealerStats>({
    totalAdvisors: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    complianceScore: 0,
    seatUtilization: 0
  });
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [advisorPerformance, setAdvisorPerformance] = useState<AdvisorPerformance[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    companyName: '',
    primaryColor: '#1a365d',
    logoUrl: '',
    customDomain: '',
    whiteLabel: false
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simplified for demo - would integrate with actual broker-dealer tables
    setStats({
      totalAdvisors: 45,
      activeClients: 1250,
      monthlyRevenue: 125000,
      complianceScore: 92,
      seatUtilization: 78
    });

    setComplianceRules([
      { id: '1', name: 'FINRA Registration', description: 'All advisors must maintain current FINRA registration', status: 'compliant', lastChecked: '2024-01-20' },
      { id: '2', name: 'Continuing Education', description: 'Annual CE requirements completion tracking', status: 'warning', lastChecked: '2024-01-18' }
    ]);

    setAdvisorPerformance([
      { id: '1', name: 'John Smith', clientCount: 25, aum: 15000000, compliance: 'good', lastActivity: '2024-01-20' },
      { id: '2', name: 'Sarah Johnson', clientCount: 32, aum: 22000000, compliance: 'good', lastActivity: '2024-01-19' }
    ]);
  };

  const handleBulkSeatPurchase = async () => {
    // This would integrate with the seat purchase flow
    toast.success('Bulk seat purchase flow would open here');
  };

  const handleComplianceExport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-compliance-report', {
        body: { brokerDealerId: userProfile?.id, format: 'pdf' }
      });

      if (error) throw error;
      
      toast.success('Compliance report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export compliance report');
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Advisors</p>
                <p className="text-2xl font-bold">{stats.totalAdvisors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{stats.activeClients.toLocaleString()}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{stats.complianceScore}%</p>
              </div>
              <Shield className={`w-8 h-8 ${stats.complianceScore >= 90 ? 'text-green-500' : stats.complianceScore >= 70 ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleBulkSeatPurchase} className="gap-2 h-auto p-4 flex-col">
              <Gift className="w-6 h-6" />
              <span>Purchase Advisor Seats</span>
              <span className="text-xs text-muted-foreground">Bulk pricing available</span>
            </Button>

            <Button variant="outline" onClick={handleComplianceExport} className="gap-2 h-auto p-4 flex-col">
              <FileText className="w-6 h-6" />
              <span>Export Compliance</span>
              <span className="text-xs text-muted-foreground">Generate reports</span>
            </Button>

            <Button variant="outline" onClick={() => setShowCustomization(true)} className="gap-2 h-auto p-4 flex-col">
              <Settings className="w-6 h-6" />
              <span>Customize Platform</span>
              <span className="text-xs text-muted-foreground">White-label options</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceRules.slice(0, 5).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {rule.status === 'compliant' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : rule.status === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={rule.status === 'compliant' ? 'default' : rule.status === 'warning' ? 'secondary' : 'destructive'}
                >
                  {rule.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvisorManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advisor Management</h2>
        <Button className="gap-2">
          <Users className="w-4 h-4" />
          Add New Advisor
        </Button>
      </div>

      {/* Advisor Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Advisor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advisorPerformance.map((advisor) => (
              <div key={advisor.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold">
                    {advisor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{advisor.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{advisor.clientCount} clients</span>
                      <span>${advisor.aum.toLocaleString()} AUM</span>
                      <span>Last active: {advisor.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={advisor.compliance === 'good' ? 'default' : advisor.compliance === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {advisor.compliance}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="gap-2">
              <Gift className="w-4 h-4" />
              Purchase Seats
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Reports
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Update Settings
            </Button>
            <Button variant="outline" className="gap-2">
              <Award className="w-4 h-4" />
              Performance Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Management</h2>
        <Button onClick={handleComplianceExport} className="gap-2">
          <FileText className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Compliance Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Compliance Score</h3>
              <p className="text-3xl font-bold mt-2">{stats.complianceScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.complianceScore >= 90 ? 'Excellent' : stats.complianceScore >= 70 ? 'Good' : 'Needs Attention'}
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={stats.complianceScore >= 90 ? '#10b981' : stats.complianceScore >= 70 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${stats.complianceScore * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Compliance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Rules Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {rule.status === 'compliant' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : rule.status === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last checked: {rule.lastChecked}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={rule.status === 'compliant' ? 'default' : rule.status === 'warning' ? 'secondary' : 'destructive'}
                    >
                      {rule.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomizationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Customization</h2>
        <Badge variant="outline" className="gap-2">
          <Crown className="w-4 h-4" />
          Enterprise Feature
        </Badge>
      </div>

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={brandSettings.companyName}
                onChange={(e) => setBrandSettings({ ...brandSettings, companyName: e.target.value })}
                placeholder="Your Broker-Dealer Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input
                id="primary-color"
                type="color"
                value={brandSettings.primaryColor}
                onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                value={brandSettings.logoUrl}
                onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
                placeholder="https://your-domain.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-domain">Custom Domain</Label>
              <Input
                id="custom-domain"
                value={brandSettings.customDomain}
                onChange={(e) => setBrandSettings({ ...brandSettings, customDomain: e.target.value })}
                placeholder="portal.your-domain.com"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="white-label"
              checked={brandSettings.whiteLabel}
              onChange={(e) => setBrandSettings({ ...brandSettings, whiteLabel: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="white-label">
              Enable full white-label mode (removes all Family Office branding)
            </Label>
          </div>

          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Save Brand Settings
          </Button>
        </CardContent>
      </Card>

      {/* Custom Solutions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Advisor Onboarding</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Customize the onboarding flow for your advisors with your branding and compliance requirements.
              </p>
              <Button variant="outline" size="sm">
                Customize Flow
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Client Portal</h4>
              <p className="text-sm text-muted-foreground mb-4">
                White-label the client portal with your branding and custom features.
              </p>
              <Button variant="outline" size="sm">
                Configure Portal
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Compliance Tools</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Set up custom compliance rules and automated monitoring for your firm.
              </p>
              <Button variant="outline" size="sm">
                Setup Rules
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Reporting & Analytics</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Custom dashboards and reports tailored to your firm's needs.
              </p>
              <Button variant="outline" size="sm">
                Build Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Broker-Dealer Dashboard</h1>
              <p className="text-navy-600 mt-1">
                Manage your advisor network and family office solutions
              </p>
            </div>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Building2 className="w-4 h-4" />
              Enterprise Account
            </Badge>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="advisors" className="gap-2">
              <Users className="w-4 h-4" />
              Advisors
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="customization" className="gap-2">
              <Settings className="w-4 h-4" />
              Customization
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="overview">
              {renderOverviewTab()}
            </TabsContent>

            <TabsContent value="advisors">
              {renderAdvisorManagementTab()}
            </TabsContent>

            <TabsContent value="compliance">
              {renderComplianceTab()}
            </TabsContent>

            <TabsContent value="customization">
              {renderCustomizationTab()}
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}