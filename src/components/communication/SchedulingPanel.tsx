import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  MapPin,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

interface SchedulingPanelProps {}

interface Meeting {
  id: string;
  title: string;
  professional: {
    name: string;
    type: string;
  };
  date: Date;
  time: string;
  duration: number;
  type: 'in-person' | 'video' | 'phone';
  location?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  agenda?: string[];
}

export function SchedulingPanel({}: SchedulingPanelProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Tax Planning Review',
      professional: {
        name: 'John Smith',
        type: 'CPA'
      },
      date: new Date(),
      time: '10:00 AM',
      duration: 60,
      type: 'video',
      status: 'confirmed',
      agenda: ['Review 2024 tax strategy', 'Discuss retirement contributions', 'Review deductions']
    },
    {
      id: '2',
      title: 'Estate Planning Consultation',
      professional: {
        name: 'Sarah Johnson',
        type: 'Attorney'
      },
      date: addDays(new Date(), 1),
      time: '2:00 PM',
      duration: 90,
      type: 'in-person',
      location: '123 Legal Ave, Suite 400',
      status: 'scheduled',
      agenda: ['Will and trust review', 'Power of attorney updates', 'Beneficiary designations']
    },
    {
      id: '3',
      title: 'Investment Portfolio Review',
      professional: {
        name: 'Michael Chen',
        type: 'Financial Advisor'
      },
      date: addDays(new Date(), 3),
      time: '11:30 AM',
      duration: 45,
      type: 'phone',
      status: 'scheduled',
      agenda: ['Quarterly performance review', 'Rebalancing strategy', 'Risk assessment']
    }
  ]);

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Clock;
      case 'in-person': return MapPin;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDateMeetings = meetings.filter(meeting => 
    isSameDay(meeting.date, selectedDate)
  );

  const upcomingMeetings = meetings
    .filter(meeting => meeting.date >= new Date() && meeting.status !== 'cancelled')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Mark days with meetings
  const daysWithMeetings = meetings.map(meeting => meeting.date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Schedule & Meetings</h3>
          <p className="text-sm text-muted-foreground">Manage your professional appointments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
              modifiers={{
                hasmeeting: daysWithMeetings
              }}
              modifiersStyles={{
                hasmeeting: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'white',
                  borderRadius: '50%'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDateMeetings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No meetings scheduled</p>
              </div>
            ) : (
              selectedDateMeetings.map((meeting) => {
                const TypeIcon = getMeetingTypeIcon(meeting.type);
                
                return (
                  <div key={meeting.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{meeting.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {meeting.professional.name} - {meeting.professional.type}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.time} ({meeting.duration}m)
                      </div>
                      <div className="flex items-center gap-1">
                        <TypeIcon className="h-3 w-3" />
                        {meeting.type}
                      </div>
                    </div>
                    
                    {meeting.location && (
                      <p className="text-xs text-muted-foreground">
                        📍 {meeting.location}
                      </p>
                    )}
                    
                    <div className="flex gap-1 pt-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMeetings.map((meeting) => {
              const TypeIcon = getMeetingTypeIcon(meeting.type);
              
              return (
                <div key={meeting.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{meeting.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {meeting.professional.name}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {meeting.professional.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(meeting.date, 'MMM d')} at {meeting.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <TypeIcon className="h-3 w-3" />
                      {meeting.type === 'in-person' ? meeting.location : meeting.type}
                    </div>
                  </div>
                  
                  {meeting.agenda && (
                    <div className="pt-2">
                      <p className="text-xs font-medium mb-1">Agenda:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {meeting.agenda.slice(0, 2).map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                        {meeting.agenda.length > 2 && (
                          <li>• +{meeting.agenda.length - 2} more items</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}