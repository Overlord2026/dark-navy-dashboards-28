import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Crown, 
  User, 
  Eye, 
  FileText,
  Settings,
  Users,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VaultMember {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  permission_level: string;
  permissions: Record<string, boolean>;
  status: string;
  role_description?: string;
}

interface VaultRoleManagerProps {
  members: VaultMember[];
  currentUserRole: string;
  onUpdateMemberRole: (memberId: string, newRole: string, permissions: Record<string, boolean>) => Promise<boolean>;
}

type VaultRole = 'owner' | 'admin' | 'member' | 'viewer' | 'executor';

interface RoleDefinition {
  id: VaultRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  permissions: {
    view: boolean;
    upload: boolean;
    download: boolean;
    share: boolean;
    delete: boolean;
    invite: boolean;
    manage_roles: boolean;
    access_audit: boolean;
    manage_vault: boolean;
    executor_access: boolean;
  };
}

const roleDefinitions: RoleDefinition[] = [
  {
    id: 'owner',
    title: 'Owner',
    description: 'Full control over the vault, including deletion and ownership transfer',
    icon: Crown,
    color: 'text-yellow-600 bg-yellow-100',
    permissions: {
      view: true,
      upload: true,
      download: true,
      share: true,
      delete: true,
      invite: true,
      manage_roles: true,
      access_audit: true,
      manage_vault: true,
      executor_access: true,
    }
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage vault settings, members, and content with full permissions',
    icon: Shield,
    color: 'text-blue-600 bg-blue-100',
    permissions: {
      view: true,
      upload: true,
      download: true,
      share: true,
      delete: true,
      invite: true,
      manage_roles: true,
      access_audit: true,
      manage_vault: false,
      executor_access: false,
    }
  },
  {
    id: 'member',
    title: 'Member',
    description: 'Add content and share with family members',
    icon: User,
    color: 'text-green-600 bg-green-100',
    permissions: {
      view: true,
      upload: true,
      download: true,
      share: true,
      delete: false,
      invite: false,
      manage_roles: false,
      access_audit: false,
      manage_vault: false,
      executor_access: false,
    }
  },
  {
    id: 'viewer',
    title: 'Viewer',
    description: 'View and download content only',
    icon: Eye,
    color: 'text-gray-600 bg-gray-100',
    permissions: {
      view: true,
      upload: false,
      download: true,
      share: false,
      delete: false,
      invite: false,
      manage_roles: false,
      access_audit: false,
      manage_vault: false,
      executor_access: false,
    }
  },
  {
    id: 'executor',
    title: 'Executor',
    description: 'Legal executor with special access rights and responsibilities',
    icon: FileText,
    color: 'text-purple-600 bg-purple-100',
    permissions: {
      view: true,
      upload: true,
      download: true,
      share: true,
      delete: false,
      invite: false,
      manage_roles: false,
      access_audit: true,
      manage_vault: false,
      executor_access: true,
    }
  }
];

export function VaultRoleManager({ members, currentUserRole, onUpdateMemberRole }: VaultRoleManagerProps) {
  const [selectedMember, setSelectedMember] = useState<VaultMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customPermissions, setCustomPermissions] = useState<Record<string, boolean>>({});
  const [isCustomRole, setIsCustomRole] = useState(false);
  const { toast } = useToast();

  const canManageRoles = currentUserRole === 'owner' || currentUserRole === 'admin';

  const getRoleDefinition = (roleId: string): RoleDefinition | undefined => {
    return roleDefinitions.find(r => r.id === roleId);
  };

  const getRoleIcon = (role: string) => {
    const roledef = getRoleDefinition(role);
    if (roledef) {
      const IconComponent = roledef.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    const roledef = getRoleDefinition(role);
    return roledef?.color || 'text-gray-600 bg-gray-100';
  };

  const openEditDialog = (member: VaultMember) => {
    setSelectedMember(member);
    setCustomPermissions(member.permissions || {});
    setIsCustomRole(false);
    setIsEditDialogOpen(true);
  };

  const handleRoleChange = (newRole: string) => {
    const roledef = getRoleDefinition(newRole as VaultRole);
    if (roledef) {
      setCustomPermissions(roledef.permissions);
      setIsCustomRole(false);
    }
  };

  const handleCustomPermissionChange = (permission: string, value: boolean) => {
    setCustomPermissions(prev => ({ ...prev, [permission]: value }));
    setIsCustomRole(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedMember) return;

    const roleLevel = isCustomRole ? 'custom' : 
      Object.entries(customPermissions).find(([_, perms]) => 
        JSON.stringify(perms) === JSON.stringify(roleDefinitions.find(r => 
          JSON.stringify(r.permissions) === JSON.stringify(customPermissions)
        )?.permissions)
      )?.[0] || 'custom';

    try {
      const success = await onUpdateMemberRole(
        selectedMember.id, 
        roleLevel, 
        customPermissions
      );

      if (success) {
        toast({
          title: "Role Updated",
          description: `Successfully updated ${selectedMember.first_name || selectedMember.email}'s role.`,
        });
        setIsEditDialogOpen(false);
        setSelectedMember(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPermissionLabel = (key: string) => {
    const labels: Record<string, string> = {
      view: 'View Content',
      upload: 'Upload Files',
      download: 'Download Files',
      share: 'Share Content',
      delete: 'Delete Content',
      invite: 'Invite Members',
      manage_roles: 'Manage Roles',
      access_audit: 'View Audit Logs',
      manage_vault: 'Vault Settings',
      executor_access: 'Executor Access'
    };
    return labels[key] || key;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage permissions and access levels for vault members.
          </p>
        </div>
      </div>

      {/* Role Definitions Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Role Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleDefinitions.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card key={role.id} className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${role.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold">{role.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {role.description}
                  </p>
                  <div className="space-y-1">
                    {Object.entries(role.permissions).map(([perm, enabled]) => 
                      enabled && (
                        <div key={perm} className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>{getPermissionLabel(perm)}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current Members */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Members</h3>
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center text-navy font-medium">
                      {(member.first_name?.[0] || member.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">
                        {member.first_name && member.last_name 
                          ? `${member.first_name} ${member.last_name}`
                          : member.email
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getRoleColor(member.permission_level)}`}>
                      {getRoleIcon(member.permission_level)}
                      <span className="text-sm font-medium capitalize">
                        {member.permission_level}
                      </span>
                    </div>
                    
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>

                    {canManageRoles && member.permission_level !== 'owner' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center text-navy font-medium">
                  {(selectedMember.first_name?.[0] || selectedMember.email[0]).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedMember.first_name && selectedMember.last_name 
                      ? `${selectedMember.first_name} ${selectedMember.last_name}`
                      : selectedMember.email
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Predefined Roles</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {roleDefinitions.slice(1).map((role) => { // Exclude owner
                      const IconComponent = role.icon;
                      const isSelected = JSON.stringify(customPermissions) === JSON.stringify(role.permissions);
                      
                      return (
                        <Card 
                          key={role.id}
                          className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-gold' : ''}`}
                          onClick={() => handleRoleChange(role.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${role.color}`}>
                                <IconComponent className="h-3 w-3" />
                              </div>
                              <span className="text-sm font-medium">{role.title}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Custom Permissions</Label>
                    {isCustomRole && (
                      <Badge variant="outline" className="text-xs">Custom Role</Badge>
                    )}
                  </div>
                  <div className="space-y-3 p-4 border rounded-lg">
                    {Object.entries(customPermissions).map(([permission, enabled]) => (
                      <div key={permission} className="flex items-center justify-between">
                        <Label htmlFor={permission} className="text-sm">
                          {getPermissionLabel(permission)}
                        </Label>
                        <Switch
                          id={permission}
                          checked={enabled}
                          onCheckedChange={(value) => handleCustomPermissionChange(permission, value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {currentUserRole !== 'owner' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">Limited Permissions</p>
                        <p className="text-amber-700 mt-1">
                          As an admin, you cannot grant permissions higher than your own level.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} variant="gold">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}