import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProPersona } from '@/features/pro/types';
import { ProE2EDemo } from '@/components/demos/ProE2EDemo';
import { ProDashboardNav } from '@/components/pro/ProDashboardNav';
import { ProDevPanel } from '@/components/pro/ProDevPanel';
import { Users, FileText, MessageCircle, Shield, Activity } from 'lucide-react';
import { listReceipts } from '@/features/receipts/record';

const personaInfo: Record<Exclude<ProPersona, 'advisor'>, {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  specializations: string[];
}> = {
  cpa: {
    title: 'CPA Practice',
    description: 'Tax planning, preparation, and compliance services',
    icon: FileText,
    specializations: ['Tax Planning', 'Business Advisory', 'Compliance', 'Audit Support']
  },
  attorney: {
    title: 'Legal Practice',
    description: 'Estate planning and legal services with privilege protection',
    icon: Shield,
    specializations: ['Estate Planning', 'Trust Administration', 'Legal Consultation', 'Document Drafting']
  },
  insurance: {
    title: 'Insurance Practice',
    description: 'Life, annuity, and insurance needs analysis',
    icon: Users,
    specializations: ['Life Insurance', 'Annuities', 'Suitability Analysis', 'Needs Assessment']
  },
  healthcare: {
    title: 'Healthcare Practice',
    description: 'Wellness coaching and longevity optimization with HIPAA compliance',
    icon: Activity,
    specializations: ['Longevity Coaching', 'Wellness Planning', 'Health Optimization', 'Education']
  },
  realtor: {
    title: 'Real Estate Practice',
    description: 'Residential real estate sales and buyer representation',
    icon: Users,
    specializations: ['Buyer Representation', 'Market Analysis', 'Transaction Management', 'Investment Advisory']
  },
  medicare: {
    title: 'Medicare Practice',
    description: 'Medicare enrollment and benefits planning services',
    icon: Activity,
    specializations: ['Medicare Enrollment', 'Plan Comparison', 'Benefits Analysis', 'Annual Review']
  }
};

interface ProDashboardProps {
  persona: ProPersona;
}

export const ProDashboard: React.FC<ProDashboardProps> = ({ persona }) => {
  const info = personaInfo[persona];
  const Icon = info.icon;
  const receipts = listReceipts();
  const recentReceipts = receipts.slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Icon className="w-8 h-8" />
            {info.title}
          </h1>
          <p className="text-muted-foreground mt-1">{info.description}</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {persona.toUpperCase()}
        </Badge>
      </div>

      {/* Navigation */}
      <ProDashboardNav persona={persona} activeTab="overview" onTabChange={() => {}} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Meetings This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle>Try the Workflow</CardTitle>
            <CardDescription>
              Experience the complete {persona} process from lead capture to compliance tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {info.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            <ProE2EDemo persona={persona} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Compliance Activity</CardTitle>
            <CardDescription>
              Latest receipts and compliance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReceipts.length > 0 ? (
                recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium text-sm">{receipt.type || 'Receipt'}</div>
                      <div className="text-xs text-muted-foreground">
                        {receipt.timestamp || receipt.created_at || 'Recently'}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {receipt.result || 'Processed'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">Start the demo to see receipts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Panel */}
      <ProDevPanel />
    </div>
  );
};