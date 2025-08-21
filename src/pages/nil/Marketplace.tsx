import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Shield, Users, Clock } from 'lucide-react';
import { invite, accept, getInvites, PendingInvite } from '@/features/nil/invite/api';
import { issueConsent, revokeConsent, getActiveConsents, ConsentRequest } from '@/features/nil/consent/api';
import { ConsentRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [consents, setConsents] = React.useState<ConsentRDS[]>([]);
  const [inviteForm, setInviteForm] = React.useState({
    role: 'advisor' as 'advisor' | 'cpa' | 'attorney',
    email: ''
  });
  const [consentForm, setConsentForm] = React.useState<ConsentRequest>({
    roles: [],
    resources: [],
    ttlDays: 365,
    purpose_of_use: 'contract_collab'
  });

  React.useEffect(() => {
    setInvites(getInvites());
    setConsents(getActiveConsents());
  }, []);

  const handleSendInvite = () => {
    try {
      const pendingId = invite(inviteForm.role, inviteForm.email);
      setInvites(getInvites());
      
      toast.success('Invite sent!', {
        description: `Invitation sent to ${inviteForm.email}`
      });
      
      setInviteForm({ role: 'advisor', email: '' });
    } catch (error) {
      toast.error('Failed to send invite');
    }
  };

  const handleAcceptInvite = (pendingId: string) => {
    try {
      accept(pendingId);
      setInvites(getInvites());
      
      toast.success('Invite accepted!');
    } catch (error) {
      toast.error('Failed to accept invite');
    }
  };

  const handleIssueConsent = () => {
    if (consentForm.roles.length === 0 || consentForm.resources.length === 0) {
      toast.error('Please select roles and resources');
      return;
    }

    try {
      const receipt = issueConsent(consentForm);
      setConsents(getActiveConsents());
      
      toast.success('Consent issued!', {
        description: `Receipt: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Receipt:', receipt)
        }
      });
      
      setConsentForm({
        roles: [],
        resources: [],
        ttlDays: 365,
        purpose_of_use: 'contract_collab'
      });
    } catch (error) {
      toast.error('Failed to issue consent');
    }
  };

  const handleRevokeConsent = (consentId: string) => {
    try {
      const receipt = revokeConsent(consentId);
      setConsents(getActiveConsents());
      
      toast.success('Consent revoked!', {
        description: `Receipt: ${receipt.id}`
      });
    } catch (error) {
      toast.error('Failed to revoke consent');
    }
  };

  const handleRoleToggle = (role: string) => {
    setConsentForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleResourceToggle = (resource: string) => {
    setConsentForm(prev => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter(r => r !== resource)
        : [...prev.resources, resource]
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Marketplace</h1>
        <p className="text-muted-foreground">
          Invite professionals and manage consent permissions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Send Invitation
              </CardTitle>
              <CardDescription>Invite professionals to collaborate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Professional Role</Label>
                <Select value={inviteForm.role} onValueChange={(value: 'advisor' | 'cpa' | 'attorney') => setInviteForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="cpa">CPA</SelectItem>
                    <SelectItem value="attorney">Attorney</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="professional@example.com"
                />
              </div>

              <Button 
                onClick={handleSendInvite}
                className="w-full"
                disabled={!inviteForm.email}
              >
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Issue Consent
              </CardTitle>
              <CardDescription>Grant access permissions for collaboration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['advisor', 'cpa', 'attorney', 'agent'].map((role) => (
                    <Button
                      key={role}
                      variant={consentForm.roles.includes(role) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRoleToggle(role)}
                    >
                      {role.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Resources</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['contracts', 'financial_data', 'offers', 'education_records'].map((resource) => (
                    <Button
                      key={resource}
                      variant={consentForm.resources.includes(resource) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleResourceToggle(resource)}
                    >
                      {resource.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="ttlDays">Valid for (days)</Label>
                <Input
                  id="ttlDays"
                  type="number"
                  value={consentForm.ttlDays}
                  onChange={(e) => setConsentForm(prev => ({ ...prev, ttlDays: Number(e.target.value) }))}
                  min="1"
                  max="365"
                />
              </div>

              <Button 
                onClick={handleIssueConsent}
                className="w-full"
                disabled={consentForm.roles.length === 0 || consentForm.resources.length === 0}
              >
                Issue Consent
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pending Invitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{invite.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(invite.invitedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={invite.status === 'pending' ? 'secondary' : invite.status === 'accepted' ? 'default' : 'destructive'}>
                        {invite.status}
                      </Badge>
                      {invite.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcceptInvite(invite.id)}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {invites.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No invitations sent yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Active Consents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consents.map((consent) => (
                  <div key={consent.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{consent.purpose_of_use.replace('_', ' ')}</p>
                      <Badge variant={consent.result === 'approve' ? 'default' : 'destructive'}>
                        {consent.result}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Roles: {consent.scope.roles.join(', ')}</p>
                      <p>Resources: {consent.scope.resources.join(', ')}</p>
                      <p>Expires: {new Date(consent.expiry).toLocaleDateString()}</p>
                      <p>Freshness: {(consent.freshness_score * 100).toFixed(0)}%</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleRevokeConsent(consent.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
                {consents.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active consents</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}