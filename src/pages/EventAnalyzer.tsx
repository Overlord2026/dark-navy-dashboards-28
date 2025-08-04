import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Settings,
  Eye,
  Edit,
  RotateCcw,
  Sparkles,
  Bell,
  Download
} from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Event {
  id: string;
  name: string;
  client: string;
  dueDate: Date;
  type: 'RMD' | 'Client Review' | 'Tax Filing' | 'Compliance' | 'CE Deadline';
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Complete' | 'Overdue';
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  notes: string[];
  documents: string[];
}

interface EventFilters {
  dateRange: { from?: Date; to?: Date };
  type?: string;
  status?: string;
  search: string;
}

export const EventAnalyzer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    dateRange: {},
    search: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Annual RMD Calculation',
        client: 'John & Martha Smith',
        dueDate: new Date(2024, 11, 31),
        type: 'RMD',
        assignedTo: 'Sarah Johnson',
        status: 'In Progress',
        description: 'Calculate required minimum distribution for traditional IRA accounts',
        priority: 'High',
        progress: 65,
        notes: ['Initial calculations completed', 'Awaiting final account statements'],
        documents: ['IRA_Statement_2024.pdf', 'Tax_Documents.pdf']
      },
      {
        id: '2',
        name: 'Quarterly Compliance Review',
        client: 'ABC Family Trust',
        dueDate: addDays(new Date(), 5),
        type: 'Compliance',
        assignedTo: 'Michael Chen',
        status: 'Pending',
        description: 'Review trust compliance and regulatory requirements',
        priority: 'Critical',
        progress: 0,
        notes: [],
        documents: []
      },
      {
        id: '3',
        name: 'Annual Investment Review',
        client: 'Robert Williams',
        dueDate: addDays(new Date(), -2),
        type: 'Client Review',
        assignedTo: 'Emily Davis',
        status: 'Overdue',
        description: 'Annual portfolio review and rebalancing discussion',
        priority: 'Medium',
        progress: 30,
        notes: ['Client confirmed meeting date'],
        documents: ['Portfolio_Summary.pdf']
      },
      {
        id: '4',
        name: 'Tax Document Preparation',
        client: 'Johnson Family LLC',
        dueDate: new Date(2024, 3, 15),
        type: 'Tax Filing',
        assignedTo: 'David Brown',
        status: 'Complete',
        description: 'Prepare annual tax documents and filings',
        priority: 'High',
        progress: 100,
        notes: ['All documents submitted', 'Client confirmed receipt'],
        documents: ['Tax_Return_2023.pdf', 'Supporting_Docs.pdf']
      }
    ];
    setEvents(mockEvents);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filters.search && !event.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.client.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.type && event.type !== filters.type) {
      return false;
    }
    
    if (filters.status && event.status !== filters.status) {
      return false;
    }
    
    if (filters.dateRange.from && isBefore(event.dueDate, filters.dateRange.from)) {
      return false;
    }
    
    if (filters.dateRange.to && isAfter(event.dueDate, filters.dateRange.to)) {
      return false;
    }
    
    return true;
  });

  const upcomingCriticalEvents = events.filter(event => 
    (event.status === 'Pending' || event.status === 'In Progress') &&
    event.priority === 'Critical' &&
    isAfter(addDays(event.dueDate, 7), new Date())
  );

  const overdueEvents = events.filter(event => 
    event.status === 'Overdue' || 
    (event.status !== 'Complete' && isBefore(event.dueDate, new Date()))
  );

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'Complete' as const, progress: 100 }
        : event
    ));
    
    // Trigger celebration animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast.success('Event completed! Great work! 🎉');
  };

  const handleRescheduleEvent = (eventId: string, newDate: Date) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, dueDate: newDate, status: 'Pending' as const }
        : event
    ));
    
    toast.success('Event rescheduled successfully');
  };

  const handleAddNote = (eventId: string, note: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, notes: [...event.notes, note] }
        : event
    ));
    
    toast.success('Note added successfully');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Event Analyzer
          </h1>
          <p className="text-muted-foreground">
            Manage client events, compliance deadlines, and critical milestones
          </p>
        </div>
        
        <Button 
          onClick={() => setIsNewEventDialogOpen(true)}
          className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events or clients..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="h-11"
              />
            </div>
            
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-11 min-w-[200px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "MMM dd")} -{" "}
                          {format(filters.dateRange.to, "MMM dd")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      "Date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.dateRange.from && filters.dateRange.to ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined}
                    onSelect={(range) => setFilters(prev => ({ ...prev, dateRange: range || {} }))}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === 'all' ? undefined : value }))}>
                <SelectTrigger className="h-11 w-[180px]">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RMD">RMD</SelectItem>
                  <SelectItem value="Client Review">Client Review</SelectItem>
                  <SelectItem value="Tax Filing">Tax Filing</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="CE Deadline">CE Deadline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}>
                <SelectTrigger className="h-11 w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Event Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Events ({filteredEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`} />
                          <h3 className="font-semibold text-lg">{event.name}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {event.client}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(event.dueDate, 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            {event.assignedTo}
                          </div>
                        </div>
                        
                        {event.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{event.progress}%</span>
                            </div>
                            <Progress value={event.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEventDialogOpen(true);
                          }}
                          className="h-9"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {event.status !== 'Complete' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCompleteEvent(event.id)}
                            className="h-9 bg-green-50 hover:bg-green-100 text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-9"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No events found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Upcoming Critical Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-red-500" />
                Critical Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingCriticalEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-red-500 pl-3 py-2">
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.client}</p>
                    <p className="text-xs text-red-600">
                      Due {format(event.dueDate, 'MMM dd')}
                    </p>
                  </div>
                ))}
                
                {upcomingCriticalEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground">No critical events</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Compliance Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-yellow-500 pl-3 py-2">
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.client}</p>
                    <Badge className="text-xs bg-red-100 text-red-800">
                      {event.status === 'Overdue' ? 'Overdue' : 'At Risk'}
                    </Badge>
                  </div>
                ))}
                
                {overdueEvents.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-green-600">All caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {events.filter(e => e.status === 'In Progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="font-semibold text-green-600">
                    {events.filter(e => e.status === 'Complete').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Overdue</span>
                  <span className="font-semibold text-red-600">
                    {overdueEvents.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${selectedEvent ? getPriorityColor(selectedEvent.priority) : ''}`} />
              {selectedEvent?.name}
              <Badge className={selectedEvent ? getStatusColor(selectedEvent.status) : ''}>
                {selectedEvent?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Client:</strong> {selectedEvent.client}</div>
                    <div><strong>Due Date:</strong> {format(selectedEvent.dueDate, 'MMMM dd, yyyy')}</div>
                    <div><strong>Type:</strong> {selectedEvent.type}</div>
                    <div><strong>Assigned To:</strong> {selectedEvent.assignedTo}</div>
                    <div><strong>Priority:</strong> {selectedEvent.priority}</div>
                  </div>
                  
                  {selectedEvent.description && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Description</h5>
                      <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>{selectedEvent.progress}%</span>
                    </div>
                    <Progress value={selectedEvent.progress} />
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-medium mb-2">Workflow Steps</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Initiation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Action Item Tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-muted-foreground">Compliance Confirmation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-muted-foreground">Completion & Audit Log</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Notes & Comments</h4>
                <div className="space-y-3">
                  {selectedEvent.notes.map((note, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Textarea placeholder="Add a note..." className="flex-1" />
                    <Button size="sm" className="h-9">Add Note</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {selectedEvent.status !== 'Complete' && (
                    <Button 
                      onClick={() => {
                        handleCompleteEvent(selectedEvent.id);
                        setIsEventDialogOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Event Dialog */}
      <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Name</label>
              <Input placeholder="Enter event name..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client</label>
                <Input placeholder="Select client..." />
              </div>
              <div>
                <label className="text-sm font-medium">Event Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RMD">RMD</SelectItem>
                    <SelectItem value="Client Review">Client Review</SelectItem>
                    <SelectItem value="Tax Filing">Tax Filing</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="CE Deadline">CE Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Select date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter event description..." />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};