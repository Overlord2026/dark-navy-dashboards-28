import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolGate } from '@/components/tools/ToolGate';
import { 
  Calculator, 
  Users, 
  FileText, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Upload,
  Mail,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  Bell,
  Globe,
  Building2,
  UserPlus,
  Settings,
  BarChart3,
  Archive,
  Video,
  MessageSquare
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const CPADashboard = () => {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            BFO Tax Experience™
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.displayName}! Manage your practice with next-gen tools.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Shield className="w-3 h-3 mr-1" />
            Fiduciary Tax Partner
          </Badge>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Returns Filed</p>
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-blue-600">2024 tax season</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-amber-600">Next 30 days</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CE Credits</p>
                <p className="text-2xl font-bold">32/40</p>
                <p className="text-xs text-green-600">On track for renewal</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Tax Vault</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tax return filed for Johnson Family</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Documents uploaded by Smith LLC</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Extension deadline reminder</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Q4 Estimated Payments</p>
                    <p className="text-sm text-muted-foreground">12 clients affected</p>
                  </div>
                  <Badge variant="outline">Jan 15</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">1099 Filing Deadline</p>
                    <p className="text-sm text-muted-foreground">8 businesses</p>
                  </div>
                  <Badge variant="outline">Jan 31</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Partnership Returns</p>
                    <p className="text-sm text-muted-foreground">5 returns due</p>
                  </div>
                  <Badge variant="outline">Mar 15</Badge>
                </div>
                
                <ToolGate toolKey="tax-calendar" fallbackRoute="/tools/tax-calendar">
                  <Button variant="outline" className="w-full" data-tool-card="tax-calendar">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Tax Calendar
                  </Button>
                </ToolGate>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Management</h3>
            <div className="flex space-x-2">
              <ToolGate toolKey="client-import" fallbackRoute="/tools/client-import">
                <Button variant="outline" data-tool-card="client-import">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Clients
                </Button>
              </ToolGate>
              <ToolGate toolKey="client-invite" fallbackRoute="/tools/client-invite">
                <Button data-tool-card="client-invite">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite New Client
                </Button>
              </ToolGate>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Clients (48)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Johnson Family', email: 'john@example.com', status: 'Documents Pending', priority: 'high' },
                  { name: 'Smith LLC', email: 'contact@smithllc.com', status: 'Ready for Review', priority: 'medium' },
                  { name: 'Williams Trust', email: 'sarah@williams.com', status: 'Filed', priority: 'low' },
                ].map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={client.priority === 'high' ? 'destructive' : client.priority === 'medium' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tax Document Vault</h3>
            <ToolGate toolKey="tax-vault" fallbackRoute="/tools/tax-vault">
              <Button data-tool-card="tax-vault">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </ToolGate>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload Center</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & drop tax documents</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for PDF, Excel, images, and mobile capture
                  </p>
                  <Button>Choose Files</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'W-2_Johnson_2023.pdf', client: 'Johnson Family', date: '2 hours ago' },
                  { name: '1099-INT_Smith_2023.pdf', client: 'Smith LLC', date: '1 day ago' },
                  { name: 'K-1_Williams_2023.pdf', client: 'Williams Trust', date: '2 days ago' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.client} • {doc.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  CE Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPA License Renewal</span>
                    <span className="text-sm font-medium">32/40 hours</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <p className="text-xs text-muted-foreground">8 hours remaining • Due Dec 31, 2024</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ethics Requirement</span>
                    <span className="text-sm font-medium">4/4 hours</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-green-600">✓ Complete</p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CE Certificate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">IRS Notice Alert</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">New guidance on cryptocurrency reporting</p>
                </div>
                
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Deadline Reminder</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Q4 estimated payments due in 5 days</p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Archive className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Document Expiring</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Power of attorney expires next month</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="text-center p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
            <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">BFO Professional Network</h3>
            <p className="text-muted-foreground mb-6">
              Connect your clients with trusted advisors, attorneys, and specialists in our vetted network.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Financial Advisors</h4>
                <p className="text-xs text-muted-foreground">Fiduciary-first wealth management</p>
              </Card>
              
              <Card className="p-4 text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Estate Attorneys</h4>
                <p className="text-xs text-muted-foreground">Trust & estate planning specialists</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Business Advisors</h4>
                <p className="text-xs text-muted-foreground">Corporate structure & planning</p>
              </Card>
            </div>
            
            <div className="flex justify-center space-x-3">
              <ToolGate toolKey="cpa-marketplace" fallbackRoute="/marketplace">
                <Button data-tool-card="cpa-marketplace">
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Marketplace
                </Button>
              </ToolGate>
              <ToolGate toolKey="client-referral" fallbackRoute="/tools/client-referral">
                <Button variant="outline" data-tool-card="client-referral">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Refer a Client
                </Button>
              </ToolGate>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};