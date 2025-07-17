import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { InviteAdvisorDialog } from './InviteAdvisorDialog';
import { InviteClientDialog } from './InviteClientDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mail, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Invitation {
  id: string;
  email: string;
  role: string;
  advisor_role?: string;
  segments?: string[];
  status: string;
  created_at: string;
  expires_at: string;
  notes?: string;
}

export function InvitationManagement() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant } = useTenant();

  const fetchInvitations = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await (supabase as any)
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations((data as Invitation[]) || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [currentTenant]);

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('tenant_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;
      
      toast.success('Invitation cancelled');
      fetchInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const advisorInvitations = invitations.filter(inv => inv.role === 'advisor');
  const clientInvitations = invitations.filter(inv => inv.role === 'client');

  if (isLoading) {
    return <div className="p-6">Loading invitations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invitation Management</CardTitle>
            <CardDescription>
              Invite advisors and clients to your tenant
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <InviteAdvisorDialog onInviteSuccess={fetchInvitations} />
            <InviteClientDialog onInviteSuccess={fetchInvitations} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="advisors" className="w-full">
          <TabsList>
            <TabsTrigger value="advisors">
              Advisors ({advisorInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="clients">
              Clients ({clientInvitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisors" className="space-y-4">
            {advisorInvitations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No advisor invitations sent yet
              </p>
            ) : (
              <div className="space-y-4">
                {advisorInvitations.map((invitation) => (
                  <div key={invitation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invitation.status)}
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {invitation.advisor_role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(invitation.status)}>
                          {invitation.status}
                        </Badge>
                        {invitation.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelInvitation(invitation.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    {invitation.segments && invitation.segments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {invitation.segments.map((segment) => (
                          <Badge key={segment} variant="secondary" className="text-xs">
                            {segment}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Sent {format(new Date(invitation.created_at), 'MMM d, yyyy')} • 
                      Expires {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            {clientInvitations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No client invitations sent yet
              </p>
            ) : (
              <div className="space-y-4">
                {clientInvitations.map((invitation) => (
                  <div key={invitation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invitation.status)}
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">Client</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(invitation.status)}>
                          {invitation.status}
                        </Badge>
                        {invitation.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelInvitation(invitation.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    {invitation.segments && invitation.segments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {invitation.segments.map((segment) => (
                          <Badge key={segment} variant="secondary" className="text-xs">
                            {segment}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Sent {format(new Date(invitation.created_at), 'MMM d, yyyy')} • 
                      Expires {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}