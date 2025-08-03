import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Mic, 
  FileText, 
  Download,
  Play,
  Plus,
  Settings,
  Phone,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  meeting_type: 'zoom' | 'google_meet' | 'in_office' | 'phone';
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  zoom_meeting_id?: string;
  google_meet_link?: string;
  recording_url?: string;
  summary?: string;
  action_items?: string[];
  lead_id?: string;
  advisor_id: string;
  created_at: string;
}

const meetingTypes = [
  { value: 'zoom', label: 'Zoom Meeting', icon: Video },
  { value: 'google_meet', label: 'Google Meet', icon: Video },
  { value: 'in_office', label: 'In-Office', icon: MapPin },
  { value: 'phone', label: 'Phone Call', icon: Phone }
];

export function MeetingIntegrations() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isConnected, setIsConnected] = useState({
    zoom: false,
    google: false
  });

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    client_name: '',
    client_email: '',
    meeting_type: 'zoom' as const,
    scheduled_at: '',
    duration_minutes: 60,
    lead_id: ''
  });

  useEffect(() => {
    loadMeetings();
    checkIntegrationStatus();
  }, []);

  const loadMeetings = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error loading meetings:', error);
      // Mock data for demo
      setMeetings([
        {
          id: '1',
          title: 'Portfolio Review',
          client_name: 'John Smith',
          client_email: 'john@example.com',
          meeting_type: 'zoom',
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          duration_minutes: 60,
          status: 'scheduled',
          zoom_meeting_id: '123456789',
          advisor_id: 'advisor-1',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Initial Consultation',
          client_name: 'Sarah Johnson',
          client_email: 'sarah@example.com',
          meeting_type: 'google_meet',
          scheduled_at: new Date(Date.now() + 172800000).toISOString(),
          duration_minutes: 30,
          status: 'completed',
          google_meet_link: 'https://meet.google.com/abc-def-ghi',
          recording_url: 'https://recordings.example.com/recording1.mp4',
          summary: 'Discussed investment goals and risk tolerance. Client interested in growth portfolio.',
          action_items: ['Send portfolio proposals', 'Schedule follow-up', 'Prepare risk assessment'],
          advisor_id: 'advisor-1',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const checkIntegrationStatus = async () => {
    try {
      // Check if user has connected integrations
      const { data } = await supabase
        .from('user_integrations')
        .select('provider, is_active')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      const connected = {
        zoom: data?.some(d => d.provider === 'zoom' && d.is_active) || false,
        google: data?.some(d => d.provider === 'google' && d.is_active) || false
      };
      setIsConnected(connected);
    } catch (error) {
      console.error('Error checking integration status:', error);
    }
  };

  const createMeeting = async () => {
    if (!newMeeting.title || !newMeeting.client_email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      let meetingData: any = {
        title: newMeeting.title,
        client_name: newMeeting.client_name,
        client_email: newMeeting.client_email,
        meeting_type: newMeeting.meeting_type,
        scheduled_at: newMeeting.scheduled_at,
        duration_minutes: newMeeting.duration_minutes,
        status: 'scheduled',
        advisor_id: user.user.id,
        lead_id: newMeeting.lead_id || null
      };

      // Create meeting with integration
      if (newMeeting.meeting_type === 'zoom' && isConnected.zoom) {
        const { data: zoomMeeting } = await supabase.functions.invoke('create-video-meeting', {
          body: {
            type: 'zoom',
            topic: newMeeting.title,
            start_time: newMeeting.scheduled_at,
            duration: newMeeting.duration_minutes,
            attendees: [newMeeting.client_email]
          }
        });
        
        if (zoomMeeting) {
          meetingData.zoom_meeting_id = zoomMeeting.id;
          meetingData.zoom_join_url = zoomMeeting.join_url;
        }
      } else if (newMeeting.meeting_type === 'google_meet' && isConnected.google) {
        const { data: googleMeeting } = await supabase.functions.invoke('create-video-meeting', {
          body: {
            type: 'google_meet',
            summary: newMeeting.title,
            start: { dateTime: newMeeting.scheduled_at },
            end: { dateTime: new Date(new Date(newMeeting.scheduled_at).getTime() + newMeeting.duration_minutes * 60000).toISOString() },
            attendees: [{ email: newMeeting.client_email }]
          }
        });
        
        if (googleMeeting) {
          meetingData.google_meet_link = googleMeeting.hangoutLink;
          meetingData.google_event_id = googleMeeting.id;
        }
      }

      const { data, error } = await supabase
        .from('meetings')
        .insert([meetingData])
        .select()
        .single();

      if (error) throw error;

      // Send calendar invitation
      await supabase.functions.invoke('send-meeting-invitation', {
        body: {
          meeting_id: data.id,
          client_email: newMeeting.client_email,
          meeting_details: meetingData
        }
      });

      toast({
        title: "Meeting Created",
        description: "Meeting scheduled and invitation sent",
      });

      setIsCreateOpen(false);
      setNewMeeting({
        title: '',
        client_name: '',
        client_email: '',
        meeting_type: 'zoom',
        scheduled_at: '',
        duration_minutes: 60,
        lead_id: ''
      });

      loadMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const connectIntegration = async (provider: 'zoom' | 'google') => {
    try {
      // Initiate OAuth flow
      const { data } = await supabase.functions.invoke('oauth-callback', {
        body: { provider, action: 'initiate' }
      });
      
      if (data?.auth_url) {
        window.open(data.auth_url, '_blank', 'width=600,height=600');
      }
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      toast({
        title: "Connection Error",
        description: `Failed to connect ${provider}`,
        variant: "destructive",
      });
    }
  };

  const startRecording = async (meetingId: string) => {
    try {
      await supabase.functions.invoke('start-meeting-recording', {
        body: { meeting_id: meetingId }
      });
      
      toast({
        title: "Recording Started",
        description: "Meeting recording has been initiated",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const generateSummary = async (meetingId: string) => {
    try {
      const { data } = await supabase.functions.invoke('generate-meeting-summary', {
        body: { meeting_id: meetingId }
      });
      
      if (data) {
        toast({
          title: "Summary Generated",
          description: "AI meeting summary has been created",
        });
        loadMeetings();
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    const typeConfig = meetingTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || Video;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Meeting Integrations
            </span>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5" />
                <div>
                  <p className="font-medium">Zoom</p>
                  <p className="text-sm text-muted-foreground">
                    {isConnected.zoom ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button 
                variant={isConnected.zoom ? "outline" : "default"}
                size="sm"
                onClick={() => !isConnected.zoom && connectIntegration('zoom')}
              >
                {isConnected.zoom ? 'Connected' : 'Connect'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5" />
                <div>
                  <p className="font-medium">Google Meet</p>
                  <p className="text-sm text-muted-foreground">
                    {isConnected.google ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button 
                variant={isConnected.google ? "outline" : "default"}
                size="sm"
                onClick={() => !isConnected.google && connectIntegration('google')}
              >
                {isConnected.google ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getMeetingTypeIcon(meeting.meeting_type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {meeting.client_name} • {format(new Date(meeting.scheduled_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                  {meeting.status === 'scheduled' && (
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  )}
                  {meeting.status === 'in_progress' && (
                    <Button size="sm" onClick={() => startRecording(meeting.id)}>
                      <Mic className="h-4 w-4 mr-1" />
                      Record
                    </Button>
                  )}
                  {meeting.recording_url && (
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Meeting Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meeting Title</Label>
              <Input
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                placeholder="e.g., Portfolio Review"
              />
            </div>
            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <Select
                value={newMeeting.meeting_type}
                onValueChange={(value: any) => setNewMeeting({...newMeeting, meeting_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={newMeeting.client_name}
                onChange={(e) => setNewMeeting({...newMeeting, client_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input
                type="email"
                value={newMeeting.client_email}
                onChange={(e) => setNewMeeting({...newMeeting, client_email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={newMeeting.scheduled_at}
                onChange={(e) => setNewMeeting({...newMeeting, scheduled_at: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={newMeeting.duration_minutes}
                onChange={(e) => setNewMeeting({...newMeeting, duration_minutes: Number(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createMeeting}>
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Meeting Detail Modal */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-sm text-muted-foreground">{selectedMeeting.client_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedMeeting.scheduled_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              
              {selectedMeeting.summary && (
                <div className="space-y-2">
                  <p className="font-medium">AI Summary</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedMeeting.summary}</p>
                  </div>
                </div>
              )}
              
              {selectedMeeting.action_items && selectedMeeting.action_items.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Action Items</p>
                  <ul className="space-y-1">
                    {selectedMeeting.action_items.map((item, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2">
                {selectedMeeting.recording_url && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Recording
                  </Button>
                )}
                {selectedMeeting.status === 'completed' && !selectedMeeting.summary && (
                  <Button onClick={() => generateSummary(selectedMeeting.id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Summary
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}