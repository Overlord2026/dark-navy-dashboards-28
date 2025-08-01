import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Play, Download, Share, Calendar, Clock, User, Tag } from 'lucide-react';

interface MeetingRecording {
  id: string;
  meeting_id: string;
  recording_url: string;
  file_size: number;
  duration_seconds: number;
  recording_type: string;
  status: string;
  created_at: string;
  metadata: {
    meeting_topic?: string;
    meeting_start_time?: string;
    meeting_title?: string;
  };
  shared_with: string[];
  video_meetings?: {
    title: string;
    start_time: string;
    lead_id: string;
  };
}

export function MeetingRecordingsManager() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<MeetingRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<MeetingRecording | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecordings();
    }
  }, [user]);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('meeting_recordings')
        .select(`
          *,
          video_meetings (
            title,
            start_time,
            lead_id
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (recording: MeetingRecording) => {
    try {
      const response = await fetch(recording.recording_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${getRecordingTitle(recording)}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast.error('Failed to download recording');
    }
  };

  const handleShare = async () => {
    if (!selectedRecording || !shareEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // Update the shared_with array
      const currentShared = selectedRecording.shared_with || [];
      const updatedShared = [...currentShared, shareEmail];

      const { error } = await (supabase as any)
        .from('meeting_recordings')
        .update({ shared_with: updatedShared })
        .eq('id', selectedRecording.id);

      if (error) throw error;

      // Send share notification email
      await supabase.functions.invoke('send-recording-share-notification', {
        body: {
          to: shareEmail,
          recordingTitle: getRecordingTitle(selectedRecording),
          recordingUrl: selectedRecording.recording_url,
          sharedBy: user?.email,
          message: shareMessage
        }
      });

      toast.success('Recording shared successfully');
      setIsShareDialogOpen(false);
      setShareEmail('');
      setShareMessage('');
      fetchRecordings();
    } catch (error) {
      console.error('Error sharing recording:', error);
      toast.error('Failed to share recording');
    }
  };

  const getRecordingTitle = (recording: MeetingRecording) => {
    return recording.metadata?.meeting_topic || 
           recording.metadata?.meeting_title || 
           recording.video_meetings?.title || 
           'Meeting Recording';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredRecordings = recordings.filter(recording =>
    getRecordingTitle(recording).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading recordings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meeting Recordings</h2>
          <p className="text-muted-foreground">Manage and share your meeting recordings</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor="search">Search recordings</Label>
          <Input
            id="search"
            placeholder="Search by meeting title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRecordings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recordings found</h3>
                <p className="text-muted-foreground">
                  Meeting recordings will appear here automatically after your video meetings.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRecordings.map((recording) => (
            <Card key={recording.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      {getRecordingTitle(recording)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(recording.video_meetings?.start_time || recording.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(recording.duration_seconds)}
                      </span>
                      {recording.file_size && (
                        <span>{formatFileSize(recording.file_size)}</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={recording.status === 'completed' ? 'default' : 'secondary'}>
                    {recording.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(recording.recording_url, '_blank')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(recording)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecording(recording)}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Recording</DialogTitle>
                        <DialogDescription>
                          Share "{getRecordingTitle(recording)}" with others via secure email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="shareEmail">Email Address</Label>
                          <Input
                            id="shareEmail"
                            type="email"
                            placeholder="Enter email address"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="shareMessage">Message (Optional)</Label>
                          <Textarea
                            id="shareMessage"
                            placeholder="Add a personal message..."
                            value={shareMessage}
                            onChange={(e) => setShareMessage(e.target.value)}
                          />
                        </div>
                        {recording.shared_with.length > 0 && (
                          <div>
                            <Label>Already shared with:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {recording.shared_with.map((email) => (
                                <Badge key={email} variant="secondary">
                                  {email}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleShare}>
                          Share Recording
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {recording.shared_with.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Shared with {recording.shared_with.length} people
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}