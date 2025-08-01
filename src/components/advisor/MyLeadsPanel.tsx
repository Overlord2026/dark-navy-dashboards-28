import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Filter, 
  Search, 
  Clock, 
  User,
  MapPin,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  source: string;
  campaign_source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'meeting_scheduled' | 'proposal_sent' | 'closed_won' | 'closed_lost';
  created_at: string;
  last_contact_at?: string;
  assigned_at: string;
  notes?: string;
  lead_score?: number;
  follow_up_due?: boolean;
}

interface LeadAssignment {
  id: string;
  lead: Lead;
  assigned_at: string;
  status: string;
  notes?: string;
}

export function MyLeadsPanel() {
  const [leads, setLeads] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    meeting_scheduled: 'bg-purple-100 text-purple-800',
    proposal_sent: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-emerald-100 text-emerald-800',
    closed_lost: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    fetchMyLeads();
  }, []);

  const fetchMyLeads = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Get current user's advisor profile
      const { data: advisorProfile } = await supabase
        .from('advisor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!advisorProfile) {
        toast.error('Advisor profile not found');
        return;
      }

      // Fetch assigned leads
      const { data: assignments, error } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          assigned_at,
          status,
          notes,
          lead:leads (
            id,
            first_name,
            last_name,
            email,
            phone,
            location,
            source,
            campaign_source,
            status,
            created_at,
            last_contact_at,
            notes,
            lead_score
          )
        `)
        .eq('advisor_id', advisorProfile.id)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
        return;
      }

      // Add follow-up due calculation
      const leadsWithFollowUp = (assignments || []).map((assignment: any) => ({
        ...assignment,
        lead: {
          ...assignment.lead,
          follow_up_due: isFollowUpDue(assignment.lead.last_contact_at || assignment.lead.created_at)
        }
      }));

      setLeads(leadsWithFollowUp);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const isFollowUpDue = (lastContactDate: string): boolean => {
    const lastContact = new Date(lastContactDate);
    const now = new Date();
    const daysDiff = (now.getTime() - lastContact.getTime()) / (1000 * 3600 * 24);
    return daysDiff > 3;
  };

  const handleQuickAction = async (action: 'call' | 'email' | 'schedule', lead: Lead) => {
    try {
      switch (action) {
        case 'call':
          if (lead.phone) {
            window.open(`tel:${lead.phone}`, '_self');
            await updateLastContact(lead.id);
          } else {
            toast.error('No phone number available');
          }
          break;
        case 'email':
          window.open(`mailto:${lead.email}?subject=Following up on your inquiry`, '_blank');
          await updateLastContact(lead.id);
          break;
        case 'schedule':
          // Integration with calendar would go here
          toast.info('Calendar integration coming soon');
          break;
      }
    } catch (error) {
      console.error('Error performing quick action:', error);
      toast.error('Action failed');
    }
  };

  const updateLastContact = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ last_contact_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating last contact:', error);
        return;
      }

      // Update local state
      setLeads(prev => prev.map(assignment => 
        assignment.lead.id === leadId 
          ? {
              ...assignment,
              lead: {
                ...assignment.lead,
                last_contact_at: new Date().toISOString(),
                follow_up_due: false
              }
            }
          : assignment
      ));

      toast.success('Contact updated');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
        return;
      }

      // Update local state
      setLeads(prev => prev.map(assignment => 
        assignment.lead.id === leadId 
          ? {
              ...assignment,
              lead: {
                ...assignment.lead,
                status: newStatus as any
              }
            }
          : assignment
      ));

      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredAndSortedLeads = leads
    .filter(assignment => {
      const lead = assignment.lead;
      const matchesSearch = 
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchTerm));
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      const aValue = a.lead[sortBy as keyof Lead] || '';
      const bValue = b.lead[sortBy as keyof Lead] || '';
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const overduLeads = leads.filter(assignment => assignment.lead.follow_up_due).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading leads...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Leads
              <Badge variant="secondary">{filteredAndSortedLeads.length}</Badge>
              {overduLeads > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {overduLeads} Follow-up Due
                </Badge>
              )}
            </CardTitle>
          </div>
          <Button onClick={fetchMyLeads} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Added</SelectItem>
              <SelectItem value="last_contact_at">Last Contact</SelectItem>
              <SelectItem value="lead_score">Lead Score</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Leads Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLeads.map((assignment) => {
                const lead = assignment.lead;
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">
                            {lead.first_name} {lead.last_name}
                            {lead.follow_up_due && (
                              <AlertCircle className="inline h-4 w-4 text-red-500 ml-1" />
                            )}
                          </div>
                          {lead.location && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {lead.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{lead.email}</div>
                        {lead.phone && (
                          <div className="text-sm text-muted-foreground">{lead.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <Badge variant="outline">{lead.source}</Badge>
                        {lead.campaign_source && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {lead.campaign_source}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[lead.status]}>
                            {lead.status.replace('_', ' ')}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                          <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                          <SelectItem value="closed_won">Closed Won</SelectItem>
                          <SelectItem value="closed_lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    <TableCell>
                      {lead.lead_score && (
                        <Badge variant="outline">
                          {lead.lead_score}/100
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {lead.last_contact_at ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(lead.last_contact_at).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                        {lead.follow_up_due && (
                          <div className="text-xs text-red-600 font-medium">
                            Follow-up overdue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQuickAction('call', lead)}
                          disabled={!lead.phone}
                          title="Call lead"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQuickAction('email', lead)}
                          title="Email lead"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQuickAction('schedule', lead)}
                          title="Schedule meeting"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredAndSortedLeads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No leads found matching your criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}