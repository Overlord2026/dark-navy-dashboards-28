import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Mail, Plus, X, Send, CheckCircle, Info } from 'lucide-react';

interface InviteTeamStepProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

interface TeamInvite {
  id: string;
  type: 'family' | 'advisor' | 'coach';
  name: string;
  email: string;
  relationship?: string;
  permissions: string[];
  message?: string;
  status: 'pending' | 'sent' | 'error';
}

const INVITE_TYPES = [
  { value: 'family', label: 'Family Member', description: 'Parent, guardian, or family member' },
  { value: 'advisor', label: 'Financial Advisor', description: 'Professional financial guidance' },
  { value: 'coach', label: 'Coach/Agent', description: 'Athletic coach or agent' }
];

const FAMILY_RELATIONSHIPS = [
  'Parent', 'Guardian', 'Sibling', 'Grandparent', 'Other'
];

const PERMISSION_OPTIONS = {
  family: [
    { id: 'view_contracts', label: 'View NIL contracts', description: 'See all active and pending contracts' },
    { id: 'view_payments', label: 'View payments', description: 'See payment history and pending payments' },
    { id: 'approve_contracts', label: 'Approve contracts', description: 'Required approval for contract signing' },
    { id: 'financial_oversight', label: 'Financial oversight', description: 'Access to financial summaries and budgeting tools' }
  ],
  advisor: [
    { id: 'view_contracts', label: 'View NIL contracts', description: 'See all active and pending contracts' },
    { id: 'view_payments', label: 'View payments', description: 'See payment history and pending payments' },
    { id: 'financial_advice', label: 'Provide financial advice', description: 'Add recommendations and financial guidance' },
    { id: 'tax_preparation', label: 'Tax preparation access', description: 'Access to tax documents and preparation tools' }
  ],
  coach: [
    { id: 'view_contracts', label: 'View NIL contracts', description: 'See all active and pending contracts' },
    { id: 'negotiate_contracts', label: 'Negotiate contracts', description: 'Participate in contract negotiations' },
    { id: 'brand_outreach', label: 'Brand outreach', description: 'Contact brands on athlete\'s behalf' },
    { id: 'schedule_coordination', label: 'Schedule coordination', description: 'Coordinate NIL activities with training' }
  ]
};

export function InviteTeamStep({ onComplete, isLoading }: InviteTeamStepProps) {
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [currentInvite, setCurrentInvite] = useState({
    type: '' as 'family' | 'advisor' | 'coach' | '',
    name: '',
    email: '',
    relationship: '',
    permissions: [] as string[],
    message: ''
  });
  const [showInviteForm, setShowInviteForm] = useState(false);

  const addInvite = () => {
    if (currentInvite.name && currentInvite.email && currentInvite.type) {
      const newInvite: TeamInvite = {
        id: `invite_${Date.now()}`,
        type: currentInvite.type,
        name: currentInvite.name,
        email: currentInvite.email,
        relationship: currentInvite.relationship,
        permissions: currentInvite.permissions,
        message: currentInvite.message,
        status: 'pending'
      };

      setInvites(prev => [...prev, newInvite]);
      setCurrentInvite({
        type: '',
        name: '',
        email: '',
        relationship: '',
        permissions: [],
        message: ''
      });
      setShowInviteForm(false);
    }
  };

  const removeInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId));
  };

  const sendInvites = async () => {
    // Simulate sending invites
    for (const invite of invites) {
      setInvites(prev => prev.map(inv => 
        inv.id === invite.id 
          ? { ...inv, status: 'sent' }
          : inv
      ));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleComplete = async () => {
    if (invites.length > 0) {
      await sendInvites();
    }
    
    onComplete({
      invites: invites.map(invite => ({
        type: invite.type,
        name: invite.name,
        email: invite.email,
        relationship: invite.relationship,
        permissions: invite.permissions,
        message: invite.message
      })),
      totalInvites: invites.length
    });
  };

  const handleSkip = () => {
    onComplete({ skipped: true });
  };

  const togglePermission = (permissionId: string) => {
    setCurrentInvite(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const availablePermissions = currentInvite.type ? PERMISSION_OPTIONS[currentInvite.type] : [];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Optional:</strong> You can invite family members, advisors, or coaches to help 
          manage your NIL activities. They'll have limited access based on the permissions you set.
        </AlertDescription>
      </Alert>

      {/* Current Invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Invites ({invites.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <div className="font-medium">{invite.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {invite.email} • {INVITE_TYPES.find(t => t.value === invite.type)?.label}
                      {invite.relationship && ` • ${invite.relationship}`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Permissions: {invite.permissions.length} selected
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={invite.status === 'sent' ? 'default' : 'secondary'}>
                    {invite.status === 'pending' && 'Ready to send'}
                    {invite.status === 'sent' && (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sent
                      </>
                    )}
                    {invite.status === 'error' && 'Failed'}
                  </Badge>
                  
                  {invite.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInvite(invite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Invite Form */}
      {showInviteForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Team Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Invite Type */}
            <div className="space-y-2">
              <Label>Type of Team Member *</Label>
              <Select value={currentInvite.type} onValueChange={(value: any) => setCurrentInvite(prev => ({ ...prev, type: value, permissions: [] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {INVITE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inviteName">Full Name *</Label>
                <Input
                  id="inviteName"
                  value={currentInvite.name}
                  onChange={(e) => setCurrentInvite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address *</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={currentInvite.email}
                  onChange={(e) => setCurrentInvite(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
            </div>

            {/* Family Relationship */}
            {currentInvite.type === 'family' && (
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select value={currentInvite.relationship} onValueChange={(value) => setCurrentInvite(prev => ({ ...prev, relationship: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAMILY_RELATIONSHIPS.map(rel => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Permissions */}
            {currentInvite.type && (
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-3">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={permission.id}
                        checked={currentInvite.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                          {permission.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
              <Textarea
                id="inviteMessage"
                value={currentInvite.message}
                onChange={(e) => setCurrentInvite(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message to your invitation..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addInvite} disabled={!currentInvite.name || !currentInvite.email || !currentInvite.type}>
                Add Invite
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Invite Your Team</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add family members, advisors, or coaches to help manage your NIL activities
              </p>
              <Button onClick={() => setShowInviteForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSkip}>
          Skip for Now
        </Button>
        
        <Button onClick={handleComplete} disabled={isLoading} className="min-w-32">
          {isLoading ? 'Processing...' : invites.length > 0 ? `Send ${invites.length} Invite${invites.length > 1 ? 's' : ''}` : 'Continue'}
        </Button>
      </div>
    </div>
  );
}