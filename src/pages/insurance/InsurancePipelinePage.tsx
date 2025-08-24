import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Phone, FileText, CheckCircle } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  value: string;
  daysInStage: number;
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
}

const stages = [
  { id: 'new', title: 'New', color: 'bg-gray-100' },
  { id: 'ptc', title: 'PTC', color: 'bg-blue-100' },
  { id: 'soa', title: 'SOA', color: 'bg-yellow-100' },
  { id: 'call', title: 'Call', color: 'bg-orange-100' },
  { id: 'pecl', title: 'PECL', color: 'bg-purple-100' },
  { id: 'enroll', title: 'Enroll', color: 'bg-green-100' },
  { id: 'post-enroll', title: 'Post-enroll', color: 'bg-teal-100' }
];

const initialLeads: Record<string, Lead[]> = {
  new: [
    {
      id: '1',
      name: 'Patricia Wilson',
      email: 'patricia@email.com',
      phone: '555-0123',
      product: 'Medicare Supplement',
      value: '$2,400/yr',
      daysInStage: 1,
      priority: 'high',
      lastContact: '2024-12-20'
    }
  ],
  ptc: [
    {
      id: '2',
      name: 'Robert Smith',
      email: 'robert@email.com',
      phone: '555-0456',
      product: 'Medicare Advantage',
      value: '$1,800/yr',
      daysInStage: 3,
      priority: 'medium',
      lastContact: '2024-12-18'
    }
  ],
  soa: [],
  call: [
    {
      id: '3',
      name: 'Mary Johnson',
      email: 'mary@email.com',
      phone: '555-0789',
      product: 'Part D',
      value: '$600/yr',
      daysInStage: 2,
      priority: 'medium',
      lastContact: '2024-12-19'
    }
  ],
  pecl: [],
  enroll: [],
  'post-enroll': []
};

export const InsurancePipelinePage: React.FC = () => {
  const [leads, setLeads] = useState(initialLeads);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = leads[source.droppableId];
    const destColumn = leads[destination.droppableId];
    const draggedLead = sourceColumn.find(lead => lead.id === draggableId);

    if (!draggedLead) return;

    // Remove from source
    const newSourceColumn = sourceColumn.filter(lead => lead.id !== draggableId);
    
    // Add to destination
    const newDestColumn = [...destColumn];
    newDestColumn.splice(destination.index, 0, { ...draggedLead, daysInStage: 0 });

    setLeads({
      ...leads,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn
    });

    // Track analytics
    console.log('[Analytics] pipeline.stage.change', {
      lead_id: draggableId,
      from_stage: source.droppableId,
      to_stage: destination.droppableId
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getStageTotal = (stageId: string) => {
    return leads[stageId]?.reduce((sum, lead) => {
      const value = parseFloat(lead.value.replace(/[$,\/yr]/g, ''));
      return sum + value;
    }, 0) || 0;
  };

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Medicare Pipeline</h1>
        <div className="flex gap-2">
          <Badge variant="outline">
            Total Value: ${Object.values(leads).flat().reduce((sum, lead) => {
              const value = parseFloat(lead.value.replace(/[$,\/yr]/g, ''));
              return sum + value;
            }, 0).toLocaleString()}
          </Badge>
          <Badge variant="outline">
            Active Leads: {Object.values(leads).flat().length}
          </Badge>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {leads[stage.id]?.length || 0}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${getStageTotal(stage.id).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-3 p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? stage.color : 'bg-transparent'
                        }`}
                      >
                        {leads[stage.id]?.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-move transition-shadow hover:shadow-md ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                } ${getPriorityColor(lead.priority)}`}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium text-sm">{lead.name}</h4>
                                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">{lead.product}</span>
                                      <span className="font-medium">{lead.value}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">
                                        {lead.daysInStage} days in stage
                                      </span>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          lead.priority === 'high' ? 'text-red-600' :
                                          lead.priority === 'medium' ? 'text-yellow-600' :
                                          'text-green-600'
                                        }`}
                                      >
                                        {lead.priority}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex gap-1 pt-2">
                                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                        <Phone className="h-3 w-3 mr-1" />
                                        Call
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                        <FileText className="h-3 w-3 mr-1" />
                                        SOA
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        PECL
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};