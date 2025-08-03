import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  User, 
  Mail, 
  Calendar, 
  MessageSquare,
  FileText,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Client {
  id: string;
  email: string;
  name: string;
  relationship_type: string;
  status: string;
  created_at: string;
  last_message_at?: string;
  unread_count?: number;
}

interface Invitation {
  id: string;
  client_email: string;
  client_name: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface ClientListProps {
  onRefresh?: () => void;
}

export function ClientList({ onRefresh }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'clients' | 'invitations'>('clients');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // Fetch active clients with separate profile queries
      const { data: clientsData, error: clientsError } = await supabase
        .from('attorney_client_links')
        .select('*')
        .eq('attorney_id', user.id)
        .eq('status', 'active');

      if (clientsError) throw clientsError;

      // Get client profiles separately to avoid ambiguous joins
      const clientIds = clientsData?.map(link => link.client_id) || [];
      let clientProfiles: any[] = [];
      
      if (clientIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('id', clientIds);
        
        if (profilesError) throw profilesError;
        clientProfiles = profilesData || [];
      }

      // Transform client data by combining links with profiles
      const transformedClients = clientsData?.map(link => {
        const profile = clientProfiles.find(p => p.id === link.client_id);
        return {
          id: link.id,
          email: profile?.email || 'No email',
          name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown',
          relationship_type: link.relationship_type,
          status: link.status,
          created_at: link.created_at,
          // TODO: Add message counts and last message date
          unread_count: 0
        };
      }) || [];

      // Fetch pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('attorney_client_invitations')
        .select('*')
        .eq('attorney_id', user.id)
        .in('status', ['pending', 'expired']);

      if (invitationsError) throw invitationsError;

      setClients(transformedClients);
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: "Error loading clients",
        description: "Could not load client information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    try {
      // TODO: Implement resend invitation functionality
      toast({
        title: "Invitation resent",
        description: `New invitation sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error resending invitation",
        description: "Could not resend invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('attorney_client_invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation revoked",
        description: "The invitation has been revoked successfully.",
      });

      fetchData();
      onRefresh?.();
    } catch (error) {
      toast({
        title: "Error revoking invitation",
        description: "Could not revoke invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvitations = invitations.filter(invitation =>
    invitation.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invitation.client_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading clients...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'clients' ? 'default' : 'outline'}
            onClick={() => setActiveTab('clients')}
            size="sm"
          >
            <User className="h-4 w-4 mr-2" />
            Clients ({clients.length})
          </Button>
          <Button
            variant={activeTab === 'invitations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('invitations')}
            size="sm"
          >
            <Mail className="h-4 w-4 mr-2" />
            Invitations ({invitations.length})
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      {activeTab === 'clients' && (
        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No clients found. Start by inviting your first client!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {client.relationship_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        {format(new Date(client.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          {client.unread_count > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                              {client.unread_count}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invitations Table */}
      {activeTab === 'invitations' && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending invitations found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invitee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <Mail className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">{invitation.client_name}</p>
                            <p className="text-sm text-muted-foreground">{invitation.client_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        {format(new Date(invitation.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={new Date(invitation.expires_at) < new Date() ? 'text-destructive' : 'text-muted-foreground'}>
                          {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id, invitation.client_email)}
                          >
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeInvitation(invitation.id)}
                          >
                            Revoke
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}