import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Search, Filter, Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MainLayout } from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  interest: string;
  budget: number;
  source: string;
  score?: number;
  lastTouch?: string;
  created_at: string;
  updated_at: string;
}

const COLUMNS = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'scheduled', title: 'Scheduled', color: 'bg-green-500' },
  { id: 'closed_won', title: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'closed_lost', title: 'Closed Lost', color: 'bg-red-500' },
];

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0123',
    status: 'new',
    interest: 'retirement',
    budget: 500000,
    source: 'website',
    score: 85,
    lastTouch: '2024-01-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '555-0124',
    status: 'contacted',
    interest: 'investment',
    budget: 1200000,
    source: 'google_ads',
    score: 92,
    lastTouch: '2024-01-14',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '555-0125',
    status: 'qualified',
    interest: 'estate',
    budget: 2500000,
    source: 'referral',
    score: 95,
    lastTouch: '2024-01-12',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
];

export function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [interestFilter, setInterestFilter] = useState<string>('all');

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesInterest = interestFilter === 'all' || lead.interest === interestFilter;
    
    return matchesSearch && matchesSource && matchesInterest;
  });

  // Group leads by status
  const leadsGroupedByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = filteredLeads.filter(lead => lead.status === column.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const lead = leads.find(l => l.id === draggableId);
    if (!lead) return;

    // Update lead status
    const updatedLeads = leads.map(l => 
      l.id === draggableId 
        ? { ...l, status: destination.droppableId, updated_at: new Date().toISOString() }
        : l
    );

    setLeads(updatedLeads);

    // Log activity (in real app, this would save to database)
    const fromColumn = COLUMNS.find(col => col.id === source.droppableId)?.title;
    const toColumn = COLUMNS.find(col => col.id === destination.droppableId)?.title;
    
    toast.success(`${lead.name} moved from ${fromColumn} to ${toColumn}`);

    // In a real app, you would save to database here
    try {
      // Example database update (commented out since table doesn't exist yet)
      // await supabase
      //   .from('leads')
      //   .update({ status: destination.droppableId, updated_at: new Date().toISOString() })
      //   .eq('id', draggableId);
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight">
              SALES PIPELINE
            </h1>
            <p className="text-text-secondary text-lg">
              Track and manage your lead pipeline with real-time updates
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-surface border-border-primary">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                  <Input
                    placeholder="Search leads by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border-primary text-white placeholder:text-text-secondary"
                  />
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-full lg:w-[140px] bg-card border-border-primary text-white">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border-primary">
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={interestFilter} onValueChange={setInterestFilter}>
                    <SelectTrigger className="w-full lg:w-[140px] bg-card border-border-primary text-white">
                      <SelectValue placeholder="Interest" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border-primary">
                      <SelectItem value="all">All Interests</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="estate">Estate</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {COLUMNS.map((column) => (
                <div key={column.id} className="bg-surface rounded-lg border border-border-primary">
                  <div className="p-4 border-b border-border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <h3 className="font-bold text-white font-display text-sm tracking-wide">
                        {column.title.toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {leadsGroupedByStatus[column.id]?.length || 0} leads
                    </p>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-3 space-y-3 ${
                          snapshot.isDraggingOver ? 'bg-primary/20' : ''
                        }`}
                      >
                        {leadsGroupedByStatus[column.id]?.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-card border-border-primary cursor-move transition-all hover:shadow-lg ${
                                  snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    {/* Lead Name and Score */}
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-semibold text-white text-sm leading-tight">
                                        {lead.name}
                                      </h4>
                                      <Badge 
                                        className={`text-xs text-white ${getScoreColor(lead.score)}`}
                                      >
                                        {lead.score || 0}
                                      </Badge>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-1 text-xs">
                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{lead.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <Phone className="h-3 w-3" />
                                        <span>{lead.phone}</span>
                                      </div>
                                    </div>

                                    {/* Interest and Budget */}
                                    <div className="flex items-center justify-between text-xs">
                                      <Badge variant="outline" className="border-accent-gold text-accent-gold text-xs">
                                        {lead.interest}
                                      </Badge>
                                      <span className="text-accent-gold font-bold">
                                        {formatBudget(lead.budget)}
                                      </span>
                                    </div>

                                    {/* Last Touch */}
                                    {lead.lastTouch && (
                                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          Last: {format(new Date(lead.lastTouch), 'MMM d')}
                                        </span>
                                      </div>
                                    )}

                                    {/* Source */}
                                    <div className="pt-2 border-t border-border-primary/30">
                                      <span className="text-xs text-text-secondary">
                                        Source: {lead.source.replace('_', ' ')}
                                      </span>
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
                </div>
              ))}
            </div>
          </DragDropContext>

          {/* Summary Stats */}
          <Card className="mt-6 bg-surface border-border-primary">
            <CardHeader>
              <CardTitle className="text-white font-display tracking-wide">
                PIPELINE SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-gold">
                    {filteredLeads.length}
                  </div>
                  <div className="text-sm text-text-secondary">Total Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-aqua">
                    {filteredLeads.filter(l => ['qualified', 'scheduled'].includes(l.status)).length}
                  </div>
                  <div className="text-sm text-text-secondary">Hot Prospects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">
                    {filteredLeads.filter(l => l.status === 'closed_won').length}
                  </div>
                  <div className="text-sm text-text-secondary">Closed Won</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {filteredLeads.length > 0 
                      ? Math.round((filteredLeads.filter(l => l.status === 'closed_won').length / filteredLeads.length) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-text-secondary">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}