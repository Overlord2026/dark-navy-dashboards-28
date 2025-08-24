import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const RealtorHomePage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClosePack = async () => {
    setIsExporting(true);
    try {
      // Simulate close pack export with manifest
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const manifest = {
        pack_type: "close_pack",
        client: "Johnson Family",
        property: "123 Oak Street",
        close_date: "2024-01-15",
        documents: [
          { name: "Purchase Agreement", type: "contract", required: true },
          { name: "Property Disclosure", type: "disclosure", required: true },
          { name: "Inspection Report", type: "inspection", required: true },
          { name: "Title Report", type: "title", required: true },
          { name: "Loan Documents", type: "financing", required: true }
        ],
        compliance_checks: {
          disclosures_complete: true,
          signatures_verified: true,
          funds_verified: true
        },
        generated_at: new Date().toISOString()
      };
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(manifest, null, 2)], 
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'close_pack_manifest.json';
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Close pack exported with manifest');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const stats = [
    { 
      title: 'Active Listings', 
      value: '12', 
      icon: Home, 
      change: '+2 this week',
      trend: 'up' 
    },
    { 
      title: 'Pending Sales', 
      value: '8', 
      icon: DollarSign, 
      change: '3 closing this week',
      trend: 'up' 
    },
    { 
      title: 'Total Volume YTD', 
      value: '$2.4M', 
      icon: TrendingUp, 
      change: '+15% vs last year',
      trend: 'up' 
    },
    { 
      title: 'Client Satisfaction', 
      value: '4.9', 
      icon: Users, 
      change: '98% positive reviews',
      trend: 'up' 
    }
  ];

  const complianceAlerts = [
    {
      type: 'warning',
      message: 'Property disclosure pending for 456 Pine St',
      action: 'Complete disclosure checklist',
      priority: 'high'
    },
    {
      type: 'info',
      message: 'Open house follow-up campaign ready',
      action: 'Review neighborhood report',
      priority: 'medium'
    }
  ];

  const recentActivity = [
    {
      type: 'disclosure',
      message: 'Property disclosure completed for 123 Oak St',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'offer',
      message: 'Offer submitted for 789 Maple Ave',
      time: '4 hours ago', 
      status: 'pending'
    },
    {
      type: 'campaign',
      message: 'Neighborhood report sent to 15 prospects',
      time: '1 day ago',
      status: 'sent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Realtor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage listings, disclosures, and close packs with compliance tracking
          </p>
        </div>
        <Button 
          onClick={handleExportClosePack}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Close Pack'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Alerts
            </CardTitle>
            <CardDescription>
              Disclosure requirements and regulatory updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.priority === 'high' ? 'bg-destructive' :
                  alert.priority === 'medium' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.action}</p>
                </div>
                <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                  {alert.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest property actions and compliance updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                   activity.type === 'disclosure' ? <FileText className="h-4 w-4" /> :
                   activity.type === 'offer' ? <Home className="h-4 w-4" /> :
                   <Calendar className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant={
                  activity.status === 'completed' ? 'default' :
                  activity.status === 'pending' ? 'secondary' : 'outline'
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Disclosure Checklist Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Disclosure Compliance</CardTitle>
            <CardDescription>
              Track property disclosure requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lead-Based Paint</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Natural Hazards</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Property Condition</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common realtor workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Create Property Disclosure
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Generate Offer Package
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Open House
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <TrendingUp className="h-4 w-4" />
              Send Neighborhood Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtorHomePage;