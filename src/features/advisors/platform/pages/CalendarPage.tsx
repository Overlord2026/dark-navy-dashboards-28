import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, Users, Video, MapPin, Filter } from 'lucide-react';

// TODO: Import existing calendar components if available
// import { AdvisorCalendar } from '@/components/advisor/AdvisorCalendar';
// import { MeetingScheduler } from '@/components/advisor/MeetingScheduler';

export default function CalendarPage() {
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
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
              Filter View
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Sync Calendar
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Meetings</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">2 confirmed</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">3 pending</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Video Calls</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">67% remote</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Plus className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">This week</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Replace with actual calendar component */}
                <div className="h-96 border rounded-lg p-4 bg-gray-50">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Calendar Integration</p>
                    <p className="text-sm">
                      Advanced calendar view with meeting management will be displayed here.
                      Currently integrating with existing AdvisorCalendar component.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* TODO: Replace with actual meeting data */}
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Johnson Family Consultation</h3>
                      <p className="text-xs text-muted-foreground">Estate planning review</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          2:00 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Zoom
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">New Client Onboarding</h3>
                      <p className="text-xs text-muted-foreground">Sarah & Michael Chen</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          4:30 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          Office
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Quarterly Review</h3>
                      <p className="text-xs text-muted-foreground">Davis Family Trust</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Tomorrow 10:00 AM
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Teams
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Users className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Prospect Discovery</h3>
                      <p className="text-xs text-muted-foreground">Thompson Holdings</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Thu 3:00 PM
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          Client Office
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Types */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Client Consultation (60m)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Prospect Discovery (30m)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    Portfolio Review (45m)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Follow-up Call (15m)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Notice */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-purple-900">Calendar Integration</h3>
                <p className="text-sm text-purple-700 mt-1">
                  This calendar integrates with your existing meeting scheduling system and advisor calendar components. 
                  Sync with Google Calendar, Outlook, or other calendar systems for unified scheduling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}