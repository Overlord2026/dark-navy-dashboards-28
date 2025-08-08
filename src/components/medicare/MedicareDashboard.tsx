import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  PhoneCall, 
  Users, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Crown,
  Settings,
  BarChart3,
  Lock
} from 'lucide-react';

export const MedicareDashboard = () => {
  const [activeTab, setActiveTab] = useState('compliance');

  const ComplianceCenter = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <PhoneCall className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Start Recorded Call</h3>
                <p className="text-sm text-muted-foreground">Begin compliant call session</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Start Call
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Compliance Checklist</h3>
                <p className="text-sm text-muted-foreground">Daily requirements</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Checklist
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Call History</h3>
                <p className="text-sm text-muted-foreground">Review & filter calls</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Call History Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Call History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { client: 'Mary Johnson', date: '2024-01-15', duration: '23:45', status: 'pass', type: 'Medicare Advantage' },
              { client: 'Robert Smith', date: '2024-01-15', duration: '18:30', status: 'pass', type: 'Medicare Supplement' },
              { client: 'Linda Davis', date: '2024-01-14', duration: '31:20', status: 'pending', type: 'Medicare Advantage' }
            ].map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${call.status === 'pass' ? 'bg-green-500' : call.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">{call.client}</p>
                    <p className="text-sm text-muted-foreground">{call.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{call.date}</p>
                  <p className="text-sm text-muted-foreground">{call.duration}</p>
                </div>
                <Badge variant={call.status === 'pass' ? 'default' : call.status === 'pending' ? 'secondary' : 'destructive'}>
                  {call.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecureVault = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Medicare Compliance Folder</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Call Recordings', count: 45, icon: <PhoneCall className="h-5 w-5" /> },
              { name: 'SOA Forms', count: 23, icon: <FileText className="h-5 w-5" /> },
              { name: 'Client Documents', count: 67, icon: <Users className="h-5 w-5" /> }
            ].map((folder, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-blue-600">
                    {folder.icon}
                  </div>
                  <h3 className="font-semibold">{folder.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">{folder.count}</p>
                  <p className="text-sm text-muted-foreground">files</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ClientCRM = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Clients', value: '127', icon: <Users className="h-5 w-5" /> },
          { label: 'New This Month', value: '8', icon: <TrendingUp className="h-5 w-5" /> },
          { label: 'Renewals Due', value: '15', icon: <Clock className="h-5 w-5" /> },
          { label: 'Compliance Rate', value: '98%', icon: <CheckCircle2 className="h-5 w-5" /> }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                {stat.icon}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Client Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Mary Johnson', action: 'Updated Medicare Advantage plan', time: '2 hours ago' },
              { name: 'Robert Smith', action: 'Scheduled renewal meeting', time: '5 hours ago' },
              { name: 'Linda Davis', action: 'Uploaded new SOA form', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MarketingEngine = () => (
    <div className="space-y-6">
      {/* Premium Upsell */}
      <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardContent className="p-6 text-center">
          <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
          <p className="text-muted-foreground mb-4">
            Unlock the Lead-to-Sales Marketing Engine with multi-channel campaigns, 
            automated drip sequences, and ROI tracking.
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            Upgrade Now
          </Button>
        </CardContent>
      </Card>

      {/* Locked Features Preview */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: 'Email Campaigns', description: 'Automated email sequences' },
          { name: 'SMS Marketing', description: 'Text message campaigns' },
          { name: 'LinkedIn Outreach', description: 'Professional networking' },
          { name: 'ROI Analytics', description: 'Campaign performance tracking' }
        ].map((feature, index) => (
          <Card key={index} className="relative opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const TeamManagement = () => (
    <div className="space-y-6">
      <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Team Management (Premium)</h3>
          <p className="text-muted-foreground mb-4">
            Add agents, assign leads, track performance, and collaborate on compliance requirements.
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            Upgrade to Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Medicare Compliance Hub</h1>
            <p className="text-muted-foreground">Manage your Medicare business with confidence</p>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Compliant
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="compliance">Compliance Center</TabsTrigger>
            <TabsTrigger value="vault">Secure Vault</TabsTrigger>
            <TabsTrigger value="crm">Client CRM</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Engine</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance">
            <ComplianceCenter />
          </TabsContent>

          <TabsContent value="vault">
            <SecureVault />
          </TabsContent>

          <TabsContent value="crm">
            <ClientCRM />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingEngine />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};