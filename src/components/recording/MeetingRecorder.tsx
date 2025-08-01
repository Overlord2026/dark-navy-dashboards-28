import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Save, 
  Shield, 
  AlertTriangle,
  Clock,
  Smartphone,
  Monitor,
  Camera
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MeetingRecorderProps {
  clientId?: string;
  meetingId?: string;
  onRecordingSaved?: (recordingId: string) => void;
}

interface RecordingSettings {
  recordAudio: boolean;
  recordVideo: boolean;
  quality: 'low' | 'standard' | 'high';
  autoSave: boolean;
}

const MeetingRecorder: React.FC<MeetingRecorderProps> = ({ 
  clientId, 
  meetingId, 
  onRecordingSaved 
}) => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Recording data
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  // Settings and metadata
  const [settings, setSettings] = useState<RecordingSettings>({
    recordAudio: true,
    recordVideo: true,
    quality: 'standard',
    autoSave: true
  });

  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingDescription, setRecordingDescription] = useState('');

  // Device info
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    platform: navigator.platform,
    userAgent: navigator.userAgent.substring(0, 100)
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const checkPermissions = async () => {
    try {
      const constraints = {
        audio: settings.recordAudio,
        video: settings.recordVideo ? {
          width: { ideal: settings.quality === 'high' ? 1920 : settings.quality === 'standard' ? 1280 : 640 },
          height: { ideal: settings.quality === 'high' ? 1080 : settings.quality === 'standard' ? 720 : 480 },
          frameRate: { ideal: settings.quality === 'high' ? 30 : 24 }
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach(track => track.stop()); // Stop test stream
      setHasPermissions(true);
      toast.success('Camera and microphone permissions granted');
    } catch (error) {
      console.error('Permission denied:', error);
      setHasPermissions(false);
      toast.error('Camera/microphone permissions required for recording');
    }
  };

  const startRecording = async () => {
    if (!isConsentGiven) {
      toast.error('Please obtain consent before starting recording');
      return;
    }

    try {
      const constraints = {
        audio: settings.recordAudio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } : false,
        video: settings.recordVideo ? {
          width: { ideal: settings.quality === 'high' ? 1920 : settings.quality === 'standard' ? 1280 : 640 },
          height: { ideal: settings.quality === 'high' ? 1080 : settings.quality === 'standard' ? 720 : 480 },
          frameRate: { ideal: settings.quality === 'high' ? 30 : 24 }
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);

      // Display video preview
      if (videoRef.current && settings.recordVideo) {
        videoRef.current.srcObject = stream;
      }

      // Set up MediaRecorder
      const mimeType = settings.recordVideo 
        ? 'video/webm;codecs=vp9,opus' 
        : 'audio/webm;codecs=opus';
      
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: settings.recordVideo ? 'video/webm' : 'audio/webm' 
        });
        setRecordingBlob(blob);
        setRecordedChunks(chunks);
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Generate default title
      if (!recordingTitle) {
        const now = new Date();
        setRecordingTitle(`Meeting Recording - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
      }

      toast.success('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      toast.success('Recording paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      toast.success('Recording resumed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsRecording(false);
    setIsPaused(false);
    toast.success('Recording stopped');
  };

  const saveRecording = async () => {
    if (!recordingBlob) {
      toast.error('No recording to save');
      return;
    }

    if (!recordingTitle.trim()) {
      toast.error('Please enter a title for the recording');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = settings.recordVideo ? 'webm' : 'webm';
      const fileName = `${user.id}/${timestamp}-${recordingTitle.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meeting-recordings')
        .upload(fileName, recordingBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Save metadata to database
      const recordingData = {
        advisor_id: user.id,
        client_id: clientId,
        meeting_id: meetingId,
        title: recordingTitle,
        description: recordingDescription,
        file_path: uploadData.path,
        file_size: recordingBlob.size,
        duration_seconds: recordingTime,
        recording_type: settings.recordVideo ? 'video' : 'audio',
        mime_type: recordingBlob.type,
        device_info: deviceInfo,
        recording_quality: settings.quality,
        consent_obtained: isConsentGiven,
        consent_timestamp: new Date().toISOString(),
        consent_method: 'digital'
      };

      const { data: recordingRecord, error: dbError } = await (supabase as any)
        .from('meeting_recordings')
        .insert(recordingData)
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadProgress(100);

      // Log the access
      await (supabase as any).rpc('log_recording_access', {
        p_recording_id: recordingRecord.id,
        p_access_type: 'create',
        p_access_method: deviceInfo.isMobile ? 'mobile' : 'web'
      });

      toast.success('Recording saved successfully');
      
      // Reset state
      setRecordingBlob(null);
      setRecordedChunks([]);
      setRecordingTitle('');
      setRecordingDescription('');
      setRecordingTime(0);

      if (onRecordingSaved) {
        onRecordingSaved(recordingRecord.id);
      }

    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Consent and Permissions Check */}
      {!hasPermissions && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Camera and microphone permissions are required. 
            <Button variant="link" className="p-0 h-auto ml-2" onClick={checkPermissions}>
              Grant Permissions
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Privacy Consent */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            Recording Consent & Privacy Notice
          </CardTitle>
          <CardDescription>
            By recording this meeting, you acknowledge that all participants have been informed and have consented to being recorded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• This recording will be encrypted and stored securely</p>
            <p>• Access is limited to authorized personnel only</p>
            <p>• Recordings are subject to compliance and retention policies</p>
            <p>• Participants can request deletion at any time</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="consent"
              checked={isConsentGiven}
              onCheckedChange={setIsConsentGiven}
            />
            <Label htmlFor="consent" className="text-sm font-medium">
              I confirm that all participants have been informed and have consented to this recording
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Recording Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Recording Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="audio"
                checked={settings.recordAudio}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, recordAudio: checked }))}
                disabled={isRecording}
              />
              <Label htmlFor="audio" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Audio
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="video"
                checked={settings.recordVideo}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, recordVideo: checked }))}
                disabled={isRecording}
              />
              <Label htmlFor="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {deviceInfo.isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}
              </Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="quality">Recording Quality</Label>
            <select
              id="quality"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as any }))}
              disabled={isRecording}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="low">Low (640p, smaller file)</option>
              <option value="standard">Standard (720p, balanced)</option>
              <option value="high">High (1080p, larger file)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      {settings.recordVideo && (
        <Card>
          <CardContent className="p-4">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-md mx-auto rounded-lg bg-black"
              style={{ aspectRatio: '16/9' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Recording Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Timer */}
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">
                {formatTime(recordingTime)}
              </div>
              {isRecording && (
                <Badge variant={isPaused ? "secondary" : "destructive"} className="mt-2">
                  {isPaused ? 'PAUSED' : 'RECORDING'}
                </Badge>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={!hasPermissions || !isConsentGiven}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button onClick={pauseRecording} variant="outline" size="lg">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeRecording} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  <Button onClick={stopRecording} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>

            {/* Save Recording Dialog */}
            {recordingBlob && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-5 w-5 mr-2" />
                    Save Recording
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Save Recording</DialogTitle>
                    <DialogDescription>
                      Add details for your recording before saving
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={recordingTitle}
                        onChange={(e) => setRecordingTitle(e.target.value)}
                        placeholder="Meeting title or description"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={recordingDescription}
                        onChange={(e) => setRecordingDescription(e.target.value)}
                        placeholder="Additional notes about the recording"
                        rows={3}
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Duration: {formatTime(recordingTime)}</p>
                      <p>Size: {(recordingBlob.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p>Type: {settings.recordVideo ? 'Video' : 'Audio'}</p>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Uploading recording...</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={saveRecording}
                        disabled={isUploading || !recordingTitle.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUploading ? 'Saving...' : 'Save Recording'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRecorder;