import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mail, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface AdvisorInvitation {
  id: string;
  email: string;
  advisor_role: string;
  segments?: string[];
  status: string;
  created_at: string;
  expires_at: string;
  notes?: string;
  invitation_token: string;
}

export function PendingAdvisorsList() {
  const [invitations, setInvitations] = useState<AdvisorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant } = useTenant();

  const fetchInvitations = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('role', 'advisor')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching advisor invitations:', error);
      toast.error('Failed to load advisor invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [currentTenant]);

  const resendInvitation = async (invitation: AdvisorInvitation) => {
    try {
      const { error } = await supabase.functions.invoke('advisor-invite', {
        body: {
          email: invitation.email,
          advisorRole: invitation.advisor_role,
          segments: invitation.segments,
          notes: invitation.notes,
          tenantId: currentTenant?.id,
          invitedBy: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;
      
      toast.success('Invitation resent successfully');
      fetchInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Failed to resend invitation');
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading advisor invitations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Advisors</CardTitle>
        <CardDescription>
          Track advisor invitations and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No advisor invitations sent yet
          </p>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
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
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendInvitation(invitation)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Resend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelInvitation(invitation.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {invitation.status === 'expired' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resendInvitation(invitation)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Resend
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
                
                {invitation.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Notes:</strong> {invitation.notes}
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
      </CardContent>
    </Card>
  );
}