import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRetirementScenarios, type AdvisorClient } from '@/hooks/useRetirementScenarios';

interface ClientMeetingSchedulerProps {
  client: AdvisorClient;
}

interface Meeting {
  id: string;
  date: string;
  time: string;
  type: 'review' | 'planning' | 'presentation' | 'follow_up';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  scenarios_presented?: string[];
  action_items?: string[];
  duration_minutes?: number;
}

export function ClientMeetingScheduler({ client }: ClientMeetingSchedulerProps) {
  const { getScenariosForClient } = useRetirementScenarios();
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'meeting-1',
      date: '2024-01-15',
      time: '10:00',
      type: 'review',
      status: 'scheduled',
      notes: 'Quarterly review of retirement goals and current scenarios',
      duration_minutes: 60
    },
    {
      id: 'meeting-2',
      date: '2023-10-15',
      time: '14:00',
      type: 'presentation',
      status: 'completed',
      notes: 'Presented updated retirement scenarios with tax optimization',
      scenarios_presented: ['scenario-1'],
      action_items: ['Review tax-loss harvesting options', 'Consider Roth conversion'],
      duration_minutes: 90
    }
  ]);

  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const [newMeetingData, setNewMeetingData] = useState({
    date: '',
    time: '',
    type: 'review' as Meeting['type'],
    notes: '',
    duration_minutes: 60
  });

  const clientScenarios = getScenariosForClient(client.id);
  const sortedMeetings = meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date() && m.status === 'scheduled');
  const completedMeetings = meetings.filter(m => m.status === 'completed');

  const handleCreateMeeting = () => {
    if (!newMeetingData.date || !newMeetingData.time) return;

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      ...newMeetingData,
      status: 'scheduled'
    };

    setMeetings(prev => [...prev, newMeeting]);
    setShowNewMeetingDialog(false);
    setNewMeetingData({
      date: '',
      time: '',
      type: 'review',
      notes: '',
      duration_minutes: 60
    });
  };

  const getMeetingTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'review': return 'default';
      case 'planning': return 'secondary';
      case 'presentation': return 'destructive';
      case 'follow_up': return 'outline';
      default: return 'default';
    }
  };

  const getMeetingStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatMeetingDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (meeting: Meeting) => {
    const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
    return meetingDate >= new Date() && meeting.status === 'scheduled';
  };

  const getDaysUntilMeeting = (meeting: Meeting) => {
    const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
    const today = new Date();
    const diffTime = meetingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Meeting Schedule - {client.client_name}
              </CardTitle>
              <CardDescription>
                Manage meetings and track client interactions
              </CardDescription>
            </div>
            <Dialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Meeting</DialogTitle>
                  <DialogDescription>
                    Schedule a meeting with {client.client_name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={newMeetingData.date}
                        onChange={(e) => setNewMeetingData({
                          ...newMeetingData,
                          date: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input
                        type="time"
                        value={newMeetingData.time}
                        onChange={(e) => setNewMeetingData({
                          ...newMeetingData,
                          time: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Meeting Type</label>
                    <Select 
                      value={newMeetingData.type} 
                      onValueChange={(value: Meeting['type']) => 
                        setNewMeetingData({ ...newMeetingData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="review">Quarterly Review</SelectItem>
                        <SelectItem value="planning">Planning Session</SelectItem>
                        <SelectItem value="presentation">Scenario Presentation</SelectItem>
                        <SelectItem value="follow_up">Follow-up Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={newMeetingData.duration_minutes}
                      onChange={(e) => setNewMeetingData({
                        ...newMeetingData,
                        duration_minutes: parseInt(e.target.value) || 60
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      placeholder="Meeting agenda or notes..."
                      value={newMeetingData.notes}
                      onChange={(e) => setNewMeetingData({
                        ...newMeetingData,
                        notes: e.target.value
                      })}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewMeetingDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateMeeting}
                      disabled={!newMeetingData.date || !newMeetingData.time}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedMeetings.length}</p>
            <p className="text-sm text-muted-foreground">Completed Meetings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {client.next_meeting_date 
                ? getDaysUntilMeeting({ date: client.next_meeting_date, time: '00:00' } as Meeting)
                : 'N/A'
              }
            </p>
            <p className="text-sm text-muted-foreground">Days Until Next Meeting</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => {
              const daysUntil = getDaysUntilMeeting(meeting);
              return (
                <div key={meeting.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {formatMeetingDate(meeting.date)} at {meeting.time}
                        {daysUntil <= 7 && (
                          <Badge variant="destructive" className="text-xs">
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {meeting.duration_minutes} minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getMeetingTypeColor(meeting.type)}>
                        {meeting.type.replace('_', ' ')}
                      </Badge>
                      {getMeetingStatusIcon(meeting.status)}
                    </div>
                  </div>
                  {meeting.notes && (
                    <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Meeting History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting History
          </CardTitle>
          <CardDescription>
            Past meetings and completed actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Meetings Scheduled</h3>
                <p className="text-muted-foreground">
                  Schedule your first meeting with {client.client_name}
                </p>
              </div>
            ) : (
              sortedMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {formatMeetingDate(meeting.date)} at {meeting.time}
                        {isUpcoming(meeting) && (
                          <Badge variant="outline" className="text-xs">
                            Upcoming
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {meeting.duration_minutes} minutes • {meeting.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getMeetingTypeColor(meeting.type)}>
                        {meeting.type.replace('_', ' ')}
                      </Badge>
                      {getMeetingStatusIcon(meeting.status)}
                    </div>
                  </div>

                  {meeting.notes && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                    </div>
                  )}

                  {meeting.scenarios_presented && meeting.scenarios_presented.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Scenarios Presented:</h5>
                      <div className="flex flex-wrap gap-1">
                        {meeting.scenarios_presented.map((scenarioId, index) => {
                          const scenario = clientScenarios.find(s => s.id === scenarioId);
                          return (
                            <Badge key={index} variant="outline" className="text-xs">
                              {scenario?.scenario_name || `Scenario ${index + 1}`}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {meeting.action_items && meeting.action_items.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {meeting.action_items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}