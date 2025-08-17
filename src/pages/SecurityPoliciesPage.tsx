import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Lock,
  Unlock
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface TableRLSStatus {
  table_name: string;
  rls_enabled: boolean;
  rls_forced: boolean;
  policy_count: number;
}

interface TablePolicy {
  table_name: string;
  policy_name: string;
  command: string;
  policy_type: string;
}

export function SecurityPoliciesPage() {
  const [rlsStatus, setRlsStatus] = useState<TableRLSStatus[]>([]);
  const [policies, setPolicies] = useState<TablePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Load RLS status
      const { data: rlsData, error: rlsError } = await supabase.rpc('get_table_rls_status');
      if (rlsError) {
        console.error('Error loading RLS status:', rlsError);
        toast.error('Failed to load RLS status');
      } else {
        setRlsStatus(rlsData || []);
      }

      // Load policies
      const { data: policiesData, error: policiesError } = await supabase.rpc('get_table_policies');
      if (policiesError) {
        console.error('Error loading policies:', policiesError);
        toast.error('Failed to load policies');
      } else {
        setPolicies(policiesData || []);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const getTableStatus = (table: TableRLSStatus) => {
    if (!table.rls_enabled) {
      return { status: 'disabled', color: 'destructive' as const, icon: Unlock };
    }
    if (table.policy_count === 0) {
      return { status: 'no_policies', color: 'secondary' as const, icon: AlertTriangle };
    }
    return { status: 'protected', color: 'default' as const, icon: Lock };
  };

  const getTablePolicies = (tableName: string) => {
    return policies.filter(p => p.table_name === tableName);
  };

  const getStatusSummary = () => {
    const disabled = rlsStatus.filter(t => !t.rls_enabled).length;
    const noPolicies = rlsStatus.filter(t => t.rls_enabled && t.policy_count === 0).length;
    const protected_ = rlsStatus.filter(t => t.rls_enabled && t.policy_count > 0).length;
    
    return { disabled, noPolicies, protected: protected_ };
  };

  const summary = getStatusSummary();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Policies</h1>
            <p className="text-muted-foreground">Loading security policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Policies</h1>
          <p className="text-muted-foreground">
            Manage Row Level Security (RLS) policies and table access controls
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <Unlock className="h-5 w-5" />
              RLS Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{summary.disabled}</div>
            <p className="text-sm text-muted-foreground">Tables without RLS protection</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-secondary-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              No Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary-foreground">{summary.noPolicies}</div>
            <p className="text-sm text-muted-foreground">RLS enabled but no policies</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Protected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{summary.protected}</div>
            <p className="text-sm text-muted-foreground">Tables with active policies</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Critical Issues Alert */}
          {(summary.disabled > 0 || summary.noPolicies > 0) && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Issues Detected:</strong> {summary.disabled} tables lack RLS protection 
                and {summary.noPolicies} tables have RLS enabled but no policies configured.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common security policy management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create RLS Policy</div>
                  <div className="text-sm text-muted-foreground">Add new access control policy</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 justify-start">
                <Shield className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Enable RLS</div>
                  <div className="text-sm text-muted-foreground">Enable Row Level Security on tables</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <Eye className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Test Policies</div>
                  <div className="text-sm text-muted-foreground">Verify policy effectiveness</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <Database className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Audit Access</div>
                  <div className="text-sm text-muted-foreground">Review table access patterns</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Table Security Status</h2>
            <Button onClick={loadSecurityData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {rlsStatus.map((table) => {
              const status = getTableStatus(table);
              const StatusIcon = status.icon;
              const tablePolicies = getTablePolicies(table.table_name);

              return (
                <Card key={table.table_name} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTable(selectedTable === table.table_name ? null : table.table_name)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-5 w-5" />
                        <div>
                          <CardTitle className="text-lg">{table.table_name}</CardTitle>
                          <CardDescription>
                            {table.policy_count} policies • RLS {table.rls_enabled ? 'enabled' : 'disabled'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={status.color}>
                        {status.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  {selectedTable === table.table_name && (
                    <CardContent className="pt-0 border-t">
                      <div className="space-y-3">
                        <div className="grid gap-2 md:grid-cols-3 text-sm">
                          <div>
                            <span className="font-medium">RLS Status:</span>
                            <div className="flex items-center gap-2 mt-1">
                              {table.rls_enabled ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              {table.rls_enabled ? 'Enabled' : 'Disabled'}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Forced:</span>
                            <div className="mt-1">
                              {table.rls_forced ? 'Yes' : 'No'}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Policy Count:</span>
                            <div className="mt-1">{table.policy_count}</div>
                          </div>
                        </div>

                        {tablePolicies.length > 0 && (
                          <div>
                            <span className="font-medium text-sm">Policies:</span>
                            <div className="mt-2 space-y-2">
                              {tablePolicies.map((policy, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                  <div>
                                    <div className="font-medium text-sm">{policy.policy_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {policy.command} • {policy.policy_type}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Policy
                          </Button>
                          {!table.rls_enabled && (
                            <Button size="sm" variant="outline">
                              <Shield className="h-3 w-3 mr-1" />
                              Enable RLS
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Security Policies</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>

          <div className="grid gap-4">
            {Object.entries(policies.reduce((acc, policy) => {
              if (!acc[policy.table_name]) acc[policy.table_name] = [];
              acc[policy.table_name].push(policy);
              return acc;
            }, {} as Record<string, TablePolicy[]>)).map(([tableName, tablePolicies]) => (
              <Card key={tableName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {tableName}
                  </CardTitle>
                  <CardDescription>
                    {tablePolicies.length} active policies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tablePolicies.map((policy, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{policy.policy_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {policy.command}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {policy.policy_type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Controls {policy.command.toLowerCase()} access to {tableName}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}