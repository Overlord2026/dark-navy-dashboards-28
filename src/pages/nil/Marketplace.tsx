import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Shield, Clock, Check, X } from 'lucide-react';
import { invite, accept, getInvites, getPendingInvites, PendingInvite } from '@/features/nil/invite/api';
import { issueConsent, revokeConsent, getActiveConsents, ConsentRequest } from '@/features/nil/consent/api';
import { ConsentRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [activeConsents, setActiveConsents] = React.useState<ConsentRDS[]>([]);
  const [showInviteForm, setShowInviteForm] = React.useState(false);
  const [showConsentForm, setShowConsentForm] = React.useState(false);
  
  // Form state
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
    setActiveConsents(getActiveConsents());
  }, []);

  const handleSendInvite = () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const pendingId = invite(inviteForm.role, inviteForm.email);
      setInvites(getInvites());
      setShowInviteForm(false);
      
      // Reset form
      setInviteForm({ role: 'advisor', email: '' });

      toast.success('Invite sent successfully!', {
        description: `Invitation sent to ${inviteForm.email}`,
        action: {
          label: 'View Invites',
          onClick: () => console.log('Pending ID:', pendingId)
        }
      });
    } catch (error) {
      toast.error('Failed to send invite');
    }
  };

  const handleAcceptInvite = (pendingId: string) => {
    try {
      accept(pendingId);
      setInvites(getInvites());
      
      toast.success('Invite accepted!', {
        description: 'You can now collaborate on contracts'
      });
    } catch (error) {
      toast.error('Failed to accept invite');
    }
  };

  const handleIssueConsent = () => {
    if (consentForm.roles.length === 0 || consentForm.resources.length === 0) {
      toast.error('Please select at least one role and resource');
      return;
    }

    try {
      const consent = issueConsent(consentForm);
      setActiveConsents(getActiveConsents());
      setShowConsentForm(false);
      
      // Reset form
      setConsentForm({
        roles: [],
        resources: [],
        ttlDays: 365,
        purpose_of_use: 'contract_collab'
      });

      toast.success('Consent issued successfully!', {
        description: `Receipt: ${consent.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Consent:', consent)
        }
      });
    } catch (error) {
      toast.error('Failed to issue consent');
    }
  };

  const handleRevokeConsent = (consentId: string) => {
    try {
      const revokeReceipt = revokeConsent(consentId);
      setActiveConsents(getActiveConsents());
      
      toast.success('Consent revoked', {
        description: `Revocation receipt: ${revokeReceipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Revoke receipt:', revokeReceipt)
        }
      });
    } catch (error) {
      toast.error('Failed to revoke consent');
    }
  };

  const toggleRole = (role: string) => {
    setConsentForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const toggleResource = (resource: string) => {
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
          Collaborate with advisors, CPAs, and attorneys on NIL contracts
        </p>
      </div>

      <div className="grid gap-6">
        {/* Invite Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Professional Invites
                </CardTitle>
                <CardDescription>Invite professionals to collaborate on your NIL deals</CardDescription>
              </div>
              <Button onClick={() => setShowInviteForm(true)}>
                Send Invite
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showInviteForm && (
              <div className="mb-6 p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Professional Role</Label>
                    <Select value={inviteForm.role} onValueChange={(value: any) => setInviteForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advisor">Financial Advisor</SelectItem>
                        <SelectItem value="cpa">CPA/Accountant</SelectItem>
                        <SelectItem value="attorney">Attorney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="professional@example.com"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSendInvite}>Send Invite</Button>
                  <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {invites.length > 0 ? (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{invite.role}</p>
                      <p className="text-xs text-muted-foreground">
                        Invited: {new Date(invite.invitedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        invite.status === 'accepted' ? 'default' :
                        invite.status === 'declined' ? 'destructive' : 'secondary'
                      }>
                        {invite.status}
                      </Badge>
                      {invite.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvite(invite.id)}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No invites sent yet</p>
            )}
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Consent Management
                </CardTitle>
                <CardDescription>Issue and manage consent for data sharing</CardDescription>
              </div>
              <Button onClick={() => setShowConsentForm(true)}>
                Issue Consent
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showConsentForm && (
              <div className="mb-6 p-4 border rounded-lg space-y-4">
                <div>
                  <Label>Authorized Roles</Label>
                  <div className="flex gap-2 mt-2">
                    {['advisor', 'cpa', 'attorney', 'brand_representative'].map(role => (
                      <Button
                        key={role}
                        variant={consentForm.roles.includes(role) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleRole(role)}
                      >
                        {role.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Authorized Resources</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['contract_terms', 'financial_data', 'performance_metrics', 'compliance_records'].map(resource => (
                      <Button
                        key={resource}
                        variant={consentForm.resources.includes(resource) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleResource(resource)}
                      >
                        {resource.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valid for (days)</Label>
                    <Input
                      type="number"
                      value={consentForm.ttlDays}
                      onChange={(e) => setConsentForm(prev => ({ ...prev, ttlDays: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Select value={consentForm.purpose_of_use} onValueChange={(value) => setConsentForm(prev => ({ ...prev, purpose_of_use: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contract_collab">Contract Collaboration</SelectItem>
                        <SelectItem value="tax_preparation">Tax Preparation</SelectItem>
                        <SelectItem value="legal_review">Legal Review</SelectItem>
                        <SelectItem value="financial_planning">Financial Planning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleIssueConsent}>Issue Consent</Button>
                  <Button variant="outline" onClick={() => setShowConsentForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {activeConsents.length > 0 ? (
              <div className="space-y-3">
                {activeConsents.map((consent) => (
                  <div key={consent.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={consent.result === 'approve' ? 'default' : 'destructive'}>
                          {consent.result === 'approve' ? 'Active' : 'Revoked'}
                        </Badge>
                        <span className="font-medium">{consent.purpose_of_use.replace('_', ' ')}</span>
                      </div>
                      {consent.result === 'approve' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeConsent(consent.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Roles: {consent.scope.roles.join(', ')}</p>
                      <p>Resources: {consent.scope.resources.join(', ')}</p>
                      <p>Expires: {new Date(consent.expiry).toLocaleDateString()}</p>
                      <p>Freshness Score: {(consent.freshness_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No active consents</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}