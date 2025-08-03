import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/MainLayout';
import { UserPlus, Mail, Users, Clock, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'expired';
  sentAt: string;
  expiresAt: string;
}

export default function InviteClientPage() {
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: ''
  });

  const [recentInvitations] = useState<Invitation[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      status: 'pending',
      sentAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-01-22T10:00:00Z'
    },
    {
      id: '2',
      email: 'sarah.smith@example.com',
      name: 'Sarah Smith',
      status: 'accepted',
      sentAt: '2024-01-14T14:30:00Z',
      expiresAt: '2024-01-21T14:30:00Z'
    },
    {
      id: '3',
      email: 'mike.wilson@example.com',
      name: 'Mike Wilson',
      status: 'expired',
      sentAt: '2024-01-10T09:15:00Z',
      expiresAt: '2024-01-17T09:15:00Z'
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setInviteData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvitation = async () => {
    if (!inviteData.email || !inviteData.firstName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Implement Supabase invitation logic
      console.log('Sending invitation:', inviteData);
      toast.success('Invitation sent successfully!');
      
      // Reset form
      setInviteData({
        email: '',
        firstName: '',
        lastName: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const copyInviteLink = (invitationId: string) => {
    const link = `${window.location.origin}/accept-invitation/${invitationId}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard');
  };

  const resendInvitation = (email: string) => {
    // TODO: Implement resend logic
    toast.success(`Invitation resent to ${email}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8" />
            Invite New Client
          </h1>
          <p className="text-muted-foreground">
            Send a secure invitation to onboard new clients to your practice
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Invitation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={inviteData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={inviteData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="client@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={inviteData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Add a personal message to your client..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>What happens next:</strong><br />
                  • Client receives a secure invitation email<br />
                  • They can create their account using the invitation link<br />
                  • Invitation expires in 7 days<br />
                  • You'll be notified when they accept
                </p>
              </div>

              <Button onClick={handleSendInvitation} className="w-full">
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          {/* Recent Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Invitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{invitation.name}</h4>
                        <p className="text-sm text-muted-foreground">{invitation.email}</p>
                      </div>
                      {getStatusBadge(invitation.status)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      <div>Sent: {formatDate(invitation.sentAt)}</div>
                      <div>Expires: {formatDate(invitation.expiresAt)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invitation.id)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>
                      
                      {invitation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendInvitation(invitation.email)}
                        >
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Invitation Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {recentInvitations.filter(i => i.status === 'pending').length}
                </div>
                <div className="text-sm text-blue-800">Pending Invitations</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {recentInvitations.filter(i => i.status === 'accepted').length}
                </div>
                <div className="text-sm text-green-800">Accepted This Month</div>
              </div>
              
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.round((recentInvitations.filter(i => i.status === 'accepted').length / recentInvitations.length) * 100)}%
                </div>
                <div className="text-sm text-amber-800">Acceptance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}