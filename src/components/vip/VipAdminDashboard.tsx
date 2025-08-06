import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Send, Eye, CheckCircle, AlertCircle, Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { VipInvite, PERSONA_DISPLAY_NAMES, INVITE_STATUS_COLORS } from '@/types/vip';

export const VipAdminDashboard: React.FC = () => {
  const [invites, setInvites] = useState<VipInvite[]>([]);
  const [filteredInvites, setFilteredInvites] = useState<VipInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    filterInvites();
  }, [invites, searchTerm, selectedPersona, selectedStatus]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('vip_invites' as any).select('*');
      
      if (selectedPersona !== 'all') {
        query = query.eq('persona_type', selectedPersona);
      }
      if (selectedStatus !== 'all') {
        query = query.eq('invite_status', selectedStatus);
      }
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,firm.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const vipInvites = (data as unknown as VipInvite[]) || [];
      setInvites(vipInvites);
      setFilteredInvites(vipInvites);
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error('Failed to load VIP invites');
    } finally {
      setLoading(false);
    }
  };

  const filterInvites = () => {
    let filtered = invites;

    if (searchTerm) {
      filtered = filtered.filter(invite => 
        invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.firm?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPersona !== 'all') {
      filtered = filtered.filter(invite => invite.persona_type === selectedPersona);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(invite => invite.invite_status === selectedStatus);
    }

    setFilteredInvites(filtered);
  };

  const getStats = () => {
    const total = invites.length;
    const pending = invites.filter(i => i.invite_status === 'pending').length;
    const sent = invites.filter(i => i.invite_status === 'sent').length;
    const viewed = invites.filter(i => i.invite_status === 'viewed').length;
    const activated = invites.filter(i => i.invite_status === 'activated').length;

    return { total, pending, sent, viewed, activated };
  };

  const stats = getStats();

  const handleSendInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('vip_invites' as any)
        .update({ 
          invite_status: 'sent',
          // sent_at: new Date().toISOString() 
        })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Invite sent successfully!');
      fetchInvites();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invite');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VIP Campaign Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your VIP founding member invitations
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold/90 text-navy">
          <Plus className="h-4 w-4 mr-2" />
          Add VIP Invite
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Invites</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Sent</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Viewed</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.viewed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Activated</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.activated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, firm, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                <SelectItem value="family_office">Family Office</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
                <SelectItem value="attorney">Attorney</SelectItem>
                <SelectItem value="cpa">CPA</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="activated">Activated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invites Table */}
      <Card>
        <CardHeader>
          <CardTitle>VIP Invitations ({filteredInvites.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Firm</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">{invite.name}</TableCell>
                  <TableCell>{invite.firm}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PERSONA_DISPLAY_NAMES[invite.persona_type as keyof typeof PERSONA_DISPLAY_NAMES]}
                    </Badge>
                  </TableCell>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <Badge className={INVITE_STATUS_COLORS[invite.invite_status as keyof typeof INVITE_STATUS_COLORS]}>
                      {invite.invite_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invite.batch_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invite.invite_status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendInvite(invite.id)}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/vip/invite/${invite.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInvites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No VIP invites found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};