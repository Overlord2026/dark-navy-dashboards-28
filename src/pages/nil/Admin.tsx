import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [currentVersion, setCurrentVersion] = React.useState('E-2025.08');
  const [versions] = React.useState([
    { version: 'E-2025.08', status: 'active', deployedAt: '2025-08-01' },
    { version: 'E-2025.07', status: 'deprecated', deployedAt: '2025-07-01' },
    { version: 'E-2025.06', status: 'retired', deployedAt: '2025-06-01' }
  ]);

  const handlePromotePolicy = (version: string) => {
    setCurrentVersion(version);
    toast.success('Policy version promoted', {
      description: `All new operations will use ${version}`
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Admin</h1>
        <p className="text-muted-foreground">Manage policy versions and system configuration</p>
      </div>

      <div className="grid gap-6">
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
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}