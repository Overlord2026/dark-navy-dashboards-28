import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { Users, FileText, Settings, CreditCard, Building, UserPlus, Network, Layers, Share2, Plug } from 'lucide-react';
import { TenantBrandingPanel } from './TenantBrandingPanel';
import { TenantUserManagement } from './TenantUserManagement';
import { TenantBillingPanel } from './TenantBillingPanel';
import { TenantProjectIntegration } from './TenantProjectIntegration';
import { TenantResourceManagement } from './TenantResourceManagement';
import { TenantAboutEditor } from './TenantAboutEditor';

export const TenantAdminDashboard: React.FC = () => {
  const { currentTenant, loading } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!currentTenant) {
    return <div className="text-center text-red-500">No tenant found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentTenant.name}</h1>
          <p className="text-muted-foreground">Tenant Administration Dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            currentTenant.billing_status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {currentTenant.billing_status.toUpperCase()}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {currentTenant.franchisee_status.toUpperCase()}
          </span>
          <Badge variant="outline" className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200">
            <Network className="h-3 w-3" />
            <span>Connected</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integration">
            <Network className="mr-2 h-4 w-4" />
            Integration
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Advisors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">350</div>
                <p className="text-xs text-muted-foreground">+25 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Active resources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tenant management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Advisor
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Client
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in your tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New advisor John Smith joined</span>
                    <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">5 new clients onboarded</span>
                    <span className="text-xs text-muted-foreground ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Branding updated</span>
                    <span className="text-xs text-muted-foreground ml-auto">3d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <TenantBrandingPanel />
        </TabsContent>

        <TabsContent value="users">
          <TenantUserManagement />
        </TabsContent>

        <TabsContent value="resources">
          <TenantResourceManagement />
        </TabsContent>

        <TabsContent value="about">
          <TenantAboutEditor />
        </TabsContent>

        <TabsContent value="billing">
          <TenantBillingPanel />
        </TabsContent>
        
        <TabsContent value="integration">
          <TenantProjectIntegration />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure general tenant settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tenant Status</h4>
                    <Badge className={
                      currentTenant.billing_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {currentTenant.billing_status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">License Type</h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      {currentTenant.franchisee_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Organization Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Name:</strong> {currentTenant.name}</p>
                    <p><strong>Domain:</strong> {currentTenant.domain || 'Not configured'}</p>
                    <p><strong>Created:</strong> {new Date(currentTenant.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage data retention and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">Export all tenant data</p>
                    </div>
                    <Button variant="outline">Export Data</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Audit Logs</h4>
                      <p className="text-sm text-muted-foreground">View tenant activity logs</p>
                    </div>
                    <Button variant="outline">View Logs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Reset Tenant</h4>
                      <p className="text-sm text-muted-foreground">Reset all tenant settings to defaults</p>
                    </div>
                    <Button variant="destructive" disabled>Reset</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Tenant</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete this tenant and all data</p>
                    </div>
                    <Button variant="destructive" disabled>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};