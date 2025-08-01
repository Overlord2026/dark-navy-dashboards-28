import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Play, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Shield, 
  Clock, 
  User, 
  Video,
  Mic,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Recording {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_size: number;
  duration_seconds: number;
  recording_type: 'audio' | 'video';
  mime_type: string;
  device_info: any;
  recording_quality: string;
  consent_obtained: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  client_id?: string;
  meeting_id?: string;
}

interface RecordingsListProps {
  clientId?: string;
  meetingId?: string;
  showAllRecordings?: boolean;
}

const RecordingsList: React.FC<RecordingsListProps> = ({ 
  clientId, 
  meetingId, 
  showAllRecordings = false 
}) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'audio' | 'video'>('all');
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    fetchRecordings();
  }, [clientId, meetingId, showAllRecordings]);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = (supabase as any)
        .from('meeting_recordings')
        .select('*')
        .eq('advisor_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters based on props
      if (!showAllRecordings) {
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
        if (meetingId) {
          query = query.eq('meeting_id', meetingId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || recording.recording_type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const playRecording = async (recording: Recording) => {
    try {
      // Log access
      await (supabase as any).rpc('log_recording_access', {
        p_recording_id: recording.id,
        p_access_type: 'view',
        p_access_method: 'web'
      });

      setSelectedRecording(recording);
      setIsPlayerOpen(true);
    } catch (error) {
      console.error('Error accessing recording:', error);
      toast.error('Failed to access recording');
    }
  };

  const downloadRecording = async (recording: Recording) => {
    try {
      // Log access
      await (supabase as any).rpc('log_recording_access', {
        p_recording_id: recording.id,
        p_access_type: 'download',
        p_access_method: 'web'
      });

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('meeting-recordings')
        .createSignedUrl(recording.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = `${recording.title}.${recording.recording_type === 'video' ? 'webm' : 'webm'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast.error('Failed to download recording');
    }
  };

  const shareRecording = async (recording: Recording) => {
    try {
      // Create shareable link (implementation depends on your sharing requirements)
      const shareUrl = `${window.location.origin}/recordings/${recording.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: recording.title,
          text: `Meeting Recording: ${recording.title}`,
          url: shareUrl
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard');
      }

      // Log access
      await (supabase as any).rpc('log_recording_access', {
        p_recording_id: recording.id,
        p_access_type: 'share',
        p_access_method: 'web'
      });
    } catch (error) {
      console.error('Error sharing recording:', error);
      toast.error('Failed to share recording');
    }
  };

  const deleteRecording = async (recording: Recording) => {
    if (!window.confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }

    try {
      // Soft delete - update status instead of actual deletion for compliance
      const { error } = await (supabase as any)
        .from('meeting_recordings')
        .update({ 
          status: 'deleted', 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', recording.id);

      if (error) throw error;

      // Log access
      await (supabase as any).rpc('log_recording_access', {
        p_recording_id: recording.id,
        p_access_type: 'delete',
        p_access_method: 'web'
      });

      toast.success('Recording deleted');
      fetchRecordings(); // Refresh list
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="audio">Audio Only</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* Recordings Grid */}
      {filteredRecordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              {recordings.length === 0 ? 'No recordings found' : 'No recordings match your search criteria'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {recording.recording_type === 'video' ? (
                        <Video className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Mic className="h-5 w-5 text-green-600" />
                      )}
                      {recording.title}
                      {recording.consent_obtained && (
                        <Badge variant="outline" className="text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Consent
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {recording.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playRecording(recording)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    
                    <div className="relative">
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadRecording(recording)}
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareRecording(recording)}
                          className="w-full justify-start"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecording(recording)}
                          className="w-full justify-start text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Duration</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(recording.duration_seconds)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-muted-foreground">Size</div>
                    <div>{formatFileSize(recording.file_size)}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-muted-foreground">Quality</div>
                    <Badge variant="outline" className="capitalize">
                      {recording.recording_quality}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="font-medium text-muted-foreground">Created</div>
                    <div>{formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}</div>
                  </div>
                </div>

                {recording.device_info && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Recorded on {recording.device_info.isMobile ? 'mobile' : 'desktop'} device
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recording Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedRecording?.title}</DialogTitle>
            <DialogDescription>
              {selectedRecording?.description || 'Meeting recording playback'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecording && (
            <div className="space-y-4">
              <RecordingPlayer recording={selectedRecording} />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Duration: {formatDuration(selectedRecording.duration_seconds)} • 
                  Size: {formatFileSize(selectedRecording.file_size)} • 
                  Quality: {selectedRecording.recording_quality}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadRecording(selectedRecording)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecording(selectedRecording)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Recording Player Component
const RecordingPlayer: React.FC<{ recording: Recording }> = ({ recording }) => {
  const [signedUrl, setSignedUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSignedUrl();
  }, [recording]);

  const getSignedUrl = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('meeting-recordings')
        .createSignedUrl(recording.file_path, 3600); // 1 hour expiry

      if (error) throw error;
      setSignedUrl(data.signedUrl);
    } catch (error) {
      console.error('Error getting signed URL:', error);
      toast.error('Failed to load recording');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-black rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (recording.recording_type === 'video') {
    return (
      <video
        src={signedUrl}
        controls
        className="w-full max-h-96 bg-black rounded-lg"
        controlsList="nodownload"
      >
        Your browser does not support video playback.
      </video>
    );
  } else {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <div className="flex items-center justify-center mb-4">
          <Mic className="h-12 w-12 text-blue-600" />
        </div>
        <audio
          src={signedUrl}
          controls
          className="w-full"
          controlsList="nodownload"
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    );
  }
};

export default RecordingsList;