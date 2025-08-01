import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Video, 
  Calendar, 
  ExternalLink, 
  Settings, 
  Plus,
  Trash2,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';

interface VideoMeetingIntegration {
  id: string;
  provider: 'zoom' | 'google_meet' | 'teams';
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

interface VideoMeeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  join_url: string;
  provider: string;
  attendees: any[];
  phone_dial_in?: string;
  passcode?: string;
}

export function VideoMeetingManager() {
  const [integrations, setIntegrations] = useState<VideoMeetingIntegration[]>([]);
  const [meetings, setMeetings] = useState<VideoMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const { invoke: createMeeting, loading: creatingMeeting } = useEdgeFunction('create-video-meeting');
  const { invoke: syncMeetings, loading: syncing } = useEdgeFunction('sync-video-meetings');

  useEffect(() => {
    fetchIntegrations();
    fetchUpcomingMeetings();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_meeting_integrations' as any)
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching integrations:', error);
        return;
      }

      setIntegrations((data || []) as unknown as VideoMeetingIntegration[]);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  };

  const fetchUpcomingMeetings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_meetings' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching meetings:', error);
        return;
      }

      setMeetings((data || []) as unknown as VideoMeeting[]);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: 'zoom' | 'google_meet' | 'teams') => {
    try {
      setConnecting(provider);
      
      // This would redirect to OAuth flow
      const authUrl = `${window.location.origin}/api/auth/${provider}`;
      window.open(authUrl, '_blank', 'width=600,height=700');
      
      toast.info(`Opening ${provider} authentication...`);
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error('Failed to initiate connection');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('video_meeting_integrations' as any)
        .delete()
        .eq('id', integrationId);

      if (error) {
        console.error('Error disconnecting:', error);
        toast.error('Failed to disconnect');
        return;
      }

      setIntegrations(prev => prev.filter(int => int.id !== integrationId));
      toast.success('Integration disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect');
    }
  };

  const handleToggleIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('video_meeting_integrations' as any)
        .update({ is_active: isActive })
        .eq('id', integrationId);

      if (error) {
        console.error('Error updating integration:', error);
        toast.error('Failed to update integration');
        return;
      }

      setIntegrations(prev => prev.map(int => 
        int.id === integrationId ? { ...int, is_active: isActive } : int
      ));

      toast.success(`Integration ${isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating integration:', error);
      toast.error('Failed to update integration');
    }
  };

  const handleCreateMeeting = async (meetingData: {
    title: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    provider: string;
  }) => {
    try {
      const response = await createMeeting(meetingData);
      
      if (response.success) {
        toast.success('Meeting created successfully');
        fetchUpcomingMeetings();
      } else {
        toast.error(response.error?.userMessage || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    }
  };

  const handleSyncMeetings = async () => {
    try {
      const response = await syncMeetings();
      
      if (response.success) {
        toast.success('Meetings synced successfully');
        fetchUpcomingMeetings();
      } else {
        toast.error(response.error?.userMessage || 'Failed to sync meetings');
      }
    } catch (error) {
      console.error('Error syncing meetings:', error);
      toast.error('Failed to sync meetings');
    }
  };

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case 'zoom':
        return { name: 'Zoom', color: 'bg-blue-500', icon: '🎥' };
      case 'google_meet':
        return { name: 'Google Meet', color: 'bg-green-500', icon: '📹' };
      case 'teams':
        return { name: 'Microsoft Teams', color: 'bg-purple-500', icon: '💻' };
      default:
        return { name: provider, color: 'bg-gray-500', icon: '📱' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Video Meeting Integration</h2>
          <p className="text-muted-foreground">
            Connect your video conferencing platforms for seamless meeting management
          </p>
        </div>
        <Button onClick={handleSyncMeetings} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          Sync Meetings
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['zoom', 'google_meet', 'teams'].map((provider) => {
          const integration = integrations.find(int => int.provider === provider);
          const { name, color, icon } = getProviderInfo(provider);
          
          return (
            <Card key={provider}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  {name}
                  {integration && (
                    <Badge variant={integration.is_active ? "default" : "secondary"}>
                      {integration.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {integration ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={(checked) => 
                          handleToggleIntegration(integration.id, checked)
                        }
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Connected: {new Date(integration.created_at).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleConnect(provider as any)}
                    disabled={connecting === provider}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {connecting === provider ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Video Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Loading meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No upcoming meetings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => {
                const { name, color } = getProviderInfo(meeting.provider);
                
                return (
                  <div key={meeting.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{meeting.title}</h3>
                          <Badge variant="outline" className={color}>
                            {name}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            {new Date(meeting.start_time).toLocaleString()} - 
                            {new Date(meeting.end_time).toLocaleTimeString()}
                          </div>
                          {meeting.attendees && meeting.attendees.length > 0 && (
                            <div>
                              Attendees: {meeting.attendees.length}
                            </div>
                          )}
                          {meeting.phone_dial_in && (
                            <div>
                              Dial-in: {meeting.phone_dial_in}
                              {meeting.passcode && ` (Passcode: ${meeting.passcode})`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(meeting.join_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Create Meeting */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // This would open a create meeting modal
                toast.info('Create meeting dialog coming soon');
              }}
              disabled={creatingMeeting || integrations.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Meeting
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // This would open calendar sync settings
                toast.info('Calendar sync settings coming soon');
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Sync Settings
            </Button>
          </div>
          
          {integrations.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Connect at least one video conferencing platform to start creating meetings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}