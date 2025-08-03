import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Mail, UserCheck, UserX, Shield } from 'lucide-react';
import { useFamilyVault } from '@/hooks/useFamilyVault';
import type { Database } from '@/integrations/supabase/types';

type VaultMember = Database['public']['Tables']['vault_members']['Row'];

interface VaultMembersProps {
  vaultId: string;
  members: VaultMember[];
  onMemberAdded: () => void;
}

export function VaultMembers({ vaultId, members, onMemberAdded }: VaultMembersProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'member'
  });
  const [loading, setLoading] = useState(false);
  
  const { inviteMember } = useFamilyVault(vaultId);

  const handleInvite = async () => {
    if (!inviteData.email.trim()) return;
    
    setLoading(true);
    const success = await inviteMember(vaultId, {
      email: inviteData.email,
      first_name: inviteData.first_name || null,
      last_name: inviteData.last_name || null,
      role: inviteData.role,
      permissions: {
        view: true,
        add: inviteData.role === 'admin' || inviteData.role === 'editor',
        share: inviteData.role === 'admin',
        admin: inviteData.role === 'admin'
      } as Record<string, any>
    });
    
    if (success) {
      setShowInviteDialog(false);
      setInviteData({ email: '', first_name: '', last_name: '', role: 'member' });
      onMemberAdded();
    }
    
    setLoading(false);
  };

  const getRoleIcon = (permissionLevel: string) => {
    switch (permissionLevel) {
      case 'admin':
      case 'owner':
        return <Shield className="h-4 w-4" />;
      case 'editor':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Family Circle</h2>
          <p className="text-muted-foreground">
            Manage who has access to your family legacy vault.
          </p>
        </div>
        
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    placeholder="First name"
                    value={inviteData.first_name}
                    onChange={(e) => setInviteData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="Last name"
                    value={inviteData.last_name}
                    onChange={(e) => setInviteData(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member - View only</SelectItem>
                    <SelectItem value="editor">Editor - Can add content</SelectItem>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={loading || !inviteData.email.trim()}>
                  {loading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.permission_level || 'member')}
                    <div>
                      <p className="font-medium">
                        {member.first_name && member.last_name 
                          ? `${member.first_name} ${member.last_name}`
                          : member.email || 'Unknown User'
                        }
                      </p>
                      {member.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {member.permission_level || 'member'}
                  </Badge>
                  <Badge variant={getStatusColor(member.status || 'pending') as any}>
                    {member.status || 'pending'}
                  </Badge>
                </div>
              </div>
              
              {member.status === 'pending' && member.invited_at && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Invitation sent on {new Date(member.invited_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {member.accepted_at && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Joined on {new Date(member.accepted_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {members.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No family members yet</h3>
              <p className="text-muted-foreground mb-4">
                Invite your family members to start building your legacy together.
              </p>
              <Button onClick={() => setShowInviteDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Invite Your First Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}