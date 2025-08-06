import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  Trash2, 
  Shield, 
  Eye, 
  Edit, 
  Download,
  Clock,
  UserPlus,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VaultWatermark } from './VaultWatermark';

interface AccessRule {
  id: string;
  user: {
    name: string;
    email: string;
    relationship: string;
    verified: boolean;
  };
  permissions: {
    view: boolean;
    download: boolean;
    edit: boolean;
    share: boolean;
  };
  restrictions: {
    expiresAt?: string;
    ipRestriction?: string;
    timeRestriction?: string;
  };
  status: 'active' | 'pending' | 'expired' | 'revoked';
}

interface ConsentRecord {
  id: string;
  user: string;
  relationship: string;
  consentGiven: boolean;
  consentDate?: string;
  requiresRenewal: boolean;
  renewalDate?: string;
}

export function VaultPermissionManager() {
  const [accessRules, setAccessRules] = useState<AccessRule[]>([
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        relationship: 'Daughter',
        verified: true
      },
      permissions: {
        view: true,
        download: true,
        edit: false,
        share: false
      },
      restrictions: {
        expiresAt: '2025-12-31'
      },
      status: 'active'
    },
    {
      id: '2',
      user: {
        name: 'Michael Attorney',
        email: 'michael@lawfirm.com',
        relationship: 'Attorney',
        verified: true
      },
      permissions: {
        view: true,
        download: true,
        edit: false,
        share: false
      },
      restrictions: {},
      status: 'active'
    }
  ]);

  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([
    {
      id: '1',
      user: 'Emma Johnson (Granddaughter)',
      relationship: 'Granddaughter',
      consentGiven: true,
      consentDate: '2024-01-15',
      requiresRenewal: true,
      renewalDate: '2025-01-15'
    },
    {
      id: '2',
      user: 'James Johnson (Son)',
      relationship: 'Son',
      consentGiven: false,
      requiresRenewal: false
    }
  ]);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [selectedTab, setSelectedTab] = useState<'permissions' | 'consent' | 'invitations'>('permissions');

  const handleInviteUser = () => {
    if (newUserEmail) {
      // In real implementation, this would send an invitation
      console.log('Inviting user:', newUserEmail);
      setNewUserEmail('');
    }
  };

  const togglePermission = (ruleId: string, permission: keyof AccessRule['permissions']) => {
    setAccessRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            permissions: { 
              ...rule.permissions, 
              [permission]: !rule.permissions[permission] 
            } 
          }
        : rule
    ));
  };

  const revokeAccess = (ruleId: string) => {
    setAccessRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, status: 'revoked' as const } : rule
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-dark relative">
      <VaultWatermark opacity={0.05} position="bottom-left" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Access & Permission Management
            </h1>
            <p className="text-white/80">
              Control who can access your legacy vault and what they can do
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('permissions')}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedTab === 'permissions'
                    ? 'bg-gold text-navy font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Permissions
              </button>
              <button
                onClick={() => setSelectedTab('consent')}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedTab === 'consent'
                    ? 'bg-gold text-navy font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Multi-Gen Consent
              </button>
              <button
                onClick={() => setSelectedTab('invitations')}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedTab === 'invitations'
                    ? 'bg-gold text-navy font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Invitations
              </button>
            </div>
          </div>

          {/* Permissions Tab */}
          {selectedTab === 'permissions' && (
            <div className="space-y-6">
              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gold" />
                    Current Access Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessRules.map((rule) => (
                      <Card key={rule.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{rule.user.name}</h4>
                                  {rule.user.verified && (
                                    <Shield className="h-4 w-4 text-green-500" />
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {rule.user.relationship}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {rule.user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={rule.status === 'active' ? 'secondary' : 'destructive'}
                                className="capitalize"
                              >
                                {rule.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => revokeAccess(rule.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">View</span>
                              </div>
                              <Switch
                                checked={rule.permissions.view}
                                onCheckedChange={() => togglePermission(rule.id, 'view')}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Download</span>
                              </div>
                              <Switch
                                checked={rule.permissions.download}
                                onCheckedChange={() => togglePermission(rule.id, 'download')}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Edit</span>
                              </div>
                              <Switch
                                checked={rule.permissions.edit}
                                onCheckedChange={() => togglePermission(rule.id, 'edit')}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Share</span>
                              </div>
                              <Switch
                                checked={rule.permissions.share}
                                onCheckedChange={() => togglePermission(rule.id, 'share')}
                              />
                            </div>
                          </div>

                          {rule.restrictions.expiresAt && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Expires: {rule.restrictions.expiresAt}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Multi-Generational Consent Tab */}
          {selectedTab === 'consent' && (
            <div className="space-y-6">
              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    Multi-Generational Consent Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-gold/10 border border-gold/20 rounded-lg">
                    <h4 className="font-semibold text-gold mb-2">About Consent Management</h4>
                    <p className="text-sm text-muted-foreground">
                      For family members under 18 or those requiring special consent, this system manages 
                      legal permissions and renewal requirements for accessing legacy content.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {consentRecords.map((consent) => (
                      <Card key={consent.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{consent.user}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {consent.relationship}
                              </Badge>
                            </div>
                            <Badge 
                              variant={consent.consentGiven ? 'secondary' : 'destructive'}
                              className="capitalize"
                            >
                              {consent.consentGiven ? 'Consent Given' : 'Consent Pending'}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {consent.consentDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Consent Date: {consent.consentDate}</span>
                              </div>
                            )}
                            {consent.renewalDate && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  Renewal: {consent.renewalDate}
                                  {consent.requiresRenewal && ' (Required)'}
                                </span>
                              </div>
                            )}
                          </div>

                          {!consent.consentGiven && (
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Consent Request
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Guardian
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Invitations Tab */}
          {selectedTab === 'invitations' && (
            <div className="space-y-6">
              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-gold" />
                    Invite New Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email Address
                        </label>
                        <Input
                          placeholder="Enter email address"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Relationship
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="grandchild">Grandchild</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="attorney">Attorney</SelectItem>
                            <SelectItem value="advisor">Financial Advisor</SelectItem>
                            <SelectItem value="trustee">Trustee</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Access Level
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Only</SelectItem>
                            <SelectItem value="download">View & Download</SelectItem>
                            <SelectItem value="edit">Full Access</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleInviteUser}
                      disabled={!newUserEmail}
                      className="bg-gradient-to-r from-gold to-gold-light text-navy"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold mb-4">Pending Invitations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">john.smith@example.com</p>
                          <p className="text-sm text-muted-foreground">
                            Invited as Son • Sent 2 days ago
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Resend
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}