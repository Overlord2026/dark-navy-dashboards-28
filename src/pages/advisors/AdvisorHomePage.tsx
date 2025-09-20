import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Map, 
  FileText, 
  TrendingUp,
  Users,
  Receipt,
  CheckCircle
} from 'lucide-react';
import { ToolGate } from '@/components/shared/ToolGate';
import { ReadyBanner } from '@/components/shared/ReadyBanner';
import { useAdvisor } from '@/context/AdvisorContext';
import { Link } from 'react-router-dom';

export function AdvisorHomePage() {
  const { advisorInfo } = useAdvisor();

  const quickActions = [
    {
      key: 'leads-add',
      title: 'Add Lead',
      description: 'Capture new prospect with PTC consent',
      icon: Plus,
      path: '/advisors/leads',
      variant: 'default' as const
    },
    {
      key: 'meetings-start',
      title: 'Start Meeting',
      description: 'Record client meeting with AI summary',
      icon: Calendar,
      path: '/advisors/meetings',
      variant: 'default' as const
    },
    {
      key: 'tools-roadmap',
      title: 'Roadmap',
      description: 'Generate retirement roadmap',
      icon: Map,
      path: '/advisors/tools',
      variant: 'default' as const
    },
    {
      key: 'tools-proposal',
      title: 'Proposal/Report',
      description: 'Create client proposal',
      icon: FileText,
      path: '/advisors/tools',
      variant: 'outline' as const
    },
    {
      key: 'campaigns-engagement',
      title: 'Engagement Tracker',
      description: 'Track campaign performance',
      icon: TrendingUp,
      path: '/advisors/campaigns',
      variant: 'outline' as const
    }
  ];

  const recentReceipts = [
    {
      id: '1',
      type: 'Consent-RDS',
      action: 'lead.consent.captured',
      timestamp: '2 hours ago',
      hasAnchor: true
    },
    {
      id: '2', 
      type: 'Decision-RDS',
      action: 'meeting.summary.generated',
      timestamp: '4 hours ago',
      hasAnchor: false
    },
    {
      id: '3',
      type: 'Comms-RDS',
      action: 'campaign.email.sent',
      timestamp: '1 day ago',
      hasAnchor: true
    },
    {
      id: '4',
      type: 'Vault-RDS',
      action: 'document.uploaded',
      timestamp: '2 days ago',
      hasAnchor: false
    },
    {
      id: '5',
      type: 'Decision-RDS',
      action: 'roadmap.generated',
      timestamp: '3 days ago',
      hasAnchor: true
    }
  ];

  return (
    <div className="space-y-6">
      <ReadyBanner persona="advisor" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {advisorInfo.name}</h1>
          <p className="text-muted-foreground mt-1">{advisorInfo.title} • {advisorInfo.location}</p>
        </div>
        <Badge variant="secondary">Professional</Badge>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <ToolGate key={action.key} toolKey={action.key}>
                <Button 
                  variant={action.variant}
                  size="lg"
                  className="h-auto p-4 flex flex-col items-center gap-2 w-full"
                  asChild
                >
                  <Link to={action.path}>
                    <action.icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              </ToolGate>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border p-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month Meetings</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campaign Opens</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proof Slips</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Receipts */}
      <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Recent Proof Slips
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/advisors/proof">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReceipts.map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{receipt.type}</p>
                    <p className="text-xs text-muted-foreground">{receipt.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {receipt.hasAnchor && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verify ✓
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{receipt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}