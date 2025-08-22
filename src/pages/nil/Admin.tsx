import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, CheckCircle, Clock, FileText, Shield, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Lazy load heavy admin panels to avoid bundling on other pages
const AdminReceiptsPanel = lazy(() => import('@/components/admin/AdminReceiptsPanel'));
const AdminAnchorsPanel = lazy(() => import('@/components/admin/AdminAnchorsPanel'));
const AdminAuditsPanel = lazy(() => import('@/components/admin/AdminAuditsPanel'));
const AdminFixturesPanel = lazy(() => import('@/components/admin/AdminFixturesPanel'));

import { getReceiptsCount } from '@/features/receipts/record';

export default function AdminPage() {
  const navigate = useNavigate();
  const [currentVersion, setCurrentVersion] = React.useState('E-2025.08');
  const [versions] = React.useState([
    { version: 'E-2025.08', status: 'active', deployedAt: '2025-08-01' },
    { version: 'E-2025.07', status: 'deprecated', deployedAt: '2025-07-01' },
    { version: 'E-2025.06', status: 'retired', deployedAt: '2025-06-01' }
  ]);

  // Role guard - in production, check user role from auth
  const isAdmin = true; // TODO: Replace with actual role check
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">Access denied. Admin role required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dev fixtures guard
  const isDev = import.meta.env.MODE !== 'production';
  const showFixtures = isDev && (window as any).__DEV_FIXTURES__ === true;

  const handlePromotePolicy = (version: string) => {
    setCurrentVersion(version);
    toast.success('Policy version promoted', {
      description: `All new operations will use ${version}`
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">NIL Admin</h1>
          <p className="text-muted-foreground">Manage policy versions and system configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/nil/admin/ready-check')}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Ready Check & Seeder
          </Button>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Shield className="w-4 h-4 mr-1" />
            Admin Access
          </Badge>
        </div>
      </div>

      <Suspense fallback={<div className="p-4 text-center text-muted-foreground">Loading admin tools...</div>}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full ${showFixtures ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="anchors">Anchors</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            {showFixtures && <TabsTrigger value="fixtures">Fixtures (dev)</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Policy Versions
                </CardTitle>
                <CardDescription>Manage NIL policy versions for compliance gates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {versions.map((policy) => (
                    <div key={policy.version} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{policy.version}</p>
                        <p className="text-sm text-muted-foreground">
                          Deployed: {new Date(policy.deployedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          policy.status === 'active' ? 'default' : 
                          policy.status === 'deprecated' ? 'secondary' : 'outline'
                        }>
                          {policy.status}
                        </Badge>
                        {policy.version === currentVersion && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {policy.status !== 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromotePolicy(policy.version)}
                          >
                            Promote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Active Policy Version</p>
                    <p className="text-muted-foreground">{currentVersion}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Receipts</p>
                    <p className="text-muted-foreground">{getReceiptsCount()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <AdminReceiptsPanel />
          </TabsContent>

          <TabsContent value="anchors">
            <AdminAnchorsPanel />
          </TabsContent>

          <TabsContent value="audits">
            <AdminAuditsPanel />
          </TabsContent>

          {showFixtures && (
            <TabsContent value="fixtures">
              <AdminFixturesPanel />
            </TabsContent>
          )}
        </Tabs>
      </Suspense>
    </div>
  );
}