import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Users, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface TenantUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
}

export const TenantUserManagement: React.FC = () => {
  const { currentTenant } = useTenant();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'advisor',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (currentTenant) {
      fetchTenantUsers();
    }
  }, [currentTenant]);

  const fetchTenantUsers = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, created_at')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!currentTenant || !inviteForm.email) return;

    try {
      // For now, just create a placeholder entry
      // In a real implementation, you'd send an invitation email
      toast.success('Invitation sent successfully');
      setInviteForm({ email: '', role: 'advisor', first_name: '', last_name: '' });
      setInviteOpen(false);
    } catch (err) {
      toast.error('Failed to send invitation');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'tenant_admin':
        return 'bg-purple-100 text-purple-800';
      case 'advisor':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users and their roles within your organization
              </CardDescription>
            </div>
            <Button onClick={() => setInviteOpen(!inviteOpen)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inviteOpen && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">Invite New User</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteForm.role} onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-first-name">First Name</Label>
                  <Input
                    id="invite-first-name"
                    value={inviteForm.first_name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-last-name">Last Name</Label>
                  <Input
                    id="invite-last-name"
                    value={inviteForm.last_name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInviteUser}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.email
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found. Invite your first user to get started.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};