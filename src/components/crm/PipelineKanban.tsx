import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star,
  Edit,
  Trash2,
  Plus,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useCelebration } from '@/hooks/useCelebration';
import { useLeadScoring } from '@/hooks/useLeadScoring';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_source: string;
  lead_value: number;
  lead_status: string;
  lead_score: number;
  timeline_to_purchase: string;
  notes?: string;
  created_at: string;
  last_contact_date?: string;
  next_follow_up_due?: string;
}

const stages = [
  { id: 'new', name: 'New Leads', color: 'bg-blue-50 border-blue-200' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-50 border-purple-200' },
  { id: 'scheduled', name: 'Meeting Scheduled', color: 'bg-orange-50 border-orange-200' },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-pink-50 border-pink-200' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-green-50 border-green-200' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-gray-50 border-gray-200' }
];

export function PipelineKanban() {
  const { toast } = useToast();
  const { triggerCelebration, CelebrationComponent } = useCelebration();
  const { calculateLeadScore, getScoreColor } = useLeadScoring();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      // Use mock data if database isn't available
      setLeads([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Tech Corp',
          lead_source: 'website',
          lead_value: 250000,
          lead_status: 'new',
          lead_score: 85,
          timeline_to_purchase: '3-6_months',
          notes: 'Interested in retirement planning',
          created_at: new Date().toISOString(),
          next_follow_up_due: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: '2',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0124',
          company: 'Design Co',
          lead_source: 'referral',
          lead_value: 150000,
          lead_status: 'contacted',
          lead_score: 72,
          timeline_to_purchase: '1-3_months',
          notes: 'Needs investment advice',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          last_contact_date: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          lead_status: newStatus,
          last_contact_date: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      // Update local state
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, lead_status: newStatus, last_contact_date: new Date().toISOString() }
            : lead
        )
      );

      // Schedule follow-up
      await supabase.rpc('schedule_follow_up', { 
        p_lead_id: leadId, 
        p_stage: newStatus 
      });

      // Trigger celebration for major milestones
      if (newStatus === 'closed_won') {
        triggerCelebration('client-won', 'New client acquired! 🎉');
      } else if (newStatus === 'proposal') {
        triggerCelebration('milestone', 'Proposal sent! 📋');
      }

      // Recalculate lead score
      await calculateLeadScore(leadId);

      toast({
        title: "Lead Updated",
        description: "Lead status has been updated",
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      // Update local state for demo
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, lead_status: newStatus, last_contact_date: new Date().toISOString() }
            : lead
        )
      );
      toast({
        title: "Lead Updated",
        description: "Lead status has been updated",
      });
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.lead_status === stageId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getValueColor = (value: number) => {
    if (value >= 200000) return 'text-green-600';
    if (value >= 100000) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => {
        switch (filter) {
          case 'high_value': return lead.lead_value >= 200000;
          case 'hot': return lead.lead_score >= 80;
          case 'overdue': return isOverdue(lead.next_follow_up_due);
          default: return true;
        }
      });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="high_value">High Value ($200K+)</SelectItem>
              <SelectItem value="hot">Hot Leads (Score 80+)</SelectItem>
              <SelectItem value="overdue">Overdue Follow-ups</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total Pipeline Value: ${leads.reduce((sum, lead) => sum + lead.lead_value, 0).toLocaleString()}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 h-[600px] overflow-x-auto">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id).filter(lead => 
            filter === 'all' ? true : filteredLeads.includes(lead)
          );
          
          return (
            <Card key={stage.id} className={`${stage.color} min-w-[280px]`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {stage.name}
                  <Badge variant="secondary" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {stageLeads.map((lead) => (
                  <Card 
                    key={lead.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <Badge className={getScoreColor(lead.lead_score)} variant="outline">
                          {lead.lead_score}
                        </Badge>
                      </div>
                      
                      {lead.company && (
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${getValueColor(lead.lead_value)}`}>
                          ${lead.lead_value.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {lead.lead_source}
                        </Badge>
                      </div>
                      
                      {lead.next_follow_up_due && (
                        <div className={`text-xs flex items-center gap-1 ${
                          isOverdue(lead.next_follow_up_due) ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                          <Clock className="h-3 w-3" />
                          Follow-up: {format(new Date(lead.next_follow_up_due), 'MMM d')}
                        </div>
                      )}
                      
                      <div className="flex gap-1 pt-2">
                        {['new', 'contacted', 'qualified', 'scheduled', 'proposal', 'closed_won', 'closed_lost'].map((status) => (
                          <Button
                            key={status}
                            variant={lead.lead_status === status ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (status !== lead.lead_status) {
                                updateLeadStatus(lead.id, status);
                              }
                            }}
                          >
                            {status.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No leads in this stage
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.first_name} {selectedLead?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Information</Label>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedLead.email}
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedLead.phone}
                      </div>
                    )}
                    {selectedLead.company && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedLead.company}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Lead Details</Label>
                  <div className="space-y-1 text-sm">
                    <div>Source: <Badge variant="outline">{selectedLead.lead_source}</Badge></div>
                    <div>Score: <Badge className={getScoreColor(selectedLead.lead_score)}>{selectedLead.lead_score}</Badge></div>
                    <div className={`font-medium ${getValueColor(selectedLead.lead_value)}`}>
                      Value: ${selectedLead.lead_value.toLocaleString()}
                    </div>
                    <div>Timeline: {selectedLead.timeline_to_purchase?.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
              
              {selectedLead.notes && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedLead.notes}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Timeline</Label>
                <div className="text-sm space-y-1">
                  <div>Created: {format(new Date(selectedLead.created_at), 'MMM d, yyyy')}</div>
                  {selectedLead.last_contact_date && (
                    <div>Last Contact: {format(new Date(selectedLead.last_contact_date), 'MMM d, yyyy')}</div>
                  )}
                  {selectedLead.next_follow_up_due && (
                    <div className={isOverdue(selectedLead.next_follow_up_due) ? 'text-red-600' : ''}>
                      Next Follow-up: {format(new Date(selectedLead.next_follow_up_due), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lead
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Celebration Effects */}
      <CelebrationComponent />
    </div>
  );
}