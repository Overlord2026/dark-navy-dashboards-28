import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, 
  Video, 
  Phone, 
  MapPin, 
  Plus, 
  Clock,
  Users,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  scheduled_at: string;
  duration_minutes: number;
  type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meeting_url?: string;
  location?: string;
  notes?: string;
  recording_url?: string;
  summary?: string;
  advisor_id: string;
}

interface Integration {
  id: string;
  provider: 'zoom' | 'google_meet' | 'calendly';
  is_active: boolean;
  config: Record<string, any>;
  last_sync: string;
}

export function MeetingIntegrations() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState('meetings');

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    client_name: '',
    client_email: '',
    scheduled_at: '',
    duration_minutes: 60,
    type: 'video' as 'video' | 'phone' | 'in_person',
    location: ''
  });

  useEffect(() => {
    loadMeetings();
    loadIntegrations();
  }, []);

  const loadMeetings = async () => {
    try {
      // Use mock data
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Portfolio Review',
          client_name: 'John Smith',
          client_email: 'john@example.com',
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          duration_minutes: 60,
          type: 'video',
          status: 'scheduled',
          meeting_url: 'https://zoom.us/j/123456789',
          advisor_id: 'mock-advisor'
        },
        {
          id: '2',
          title: 'Initial Consultation',
          client_name: 'Sarah Johnson',
          client_email: 'sarah@example.com',
          scheduled_at: new Date(Date.now() + 172800000).toISOString(),
          duration_minutes: 30,
          type: 'phone',
          status: 'scheduled',
          advisor_id: 'mock-advisor'
        }
      ];
      
      setMeetings(mockMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrations = async () => {
    try {
      // Use mock integration data
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          provider: 'zoom',
          is_active: true,
          config: { api_key: 'configured' },
          last_sync: new Date().toISOString()
        },
        {
          id: '2',
          provider: 'google_meet',
          is_active: false,
          config: {},
          last_sync: new Date().toISOString()
        }
      ];

      setIntegrations(mockIntegrations);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      const meeting: Meeting = {
        id: Date.now().toString(),
        ...newMeeting,
        status: 'scheduled',
        advisor_id: 'mock-advisor'
      };

      setMeetings(prev => [meeting, ...prev]);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
      setIsScheduleOpen(false);
      resetMeetingForm();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive",
      });
    }
  };

  const resetMeetingForm = () => {
    setNewMeeting({
      title: '',
      client_name: '',
      client_email: '',
      scheduled_at: '',
      duration_minutes: 60,
      type: 'video',
      location: ''
    });
  };

  const toggleIntegration = async (integrationId: string, provider: string) => {
    // Mock toggle
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, is_active: !int.is_active }
        : int
    ));
    
    toast({
      title: "Success",
      description: `${provider} integration updated`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in_person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Integrations</h2>
          <p className="text-muted-foreground">Manage meetings and calendar integrations</p>
        </div>
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">
                  {meetings.filter(m => m.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">
                  {meetings.filter(m => {
                    const meetingDate = new Date(m.scheduled_at);
                    const weekStart = new Date();
                    const weekEnd = new Date();
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return meetingDate >= weekStart && meetingDate <= weekEnd;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {meetings.filter(m => m.status === 'completed').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Integrations</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.is_active).length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getMeetingTypeIcon(meeting.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {meeting.client_name} • {format(new Date(meeting.scheduled_at), 'MMM d, yyyy h:mm a')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.duration_minutes} minutes • {meeting.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                      {meeting.meeting_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {integration.provider === 'zoom' && <Video className="h-4 w-4" />}
                        {integration.provider === 'google_meet' && <Calendar className="h-4 w-4" />}
                        {integration.provider === 'calendly' && <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{integration.provider.replace('_', ' ')}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last synced: {format(new Date(integration.last_sync), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={integration.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {integration.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={() => toggleIntegration(integration.id, integration.provider)}
                      />
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Meeting Dialog */}
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
                value={newMeeting.type} 
                onValueChange={(value: any) => setNewMeeting({...newMeeting, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
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
                placeholder="Client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input
                type="email"
                value={newMeeting.client_email}
                onChange={(e) => setNewMeeting({...newMeeting, client_email: e.target.value})}
                placeholder="client@example.com"
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
                min="15"
                step="15"
              />
            </div>
          </div>
          
          {newMeeting.type === 'in_person' && (
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                placeholder="Meeting location"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}