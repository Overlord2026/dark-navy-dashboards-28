import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, MapPin, MoreHorizontal } from 'lucide-react';

const upcomingMeetings = [
  {
    id: '1',
    title: 'Retirement Planning Review',
    client: 'Sarah Johnson',
    time: '10:00 AM - 11:00 AM',
    date: 'Today',
    type: 'video',
    status: 'confirmed',
    location: 'Zoom Meeting'
  },
  {
    id: '2',
    title: 'Estate Planning Consultation',
    client: 'Michael Chen',
    time: '2:00 PM - 3:30 PM',
    date: 'Today',
    type: 'in-person',
    status: 'confirmed',
    location: 'Office Conference Room'
  },
  {
    id: '3',
    title: 'Investment Portfolio Review',
    client: 'Davis Family Trust',
    time: '9:00 AM - 10:00 AM',
    date: 'Tomorrow',
    type: 'video',
    status: 'pending',
    location: 'Microsoft Teams'
  }
];

const recentMeetings = [
  {
    id: '4',
    title: 'Tax Strategy Discussion',
    client: 'Jennifer Martinez',
    date: 'Yesterday',
    duration: '45 min',
    status: 'completed',
    followUp: 'Send tax optimization proposal'
  },
  {
    id: '5',
    title: 'Initial Consultation',
    client: 'Robert Kim',
    date: '2 days ago',
    duration: '60 min',
    status: 'completed',
    followUp: 'Schedule follow-up meeting'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export default function MeetingsPage() {
  return (
    <>
      <Helmet>
        <title>Meetings | Calendar & Client Consultations</title>
        <meta name="description" content="Manage your meeting schedule and client consultations" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meetings</h1>
            <p className="text-muted-foreground">
              Manage your schedule and client consultations
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Meetings</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">96%</p>
                </div>
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.client}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meeting.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {meeting.type === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {meeting.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.client}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meeting.duration}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Next: {meeting.followUp}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}