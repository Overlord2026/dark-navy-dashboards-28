import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Filter, Search, Calendar, DollarSign, User, Building, Phone, Mail, Trophy, Target } from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  lead_value: number;
  lead_source: string;
  lead_status: string;
  campaign_id?: string;
  agency_id?: string;
  advisor_id?: string;
  qualified: boolean;
  created_at: string;
  appt_1_scheduled?: string;
  appt_1_attended?: boolean;
  appt_2_scheduled?: string;
  appt_2_attended?: boolean;
  appt_3_scheduled?: string;
  appt_3_attended?: boolean;
  client_converted: boolean;
  campaigns?: { campaign_name: string };
  marketing_agencies?: { name: string };
  profiles?: { first_name: string; last_name: string };
}

interface PipelineColumn {
  id: string;
  title: string;
  leads: Lead[];
  color: string;
}

const PIPELINE_STAGES = [
  { id: 'new', title: 'New', color: 'bg-navy' },
  { id: 'contacted', title: 'Contacted', color: 'bg-gold' },
  { id: 'qualified', title: 'Qualified', color: 'bg-emerald' },
  { id: 'scheduled', title: 'Scheduled', color: 'bg-primary' },
  { id: 'closed', title: 'Closed', color: 'bg-success' },
];

export const PipelineBoard: React.FC = () => {
  const [columns, setColumns] = useState<PipelineColumn[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    advisor: '',
    campaign: '',
    agency: '',
    search: '',
  });
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const { toast } = useToast();
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  useEffect(() => {
    fetchData();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    organizeLeadsByStage();
  }, [leads, filters]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          campaigns:campaign_id (campaign_name),
          marketing_agencies:agency_id (name),
          profiles:advisor_id (first_name, last_name),
          appointments!leads_appointments_lead_id_fkey (
            appt_1_scheduled,
            appt_1_attended,
            appt_2_scheduled,
            appt_2_attended,
            appt_3_scheduled,
            appt_3_attended
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Merge appointment data into leads
      const leadsWithAppointments = data?.map(lead => {
        const appointment = lead.appointments?.[0];
        return {
          ...lead,
          name: lead.first_name + ' ' + lead.last_name,
          qualified: lead.lead_status === 'qualified',
          client_converted: lead.lead_status === 'client',
          appt_1_scheduled: appointment?.appt_1_scheduled || false,
          appt_1_attended: appointment?.appt_1_attended || false,
          appt_2_scheduled: appointment?.appt_2_scheduled || false,
          appt_2_attended: appointment?.appt_2_attended || false,
          appt_3_scheduled: appointment?.appt_3_scheduled || false,
          appt_3_attended: appointment?.appt_3_attended || false,
        };
      }) || [];

      setLeads(leadsWithAppointments);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [advisorsRes, campaignsRes, agenciesRes] = await Promise.all([
        supabase.from('advisor_profiles').select('id, name, user_id').eq('is_active', true),
        supabase.from('marketing_campaigns').select('id, campaign_name').eq('status', 'active'),
        supabase.from('marketing_agencies').select('id, name').eq('status', 'approved'),
      ]);

      setAdvisors(advisorsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setAgencies(agenciesRes.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const organizeLeadsByStage = () => {
    const filteredLeads = leads.filter(lead => {
      const matchesSource = !filters.source || lead.lead_source === filters.source;
      const matchesAdvisor = !filters.advisor || lead.advisor_id === filters.advisor;
      const matchesCampaign = !filters.campaign || lead.campaign_id === filters.campaign;
      const matchesAgency = !filters.agency || lead.agency_id === filters.agency;
      const matchesSearch = !filters.search || 
        lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.search.toLowerCase());

      return matchesSource && matchesAdvisor && matchesCampaign && matchesAgency && matchesSearch;
    });

    const newColumns = PIPELINE_STAGES.map(stage => ({
      id: stage.id,
      title: stage.title,
      color: stage.color,
      leads: filteredLeads.filter(lead => lead.lead_status === stage.id),
    }));

    setColumns(newColumns);
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const lead = leads.find(l => l.id === draggableId);
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ lead_status: destination.droppableId })
        .eq('id', draggableId);

      if (error) throw error;

      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(l =>
          l.id === draggableId ? { ...l, lead_status: destination.droppableId } : l
        )
      );

      // Check for celebration triggers
      if (destination.droppableId === 'closed' && lead.client_converted) {
        triggerCelebration('client-won', 'Client Won! 🎉');
      } else if (destination.droppableId === 'qualified') {
        triggerCelebration('pipeline-goal', 'Lead Qualified! 🎯');
      }

      toast({
        title: "Lead Updated",
        description: `Lead moved to ${PIPELINE_STAGES.find(s => s.id === destination.droppableId)?.title}`,
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive",
      });
    }
  };

  const getAppointmentCounts = (lead: Lead) => {
    const counts = { scheduled: 0, attended: 0 };
    
    if (lead.appt_1_scheduled) counts.scheduled++;
    if (lead.appt_1_attended) counts.attended++;
    if (lead.appt_2_scheduled) counts.scheduled++;
    if (lead.appt_2_attended) counts.attended++;
    if (lead.appt_3_scheduled) counts.scheduled++;
    if (lead.appt_3_attended) counts.attended++;

    return counts;
  };

  const LeadCard: React.FC<{ lead: Lead; index: number }> = ({ lead, index }) => {
    const appointmentCounts = getAppointmentCounts(lead);

    return (
      <Draggable draggableId={lead.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 cursor-pointer transition-shadow ${
              snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium">{lead.name}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Mail className="w-3 h-3" />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {lead.phone}
                  </div>
                </div>
                <Badge variant={lead.qualified ? "default" : "secondary"} className="text-xs">
                  {lead.qualified ? "Qualified" : "Unqualified"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-medium">${lead.lead_value?.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{lead.lead_source}</span>
                </div>

                {lead.campaigns && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{lead.campaigns.campaign_name}</span>
                  </div>
                )}

                {lead.marketing_agencies && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>{lead.marketing_agencies.name}</span>
                  </div>
                )}

                {appointmentCounts.scheduled > 0 && (
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {appointmentCounts.attended}/{appointmentCounts.scheduled} appts
                    </Badge>
                    {lead.appt_1_scheduled && (
                      <Badge variant={lead.appt_1_attended ? "default" : "secondary"} className="text-xs">
                        1st
                      </Badge>
                    )}
                    {lead.appt_2_scheduled && (
                      <Badge variant={lead.appt_2_attended ? "default" : "secondary"} className="text-xs">
                        2nd
                      </Badge>
                    )}
                    {lead.appt_3_scheduled && (
                      <Badge variant={lead.appt_3_attended ? "default" : "secondary"} className="text-xs">
                        3rd
                      </Badge>
                    )}
                  </div>
                )}

                {lead.client_converted && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Client Won
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading pipeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <CelebrationComponent /> */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">Lead Pipeline</h1>
          <p className="text-muted-foreground">Manage your leads through the sales funnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.advisor} onValueChange={(value) => setFilters(prev => ({ ...prev, advisor: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Advisors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Advisors</SelectItem>
                {advisors.map((advisor) => (
                  <SelectItem key={advisor.id} value={advisor.user_id}>
                    {advisor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.campaign} onValueChange={(value) => setFilters(prev => ({ ...prev, campaign: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Campaigns</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.campaign_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.agency} onValueChange={(value) => setFilters(prev => ({ ...prev, agency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Agencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Agencies</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({ source: '', advisor: '', campaign: '', agency: '', search: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  {column.title}
                </h3>
                <Badge variant="secondary">{column.leads.length}</Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/5' : ''
                    }`}
                  >
                    {column.leads.map((lead, index) => (
                      <LeadCard key={lead.id} lead={lead} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};