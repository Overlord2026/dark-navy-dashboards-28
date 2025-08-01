import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Mic, 
  Users, 
  Calendar, 
  Plus,
  Shield,
  Smartphone,
  Monitor,
  FileVideo,
  Clock
} from 'lucide-react';
import MeetingRecorder from '@/components/recording/MeetingRecorder';
import RecordingsList from '@/components/recording/RecordingsList';

const RecordingsPage: React.FC = () => {
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');

  // Mock data for demonstration
  const upcomingMeetings = [
    {
      id: '1',
      clientName: 'John Smith',
      clientId: 'client-1',
      title: 'Portfolio Review',
      scheduledTime: '2024-01-15T14:00:00Z',
      type: 'in-person'
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      clientId: 'client-2',
      title: 'Investment Planning',
      scheduledTime: '2024-01-15T16:00:00Z',
      type: 'in-person'
    }
  ];

  const recordingStats = {
    totalRecordings: 24,
    totalDuration: '18:45:23',
    storageUsed: '2.4 GB',
    thisMonth: 8
  };

  const handleRecordingComplete = (recordingId: string) => {
    setIsRecorderOpen(false);
    // Refresh recordings list or navigate to recording
  };

  const startMeetingRecording = (clientId?: string, meetingId?: string) => {
    setSelectedClientId(clientId || '');
    setSelectedMeetingId(meetingId || '');
    setIsRecorderOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meeting Recordings</h1>
          <p className="text-muted-foreground">
            Record, manage, and review your client meeting recordings securely
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Shield className="h-3 w-3 mr-1" />
            Secure & Compliant
          </Badge>
          
          <Dialog open={isRecorderOpen} onOpenChange={setIsRecorderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Video className="h-4 w-4 mr-2" />
                Record Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record In-Person Meeting</DialogTitle>
                <DialogDescription>
                  Capture audio and video from your device for client meetings
                </DialogDescription>
              </DialogHeader>
              
              <MeetingRecorder
                clientId={selectedClientId}
                meetingId={selectedMeetingId}
                onRecordingSaved={handleRecordingComplete}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileVideo className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{recordingStats.totalRecordings}</div>
                <div className="text-sm text-muted-foreground">Total Recordings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{recordingStats.totalDuration}</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{recordingStats.storageUsed}</div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{recordingStats.thisMonth}</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Upcoming In-Person Meetings
          </CardTitle>
          <CardDescription>
            Quick start recording for your scheduled meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming in-person meetings scheduled
            </div>
          ) : (
            <div className="grid gap-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{meeting.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Client: {meeting.clientName} • {new Date(meeting.scheduledTime).toLocaleString()}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startMeetingRecording(meeting.clientId, meeting.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Compatibility Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Smartphone className="h-5 w-5" />
            <Monitor className="h-5 w-5" />
            Multi-Device Support
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Mobile Devices (iOS/Android)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Native camera and microphone access</li>
                <li>• Optimized touch controls</li>
                <li>• Background recording prevention</li>
                <li>• Automatic quality adjustment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Desktop/Laptop</h4>
              <ul className="space-y-1 text-sm">
                <li>• High-quality video recording</li>
                <li>• Multiple camera/microphone selection</li>
                <li>• Screen sharing capabilities</li>
                <li>• Advanced recording controls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all-recordings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-recordings">All Recordings</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="by-client">By Client</TabsTrigger>
        </TabsList>

        <TabsContent value="all-recordings" className="space-y-4">
          <RecordingsList showAllRecordings={true} />
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Recordings (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordingsList showAllRecordings={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-client" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recordings by Client</CardTitle>
              <CardDescription>
                View recordings organized by client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Client-organized view coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Privacy and Compliance Footer */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">Privacy & Compliance</div>
              <ul className="space-y-1 text-xs">
                <li>• All recordings are encrypted at rest and in transit</li>
                <li>• Access is logged and auditable for compliance purposes</li>
                <li>• Recordings can be deleted as per client request and retention policies</li>
                <li>• Ensure proper consent is obtained before recording any meeting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordingsPage;