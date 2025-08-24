import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Calendar, DollarSign, User, Search, Filter } from 'lucide-react';
import { useLeads, useUpdateLead, type Lead } from '@/hooks/useLeads';
import { recordDecisionRDS } from '@/lib/rds';
import { recordReceipt } from '@/features/receipts/record';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const PIPELINE_STAGES = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-500' },
  { id: 'meeting', name: 'Meeting', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-red-500' }
];

interface PipelineBoardProps {
  searchTerm?: string;
  tagFilter?: string;
  campaignFilter?: string;
}

export function PipelineBoard({ searchTerm = '', tagFilter = '', campaignFilter = '' }: PipelineBoardProps) {
  const { data: allLeads = [], isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const { toast } = useToast();

  // Filter leads based on search and filters
  const filteredLeads = allLeads.filter(lead => {
    const matchesSearch = !searchTerm || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !tagFilter || lead.lead_source === tagFilter;
    const matchesCampaign = !campaignFilter || lead.campaign_id === campaignFilter;
    
    return matchesSearch && matchesTag && matchesCampaign;
  });

  // Group leads by stage
  const leadsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter(lead => 
      (lead.lead_status || 'new') === stage.id
    );
    return acc;
  }, {} as Record<string, Lead[]>);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const leadId = draggableId;
    const fromStage = source.droppableId;
    const toStage = destination.droppableId;

    // Find the lead being moved
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      // Record Decision-RDS for audit trail
      const decisionPayload = {
        action: 'stage_change',
        lead_id: leadId,
        lead_name: `${lead.first_name} ${lead.last_name}`,
        from_stage: fromStage,
        to_stage: toStage,
        actor_id: 'current_user', // Should be from auth context
        timestamp: new Date().toISOString()
      };

      const rdsRecord = recordDecisionRDS(decisionPayload);
      
      // Store the receipt
      recordReceipt({
        id: `decision-${Date.now()}`,
        type: 'Decision-RDS',
        timestamp: rdsRecord.timestamp,
        payload: decisionPayload,
        inputs_hash: rdsRecord.inputs_hash,
        policy_version: rdsRecord.policy_version
      });

      // Update lead status in database
      await updateLead.mutateAsync({ 
        id: leadId, 
        updates: { lead_status: toStage } 
      });

      toast({
        title: "Stage Updated",
        description: `${lead.first_name} ${lead.last_name} moved to ${PIPELINE_STAGES.find(s => s.id === toStage)?.name}`
      });

    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast({
        title: "Error",
        description: "Failed to update lead stage",
        variant: "destructive"
      });
    }
  }, [allLeads, updateLead, toast]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatValue = (value?: number) => {
    if (!value) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-lg">{stage.name}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {leadsByStage[stage.id]?.length || 0}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Value: {formatValue(
                  leadsByStage[stage.id]?.reduce((sum, lead) => sum + (lead.lead_value || 0), 0)
                )}
              </div>
            </div>

            <Droppable droppableId={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-96 p-2 rounded-lg transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-muted/50 border-2 border-dashed border-primary' 
                      : 'bg-muted/20'
                  }`}
                >
                  <div className="space-y-3">
                    {leadsByStage[stage.id]?.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-shadow cursor-grab ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(lead.first_name, lead.last_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {lead.first_name} {lead.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {lead.lead_source}
                                    </div>
                                  </div>
                                </div>
                                {lead.lead_value && (
                                  <Badge variant="outline" className="text-xs">
                                    {formatValue(lead.lead_value)}
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-2">
                                {lead.email && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>
                                )}
                                {lead.phone && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{lead.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(lead.created_at), 'MMM dd')}</span>
                                </div>
                              </div>

                              {lead.notes && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                  {lead.notes.slice(0, 100)}
                                  {lead.notes.length > 100 && '...'}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}