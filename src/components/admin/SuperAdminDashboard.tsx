import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Building, Plus, Users, CreditCard, Settings } from 'lucide-react';
import { toast } from 'sonner';
import type { Tenant } from '@/hooks/useTenant';

export const SuperAdminDashboard: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    franchisee_status: 'licensed' as const
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTenants((data || []).map(tenant => ({
        ...tenant,
        color_palette: tenant.color_palette as Tenant['color_palette'],
        billing_status: tenant.billing_status as Tenant['billing_status'],
        franchisee_status: tenant.franchisee_status as Tenant['franchisee_status'],
        status: tenant.status as Tenant['status']
      })));
    } catch (err) {
      toast.error('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenant.name) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .insert({
          name: newTenant.name,
          domain: newTenant.domain || null,
          franchisee_status: newTenant.franchisee_status
        });

      if (error) throw error;

      toast.success('Tenant created successfully');
      setNewTenant({ name: '', domain: '', franchisee_status: 'licensed' });
      setCreateOpen(false);
      fetchTenants();
    } catch (err) {
      toast.error('Failed to create tenant');
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'delinquent':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Administration</h1>
          <p className="text-muted-foreground">Manage tenants and platform-wide settings</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Set up a new organization or franchise on the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-name">Organization Name</Label>
                <Input
                  id="tenant-name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-domain">Domain (optional)</Label>
                <Input
                  id="tenant-domain"
                  value={newTenant.domain}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="myorg.platform.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTenant}>
                  Create Tenant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">Active organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.filter(t => t.billing_status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Paying customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Tenants</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.filter(t => t.billing_status === 'trial').length}
            </div>
            <p className="text-xs text-muted-foreground">On trial period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Franchises</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.filter(t => t.franchisee_status === 'franchisee').length}
            </div>
            <p className="text-xs text-muted-foreground">Franchise partners</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>Manage all organizations on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading tenants...</div>
          ) : (
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.domain || 'No custom domain'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(tenant.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getBillingStatusColor(tenant.billing_status)}>
                      {tenant.billing_status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {tenant.franchisee_status.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
              
              {tenants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tenants found. Create your first tenant to get started.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};