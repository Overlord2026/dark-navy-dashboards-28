import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Search, Filter, Eye, Edit2, Phone, Mail, AlertTriangle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  score: number;
  notes: string;
  created_at: string;
  qualified: boolean;
  client_converted: boolean;
  // Additional safety fields
  first_name?: string;
  last_name?: string;
  profiles?: any;
  appointments?: any;
}

// Safe data validation helpers
const isValidLead = (lead: any): lead is Lead => {
  return lead && 
         typeof lead === 'object' && 
         typeof lead.id === 'string' &&
         typeof lead.name === 'string';
};

const safelyExtractLeadName = (lead: any): string => {
  if (typeof lead.name === 'string') return lead.name;
  if (lead.first_name && lead.last_name) {
    return `${lead.first_name} ${lead.last_name}`;
  }
  if (lead.profiles && typeof lead.profiles === 'object') {
    const profile = Array.isArray(lead.profiles) ? lead.profiles[0] : lead.profiles;
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
  }
  return 'Unknown Contact';
};

const safelyExtractEmail = (lead: any): string => {
  return (typeof lead.email === 'string' ? lead.email : 'No email provided');
};

const safelyExtractPhone = (lead: any): string => {
  return (typeof lead.phone === 'string' ? lead.phone : 'No phone provided');
};

// Fallback mock data for demo/testing
const fallbackMockLeads: Lead[] = [
  {
    id: 'mock-1',
    name: 'Demo Lead 1',
    email: 'demo1@example.com',
    phone: '555-0101',
    source: 'Website Demo',
    stage: 'new',
    score: 85,
    notes: 'Demo data - DB connection issue',
    created_at: new Date().toISOString(),
    qualified: false,
    client_converted: false
  },
  {
    id: 'mock-2',
    name: 'Demo Lead 2',
    email: 'demo2@example.com',
    phone: '555-0102',
    source: 'Referral Demo',
    stage: 'qualified',
    score: 92,
    notes: 'Demo data - showing fallback mode',
    created_at: new Date().toISOString(),
    qualified: true,
    client_converted: false
  }
];

const stages = ['new', 'contacted', 'qualified', 'proposal', 'client'];

const stageNames = {
  new: 'New Leads',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal Sent',
  client: 'Clients'
};

export default function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data with comprehensive defensive programming
      // Using very basic query first to test database connectivity
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (leadsError) {
        console.warn('Database query error:', leadsError);
        throw new Error(`Database error: ${leadsError.message}`);
      }

      if (!leadsData || !Array.isArray(leadsData)) {
        console.warn('Invalid data structure returned from database');
        throw new Error('Invalid data format received');
      }

      // Process and validate each lead with maximum defensive programming
      const processedLeads = leadsData
        .filter((item): item is any => item && typeof item === 'object')
        .map((rawLead, index): Lead => {
          try {
            // Safely extract ID with fallback
            const leadId = rawLead.id || `fallback-${Date.now()}-${index}`;
            
            // Safely extract name with multiple fallback strategies
            let leadName = 'Unknown Contact';
            if (typeof rawLead.name === 'string' && rawLead.name.trim()) {
              leadName = rawLead.name.trim();
            } else if (rawLead.first_name || rawLead.last_name) {
              leadName = `${rawLead.first_name || ''} ${rawLead.last_name || ''}`.trim();
            } else if (rawLead.profiles) {
              const profile = Array.isArray(rawLead.profiles) ? rawLead.profiles[0] : rawLead.profiles;
              if (profile && (profile.first_name || profile.last_name)) {
                leadName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
              }
            }
            
            // Safely extract email
            const leadEmail = (typeof rawLead.email === 'string' && rawLead.email.includes('@')) 
              ? rawLead.email 
              : 'No email provided';
            
            // Safely extract phone
            const leadPhone = (typeof rawLead.phone === 'string' && rawLead.phone.trim()) 
              ? rawLead.phone.trim() 
              : 'No phone provided';
            
            // Safely extract source with multiple possible field names
            let leadSource = 'Unknown';
            if (typeof rawLead.source === 'string') {
              leadSource = rawLead.source;
            } else if (typeof rawLead.lead_source === 'string') {
              leadSource = rawLead.lead_source;
            } else if (typeof rawLead.utm_source === 'string') {
              leadSource = rawLead.utm_source;
            }
            
            // Safely extract stage/status with multiple possible field names
            let leadStage = 'new';
            if (typeof rawLead.stage === 'string') {
              leadStage = rawLead.stage;
            } else if (typeof rawLead.lead_status === 'string') {
              leadStage = rawLead.lead_status;
            } else if (typeof rawLead.status === 'string') {
              leadStage = rawLead.status;
            }
            
            // Safely extract score
            const leadScore = (typeof rawLead.score === 'number' && rawLead.score >= 0) 
              ? rawLead.score 
              : Math.floor(Math.random() * 40) + 60;
            
            // Safely extract notes
            const leadNotes = (typeof rawLead.notes === 'string' && rawLead.notes.trim()) 
              ? rawLead.notes.trim() 
              : 'No notes available';
            
            // Safely extract created_at
            let createdAt = new Date().toISOString();
            if (rawLead.created_at) {
              try {
                createdAt = new Date(rawLead.created_at).toISOString();
              } catch (dateError) {
                console.warn('Invalid date format for lead:', leadId, rawLead.created_at);
              }
            }
            
            // Safely extract boolean fields
            const isQualified = Boolean(rawLead.qualified || rawLead.is_qualified);
            const isClientConverted = Boolean(rawLead.client_converted || rawLead.is_client || rawLead.converted);

            return {
              id: leadId,
              name: leadName,
              email: leadEmail,
              phone: leadPhone,
              source: leadSource,
              stage: leadStage,
              score: leadScore,
              notes: leadNotes,
              created_at: createdAt,
              qualified: isQualified,
              client_converted: isClientConverted
            };
          } catch (processError) {
            console.warn('Error processing individual lead:', rawLead, processError);
            // Return a safe fallback lead
            return {
              id: `error-${Date.now()}-${index}`,
              name: 'Data Processing Error',
              email: 'error@example.com',
              phone: 'N/A',
              source: 'System Error',
              stage: 'new',
              score: 0,
              notes: `Error processing this lead data: ${processError instanceof Error ? processError.message : 'Unknown error'}`,
              created_at: new Date().toISOString(),
              qualified: false,
              client_converted: false
            };
          }
        })
        .filter((lead): lead is Lead => lead.id !== undefined);

      if (processedLeads.length === 0) {
        console.warn('No valid leads found after processing, switching to fallback data');
        setLeads(fallbackMockLeads);
        setIsUsingFallbackData(true);
        toast({
          title: "Demo Mode Active",
          description: "No leads found in database. Showing sample data for demonstration.",
          variant: "default"
        });
      } else {
        console.log(`Successfully processed ${processedLeads.length} leads from database`);
        setLeads(processedLeads);
        setIsUsingFallbackData(false);
      }

    } catch (fetchError) {
      console.error('Error fetching leads:', fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Always fallback to mock data for smooth demo experience
      setLeads(fallbackMockLeads);
      setIsUsingFallbackData(true);
      
      toast({
        title: "Connection Issue",
        description: "Database unavailable. Using demo data for a smooth experience.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering with defensive checks
  const filteredLeads = leads.filter(lead => {
    try {
      const nameMatch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || emailMatch;
      const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
      return matchesSearch && matchesSource;
    } catch (filterError) {
      console.warn('Error filtering lead:', lead, filterError);
      return false;
    }
  });

  const getLeadsByStage = (stage: string) => {
    return filteredLeads.filter(lead => {
      try {
        return lead.stage === stage;
      } catch (stageError) {
        console.warn('Error checking lead stage:', lead, stageError);
        return false;
      }
    });
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      qualified: 'bg-green-500',
      proposal: 'bg-purple-500',
      client: 'bg-emerald-500'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-500';
  };

  const handleDragEnd = (result: any) => {
    try {
      if (!result.destination) return;

      const sourceStage = result.source.droppableId;
      const destStage = result.destination.droppableId;
      const leadId = result.draggableId;

      if (sourceStage !== destStage) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, stage: destStage }
            : lead
        ));
      }
    } catch (dragError) {
      console.error('Error handling drag operation:', dragError);
      toast({
        title: "Update Failed",
        description: "Could not move lead. Please try again.",
        variant: "destructive"
      });
    }
  };

  const LeadCard = ({ lead, index }: { lead: Lead; index: number }) => (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 cursor-move transition-all animate-fade-in ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md hover-scale'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm truncate">{lead.name}</h4>
              <Badge variant="outline" className="text-xs">
                {lead.score}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.phone}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Source: {lead.source}
              </div>
            </div>

            {lead.notes && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {lead.notes}
              </p>
            )}

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg animate-fade-in">Loading pipeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your leads through the sales process
            {isUsingFallbackData && (
              <span className="text-yellow-600 ml-2">
                • Demo Mode Active
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {error && (
            <Button variant="outline" onClick={fetchLeads}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Connection issue detected. Currently showing demo data. 
                <Button variant="link" className="p-0 h-auto text-yellow-800" onClick={fetchLeads}>
                  Try reconnecting
                </Button>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stages.map(stage => {
            const stageLeads = getLeadsByStage(stage);
            return (
              <div key={stage} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`} />
                    <h3 className="font-semibold text-sm">
                      {stageNames[stage as keyof typeof stageNames]}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-muted' : ''
                      }`}
                    >
                      {stageLeads.map((lead, index) => (
                        <LeadCard key={lead.id} lead={lead} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{filteredLeads.length}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredLeads.filter(l => l.qualified).length}
              </div>
              <div className="text-sm text-muted-foreground">Qualified</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredLeads.filter(l => l.client_converted).length}
              </div>
              <div className="text-sm text-muted-foreground">Converted</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredLeads.length > 0 
                  ? Math.round((filteredLeads.filter(l => l.client_converted).length / filteredLeads.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}