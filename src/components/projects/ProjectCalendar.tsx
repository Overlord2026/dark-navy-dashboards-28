import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Users, Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: 'milestone' | 'task' | 'meeting';
    projectId: string;
    projectName: string;
    description?: string;
    attendees?: string[];
  };
}

interface ProjectCalendarProps {
  projectId?: string;
}

export const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ projectId }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'meeting' as 'milestone' | 'task' | 'meeting',
    projectId: projectId || '',
    attendees: [] as string[]
  });

  const { projects, milestones, tasks } = useProjects();

  useEffect(() => {
    loadCalendarEvents();
  }, [projects, milestones, tasks, projectId]);

  const loadCalendarEvents = () => {
    const calendarEvents: CalendarEvent[] = [];
    
    const filteredProjects = projectId ? projects.filter(p => p.id === projectId) : projects;
    const filteredMilestones = projectId ? milestones.filter(m => m.project_id === projectId) : milestones;
    const filteredTasks = projectId ? tasks.filter(t => t.project_id === projectId) : tasks;

    // Add milestones as events
    filteredMilestones.forEach(milestone => {
        const project = projects.find(p => p.id === milestone.project_id);
        calendarEvents.push({
          id: `milestone-${milestone.id}`,
          title: `📍 ${milestone.title}`,
          start: new Date(milestone.due_date),
          end: new Date(milestone.due_date),
          resource: {
            type: 'milestone',
            projectId: milestone.project_id,
            projectName: project?.name || 'Unknown Project',
            description: milestone.description
          }
        });
    });

    // Add tasks as events
    filteredTasks.forEach(task => {
      if (task.due_date) {
        const project = projects.find(p => p.id === task.project_id);
        calendarEvents.push({
          id: `task-${task.id}`,
          title: `✓ ${task.title}`,
          start: new Date(task.due_date),
          end: new Date(task.due_date),
          resource: {
            type: 'task',
            projectId: task.project_id,
            projectName: project?.name || 'Unknown Project',
            description: task.description
          }
        });
      }
    });

    setEvents(calendarEvents);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.projectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (newEvent.type === 'milestone') {
        const { error } = await supabase
          .from('project_milestones')
          .insert({
            project_id: newEvent.projectId,
            title: newEvent.title,
            description: newEvent.description,
            due_date: newEvent.start,
            priority: 'medium'
          });

        if (error) throw error;
      } else if (newEvent.type === 'task') {
        const { error } = await supabase
          .from('project_tasks')
          .insert({
            project_id: newEvent.projectId,
            title: newEvent.title,
            description: newEvent.description,
            due_date: newEvent.start,
            priority: 'medium',
            status: 'todo',
            created_by: 'temp-user-id'
          });

        if (error) throw error;
      }

      toast.success(`${newEvent.type.charAt(0).toUpperCase() + newEvent.type.slice(1)} created successfully`);
      setShowCreateDialog(false);
      setNewEvent({
        title: '',
        description: '',
        start: '',
        end: '',
        type: 'meeting',
        projectId: projectId || '',
        attendees: []
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.resource.type) {
      case 'milestone':
        backgroundColor = '#f59e0b';
        break;
      case 'task':
        backgroundColor = '#10b981';
        break;
      case 'meeting':
        backgroundColor = '#6366f1';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h3 className="text-lg font-semibold">
            {projectId ? 'Project Calendar' : 'All Projects Calendar'}
          </h3>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Calendar Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-title">Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <Label htmlFor="event-type">Type</Label>
                <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!projectId && (
                <div>
                  <Label htmlFor="event-project">Project</Label>
                  <Select value={newEvent.projectId} onValueChange={(value) => setNewEvent(prev => ({ ...prev, projectId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="event-start">Start Date</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="event-end">End Date</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event description"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateEvent} className="flex-1">
                  Create Event
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
        />
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(selectedEvent.start, 'PPP p')}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {selectedEvent.resource.projectName}
              </div>
              
              {selectedEvent.resource.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.resource.description}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedEvent.resource.type === 'milestone' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEvent.resource.type === 'task' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedEvent.resource.type}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};