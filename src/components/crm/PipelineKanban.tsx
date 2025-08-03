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
import familyOfficeIcons from '@/assets/family-office-icons.png';

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
  { id: 'new', name: 'New Leads', color: 'bg-muted border-border', icon: '🔍' },
  { id: 'contacted', name: 'Contacted', color: 'bg-warning/10 border-warning/30', icon: '📞' },
  { id: 'qualified', name: 'Qualified', color: 'bg-accent/10 border-accent/30', icon: '✅' },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-primary/10 border-primary/30', icon: '📋' },
  { id: 'negotiation', name: 'Negotiating', color: 'bg-secondary/10 border-secondary/30', icon: '🤝' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-success/10 border-success/30', icon: '🎉' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-destructive/10 border-destructive/30', icon: '❌' }
];

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
  isMobile: boolean;
}

function LeadCard({ lead, onEdit, onDelete, onStatusChange, isMobile }: LeadCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getValueColor = (value: number) => {
    if (value >= 200000) return 'text-success';
    if (value >= 100000) return 'text-warning';
    return 'text-muted-foreground';
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border animate-fade-in">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {lead.first_name} {lead.last_name}
          </h3>
          <Badge className={getScoreColor(lead.lead_score)} variant="outline">
            {lead.lead_score}
          </Badge>
        </div>
        
        {lead.company && (
          <p className="text-sm text-muted-foreground">{lead.company}</p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-semibold ${getValueColor(lead.lead_value)}`}>
            ${lead.lead_value.toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            {lead.lead_source}
          </Badge>
        </div>
        
        {lead.next_follow_up_due && (
          <div className={`text-xs flex items-center gap-1 ${
            isOverdue(lead.next_follow_up_due) ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            <Clock className="h-3 w-3" />
            Follow-up: {format(new Date(lead.next_follow_up_due), 'MMM d')}
          </div>
        )}

        {/* Mobile: Show fewer status options, Desktop: Show all */}
        <div className="flex flex-wrap gap-1 pt-2">
          {(isMobile ? ['contacted', 'proposal', 'closed_won'] : stages.map(s => s.id)).map((status) => (
            <Button
              key={status}
              variant={lead.lead_status === status ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2 touch-target"
              onClick={(e) => {
                e.stopPropagation();
                if (status !== lead.lead_status) {
                  onStatusChange(lead.id, status);
                }
              }}
            >
              {stages.find(s => s.id === status)?.icon || ''} {status.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lead);
            }}
            className="touch-target"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead.id);
            }}
            className="touch-target"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PipelineKanban() {
  const { toast } = useToast();
  const { triggerCelebration, celebration } = useCelebration();
  const { getLeadsWithScores, updateLeadStatus, updateLeadScoring, loading } = useLeadScoring();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedStage, setSelectedStage] = useState('new'); // For mobile tabs

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      // Use mock data for demo
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
        },
        {
          id: '3',
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael@example.com',
          phone: '+1-555-0125',
          company: 'Finance LLC',
          lead_source: 'linkedin',
          lead_value: 400000,
          lead_status: 'proposal',
          lead_score: 92,
          timeline_to_purchase: 'immediate',
          notes: 'High net worth client',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          last_contact_date: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      await updateLeadStatus(leadId, newStatus);
      
      // Trigger celebration for positive outcomes
      if (newStatus === 'closed_won') {
        triggerCelebration('client-won', `🎉 Deal closed! ${lead.first_name} ${lead.last_name} - $${lead.lead_value.toLocaleString()}`);
      } else if (newStatus === 'proposal') {
        triggerCelebration('milestone', `📋 Proposal sent to ${lead.first_name} ${lead.last_name}`);
      }

      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, lead_status: newStatus }
          : lead
      ));

      toast({
        title: "Lead Updated",
        description: `${lead.first_name} ${lead.last_name} moved to ${stages.find(s => s.id === newStatus)?.name}`,
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      setLeads(leads.filter(lead => lead.id !== leadId));
      toast({
        title: "Lead Deleted",
        description: "Lead has been removed from pipeline",
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const getLeadsForStage = (stageId: string) => {
    return leads.filter(lead => lead.lead_status === stageId);
  };

  const getTotalPipelineValue = () => {
    return leads.reduce((sum, lead) => sum + lead.lead_value, 0);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Mobile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sales Pipeline</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track leads through your sales process • ${getTotalPipelineValue().toLocaleString()} total value
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilterModal(true)}
            className="touch-target"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Mobile: Tabs for stages, Desktop: Kanban columns */}
      <div className="block md:hidden">
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
          {stages.map((stage) => (
            <Button
              key={stage.id}
              variant={selectedStage === stage.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStage(stage.id)}
              className="whitespace-nowrap touch-target"
            >
              <span className="mr-1">{stage.icon}</span>
              {stage.name}
              <Badge variant="secondary" className="ml-2">
                {getLeadsForStage(stage.id).length}
              </Badge>
            </Button>
          ))}
        </div>
        
        {/* Mobile stage content */}
        <div className="space-y-3">
          {getLeadsForStage(selectedStage).map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onStatusChange={handleStatusChange}
              isMobile={true}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Kanban Board */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 overflow-x-auto">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`rounded-lg border-2 p-4 min-h-[400px] ${stage.color} transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getLeadsForStage(stage.id).length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {getLeadsForStage(stage.id).map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                    onStatusChange={handleStatusChange}
                    isMobile={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration Animation */}
      {celebration.isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-celebration-pulse">🎉</div>
          {celebration.message && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20 
                          bg-success text-success-foreground px-6 py-3 rounded-lg font-semibold text-lg
                          animate-fade-in shadow-lg">
              {celebration.message}
            </div>
          )}
        </div>
      )}

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedLead?.first_name} {selectedLead?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>Score: <Badge variant="outline">{selectedLead.lead_score}</Badge></div>
                    <div className="font-medium text-primary">
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
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="touch-target">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="touch-target">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="touch-target">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}