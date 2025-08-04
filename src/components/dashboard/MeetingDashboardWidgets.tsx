import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Video, 
  Clock, 
  Users, 
  Settings, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleIntegrationService } from '@/services/integrations/GoogleIntegrationService';
import { bfoSchedulingService } from '@/services/scheduling/BFOSchedulingService';
import { format, addDays } from 'date-fns';

interface MeetingWidget {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingType: string;
  meetingUrl?: string;
  googleMeetLink?: string;
  clientName?: string;
  status: string;
}

interface DashboardWidgetsProps {
  userType: 'advisor' | 'client' | 'admin';
  userId: string;
}

export function MeetingDashboardWidgets({ userType, userId }: DashboardWidgetsProps) {
  const { toast } = useToast();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<MeetingWidget | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    loadMeetingData();
    checkGoogleConnection();
  }, [userId]);

  const checkGoogleConnection = async () => {
    try {
      const connected = await googleIntegrationService.isGoogleConnected();
      setIsGoogleConnected(connected);
    } catch (error) {
      console.error('Error checking Google connection:', error);
    }
  };

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      const mockMeetings: MeetingWidget[] = [
        {
          id: '1',
          title: 'Portfolio Review',
          scheduledAt: addDays(new Date(), 1).toISOString(),
          duration: 60,
          meetingType: 'google_meet',
          googleMeetLink: 'https://meet.google.com/abc-defg-hij',
          clientName: 'John Smith',
          status: 'confirmed'
        },
        {
          id: '2',
          title: 'Financial Planning Session',
          scheduledAt: addDays(new Date(), 3).toISOString(),
          duration: 90,
          meetingType: 'google_meet',
          googleMeetLink: 'https://meet.google.com/xyz-uvwx-yz',
          clientName: 'Sarah Johnson',
          status: 'scheduled'
        }
      ];

      setUpcomingMeetings(mockMeetings);
      setNextMeeting(mockMeetings[0]);
    } catch (error) {
      console.error('Error loading meeting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const authUrl = await googleIntegrationService.initiateGoogleAuth(
        userType === 'advisor' ? 'advisor' : 'optional'
      );
      window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      // Listen for auth completion
      window.addEventListener('message', (event) => {
        if (event.data.type === 'google-auth-success') {
          setIsGoogleConnected(true);
          toast({
            title: "Google Connected! ✅",
            description: "Your Google Workspace is now integrated with BFO.",
          });
          loadMeetingData();
        }
      });
    } catch (error) {
      console.error('Error connecting Google:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect Google Workspace. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJoinMeeting = (meeting: MeetingWidget) => {
    if (meeting.googleMeetLink) {
      window.open(meeting.googleMeetLink, '_blank');
      toast({
        title: "Joining Meeting",
        description: `Opening Google Meet for ${meeting.title}`,
      });
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setLoading(true);
      await googleIntegrationService.syncCalendarEvents('bidirectional');
      await loadMeetingData();
      
      toast({
        title: "Calendar Synced ✅",
        description: "Your Google Calendar and BFO are now in sync.",
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isGoogleConnected) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-3">
            <div>
              <strong>Connect Google Workspace</strong> to enable BFO's integrated scheduling, calendar sync, and Google Meet integration.
            </div>
            <Button onClick={handleConnectGoogle} size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Google Account
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Next Meeting Widget */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-medium">Next Meeting</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Google Connected
            </Badge>
            <Button variant="outline" size="sm" onClick={handleSyncCalendar} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {nextMeeting ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{nextMeeting.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    with {nextMeeting.clientName} • {format(new Date(nextMeeting.scheduledAt), 'MMM d, h:mm a')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {nextMeeting.duration} minutes via Google Meet
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleJoinMeeting(nextMeeting)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Join Google Meet
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Synced with Google Calendar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  <span>Google Meet Auto-Generated</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming meetings</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => setShowBooking(true)}
            className="w-full"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book New Meeting
          </Button>
          
          <Button variant="outline" className="w-full" onClick={loadMeetingData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Calendar
          </Button>
          
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Meeting Settings
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Meetings List */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Video className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {meeting.clientName} • {format(new Date(meeting.scheduledAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'}>
                      {meeting.status}
                    </Badge>
                    {meeting.googleMeetLink && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleJoinMeeting(meeting)}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}