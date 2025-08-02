import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Plus, DollarSign, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface PipelineItem {
  id: string;
  contact_name: string;
  contact_email: string;
  stage_id: string;
  value?: number;
  probability?: number;
  expected_close?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const defaultStages: PipelineStage[] = [
  { id: 'lead', name: 'New Leads', color: 'bg-gray-100', order: 1 },
  { id: 'qualified', name: 'Qualified', color: 'bg-yellow-100', order: 2 },
  { id: 'meeting', name: 'Meeting Scheduled', color: 'bg-blue-100', order: 3 },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-purple-100', order: 4 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100', order: 5 },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-green-100', order: 6 },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-100', order: 7 }
];

export function PipelineManager() {
  const { user } = useAuth();
  const [stages] = useState<PipelineStage[]>(defaultStages);
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('lead');
  const [newItem, setNewItem] = useState({
    contact_name: '',
    contact_email: '',
    value: '',
    probability: '',
    expected_close: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchPipelineItems();
    }
  }, [user]);

  const fetchPipelineItems = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_pipeline_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPipelineItems(data || []);
    } catch (error) {
      console.error('Error fetching pipeline items:', error);
      toast.error('Failed to load pipeline items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const itemData = {
        ...newItem,
        stage_id: selectedStage,
        value: newItem.value ? parseFloat(newItem.value) : null,
        probability: newItem.probability ? parseInt(newItem.probability) : null,
        user_id: user?.id
      };

      const { error } = await supabase
        .from('crm_pipeline_items')
        .insert([itemData]);

      if (error) throw error;

      toast.success('Pipeline item added successfully');
      setIsAddDialogOpen(false);
      setNewItem({
        contact_name: '',
        contact_email: '',
        value: '',
        probability: '',
        expected_close: '',
        notes: ''
      });
      fetchPipelineItems();
    } catch (error) {
      console.error('Error adding pipeline item:', error);
      toast.error('Failed to add pipeline item');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      const { error } = await supabase
        .from('crm_pipeline_items')
        .update({ stage_id: destination.droppableId })
        .eq('id', draggableId);

      if (error) throw error;

      // Update local state
      setPipelineItems(prev => prev.map(item => 
        item.id === draggableId 
          ? { ...item, stage_id: destination.droppableId }
          : item
      ));

      toast.success('Pipeline item moved successfully');
    } catch (error) {
      console.error('Error moving pipeline item:', error);
      toast.error('Failed to move pipeline item');
    }
  };

  const getItemsByStage = (stageId: string) => 
    pipelineItems.filter(item => item.stage_id === stageId);

  const formatCurrency = (value?: number) => 
    value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value) : '';

  if (loading) {
    return <div className="flex justify-center p-8">Loading pipeline...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Pipeline</h2>
          <p className="text-muted-foreground">Track deals through your sales process</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_name">Contact Name *</Label>
                <Input
                  id="contact_name"
                  value={newItem.contact_name}
                  onChange={(e) => setNewItem({...newItem, contact_name: e.target.value})}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={newItem.contact_email}
                  onChange={(e) => setNewItem({...newItem, contact_email: e.target.value})}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="stage">Pipeline Stage</Label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Deal Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={newItem.value}
                  onChange={(e) => setNewItem({...newItem, value: e.target.value})}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={newItem.probability}
                  onChange={(e) => setNewItem({...newItem, probability: e.target.value})}
                  placeholder="75"
                />
              </div>
              <div>
                <Label htmlFor="expected_close">Expected Close Date</Label>
                <Input
                  id="expected_close"
                  type="date"
                  value={newItem.expected_close}
                  onChange={(e) => setNewItem({...newItem, expected_close: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  placeholder="Deal notes..."
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-h-[600px]">
          {stages.map(stage => {
            const stageItems = getItemsByStage(stage.id);
            const stageValue = stageItems.reduce((sum, item) => sum + (item.value || 0), 0);
            
            return (
              <div key={stage.id} className="flex flex-col">
                <div className={`${stage.color} p-3 rounded-t-lg border`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{stage.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageItems.length}
                    </Badge>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(stageValue)}
                    </p>
                  )}
                </div>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 border-l border-r border-b rounded-b-lg space-y-2 min-h-[400px] ${
                        snapshot.isDraggingOver ? 'bg-muted/50' : 'bg-background'
                      }`}
                    >
                      {stageItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-move ${
                                snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                              }`}
                            >
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.contact_name}`} />
                                      <AvatarFallback className="text-xs">
                                        {item.contact_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{item.contact_name}</p>
                                      <p className="text-xs text-muted-foreground truncate">{item.contact_email}</p>
                                    </div>
                                  </div>
                                  
                                  {item.value && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <DollarSign className="h-3 w-3" />
                                      {formatCurrency(item.value)}
                                      {item.probability && (
                                        <span className="ml-1">({item.probability}%)</span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {item.expected_close && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(item.expected_close).toLocaleDateString()}
                                    </div>
                                  )}
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
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}