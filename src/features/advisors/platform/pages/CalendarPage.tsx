import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Clock, Users, Video, MapPin, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
  getMockCalendarEvents, 
  getEventTypeStyle, 
  getEventStatusStyle, 
  formatEventTime,
  type CalendarEvent,
  type CalendarView 
} from '../state/calendar.mock';

export default function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    description: '',
    type: 'meeting' as CalendarEvent['type'],
    prospect: '',
    location: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const view = (searchParams.get('view') as CalendarView) || 'month';
  const events = getMockCalendarEvents();

  const handleViewChange = (newView: CalendarView) => {
    setSearchParams({ view: newView });
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getDateRange = () => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const getFilteredEvents = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
    } else if (view === 'week') {
      start.setDate(currentDate.getDate() - currentDate.getDay());
      end.setDate(start.getDate() + 6);
    } else {
      // day view - same start and end date
    }

    return events.filter(event => {
      const eventDate = new Date(event.start);
      if (view === 'day') {
        return eventDate.toDateString() === currentDate.toDateString();
      }
      return eventDate >= start && eventDate <= end;
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  const filteredEvents = getFilteredEvents();

  const handleNewEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event creation
    console.log('New event:', newEventForm);
    setIsNewEventModalOpen(false);
    setNewEventForm({
      title: '',
      description: '',
      type: 'meeting',
      prospect: '',
      location: '',
      date: '',
      startTime: '',
      endTime: ''
    });
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => 
        new Date(event.start).toDateString() === currentDay.toDateString()
      );
      
      days.push(
        <div
          key={currentDay.toISOString()}
          className={`min-h-24 p-2 border border-border bg-card hover:bg-accent/50 transition-colors ${
            currentDay.getMonth() !== currentDate.getMonth() ? 'opacity-40' : ''
          } ${
            currentDay.toDateString() === new Date().toDateString() ? 'bg-primary/10 border-primary' : ''
          }`}
        >
          <div className="font-medium text-sm text-foreground mb-1">
            {currentDay.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border ${getEventTypeStyle(event.type)} ${getEventStatusStyle(event.status)}`}
                title={`${event.title} - ${formatEventTime(event.start, event.end)}`}
              >
                {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
      
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-muted-foreground bg-muted">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => {
          const dayEvents = events.filter(event => 
            new Date(event.start).toDateString() === day.toDateString()
          );
          
          return (
            <div key={day.toISOString()} className="min-h-96">
              <div className={`p-2 text-center border-b border-border ${
                day.toDateString() === new Date().toDateString() ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
              }`}>
                <div className="text-sm font-medium">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">
                  {day.getDate()}
                </div>
              </div>
              <div className="p-2 space-y-2">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded border ${getEventTypeStyle(event.type)} ${getEventStatusStyle(event.status)}`}
                  >
                    <div className="font-medium">{formatEventTime(event.start, event.end)}</div>
                    <div>{event.title}</div>
                    {event.prospect && <div className="opacity-80">{event.prospect}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-1">
        {hours.map(hour => {
          const hourEvents = filteredEvents.filter(event => 
            new Date(event.start).getHours() === hour
          );
          
          return (
            <div key={hour} className="flex">
              <div className="w-16 text-sm text-muted-foreground p-2">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 min-h-12 border-l border-border p-2">
                {hourEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded border mb-1 ${getEventTypeStyle(event.type)} ${getEventStatusStyle(event.status)}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-80">{formatEventTime(event.start, event.end)}</div>
                    {event.prospect && <div className="text-sm opacity-80">{event.prospect}</div>}
                    {event.location && <div className="text-sm opacity-80">{event.location}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Calendar Management | Advisor Platform</title>
        <meta name="description" content="Manage appointments, schedule client meetings, and track your advisor calendar" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <Calendar className="w-6 h-6" />
              Calendar Management
            </h1>
            <p className="text-muted-foreground">
              Schedule and manage client meetings, consultations, and appointments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Dialog open={isNewEventModalOpen} onOpenChange={setIsNewEventModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNewEventSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEventForm.title}
                      onChange={(e) => setNewEventForm({...newEventForm, title: e.target.value})}
                      placeholder="Meeting with client..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={newEventForm.type} onValueChange={(value: CalendarEvent['type']) => setNewEventForm({...newEventForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prospect">Prospect/Client</Label>
                    <Input
                      id="prospect"
                      value={newEventForm.prospect}
                      onChange={(e) => setNewEventForm({...newEventForm, prospect: e.target.value})}
                      placeholder="Client name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEventForm.location}
                      onChange={(e) => setNewEventForm({...newEventForm, location: e.target.value})}
                      placeholder="Office, Zoom, etc..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEventForm.date}
                        onChange={(e) => setNewEventForm({...newEventForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEventForm.startTime}
                        onChange={(e) => setNewEventForm({...newEventForm, startTime: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEventForm.endTime}
                        onChange={(e) => setNewEventForm({...newEventForm, endTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEventForm.description}
                      onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})}
                      placeholder="Meeting agenda, notes..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Create Event</Button>
                    <Button type="button" variant="outline" onClick={() => setIsNewEventModalOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Controls */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateNavigation('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateNavigation('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                </div>
                <h2 className="text-lg font-semibold text-foreground">{getDateRange()}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('week')}
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('day')}
                >
                  Day
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
          </CardContent>
        </Card>

        {/* Upcoming Events Summary */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeStyle(event.type)}`} />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatEventTime(event.start, event.end)}
                      {event.prospect && ` • ${event.prospect}`}
                      {event.location && ` • ${event.location}`}
                    </div>
                  </div>
                  <Badge variant="outline" className={getEventTypeStyle(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No events scheduled for this {view}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}