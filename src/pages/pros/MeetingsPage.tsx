import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, Search, FileText, Clock, Users } from 'lucide-react';
import {
  startSession,
  endSession,
  getMeetingSessions,
  searchSessions,
  recordConsent,
  summarizeSession,
  type MeetingSession,
  type ConsentRequirement
} from '@/services/meetings';

export function MeetingsPage() {
  const [sessions, setSessions] = useState<MeetingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<MeetingSession | null>(null);
  const [consent, setConsent] = useState<ConsentRequirement | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { toast } = useToast();

  const agentId = 'current-agent-id'; // TODO: Get from auth context

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getMeetingSessions(agentId);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting sessions",
        variant: "destructive"
      });
    }
  };

  const handleStartSession = async () => {
    try {
      const familyId = prompt('Enter Family ID (optional):') || undefined;
      const state = prompt('Enter state code (e.g., CA, NY):') || 'NY';
      
      const result = await startSession(agentId, familyId, state);
      setCurrentSession(result.session);
      setConsent(result.consent);
      setConsentGiven(false);
      
      toast({
        title: "Session Started",
        description: "Meeting session has been initiated"
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      toast({
        title: "Error",
        description: "Failed to start meeting session",
        variant: "destructive"
      });
    }
  };

  const handleConsentResponse = async (given: boolean) => {
    if (!currentSession) return;
    
    try {
      await recordConsent(currentSession.id, given);
      setConsentGiven(given);
      
      if (given) {
        await startRecording();
        toast({
          title: "Consent Recorded",
          description: "Recording has started"
        });
      } else {
        toast({
          title: "Consent Denied",
          description: "Meeting will continue without recording"
        });
      }
    } catch (error) {
      console.error('Failed to record consent:', error);
      toast({
        title: "Error",
        description: "Failed to record consent",
        variant: "destructive"
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Error",
        description: "Failed to start audio recording",
        variant: "destructive"
      });
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;
    
    try {
      let audioBlob: Blob | undefined;
      
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Create audio blob from chunks
        if (audioChunks.length > 0) {
          audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        }
      }
      
      await endSession(currentSession.id, audioBlob);
      
      // Mock intent analysis
      const mockIntents = [
        { type: 'switch_carrier', confidence: 0.8, band: 'carrier_switch' },
        { type: 'add_driver', confidence: 0.6, band: 'policy_change' }
      ];
      
      await summarizeSession(currentSession.id, mockIntents);
      
      setCurrentSession(null);
      setConsent(null);
      setConsentGiven(false);
      setIsRecording(false);
      setMediaRecorder(null);
      setAudioChunks([]);
      
      await loadSessions();
      
      toast({
        title: "Session Ended",
        description: "Meeting has been recorded and summarized"
      });
    } catch (error) {
      console.error('Failed to end session:', error);
      toast({
        title: "Error",
        description: "Failed to end meeting session",
        variant: "destructive"
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadSessions();
      return;
    }
    
    try {
      const results = await searchSessions(agentId, searchQuery);
      setSessions(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return `${minutes} min`;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Meeting Management</h1>
            {!currentSession ? (
              <Button onClick={handleStartSession} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Meeting
              </Button>
            ) : (
              <Button 
                onClick={handleEndSession} 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                End Meeting
              </Button>
            )}
          </div>

          {/* Current Session */}
          {currentSession && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                  Active Meeting Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Session ID:</span>
                    <p className="font-mono">{currentSession.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">State:</span>
                    <p>{currentSession.state}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Consent Mode:</span>
                    <p>{currentSession.consent_mode}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p>{formatDuration(currentSession.started_at)}</p>
                  </div>
                </div>

                {/* Consent Banner */}
                {consent && !consentGiven && (
                  <div className="bg-muted p-4 rounded-lg border">
                    <p className="mb-3 font-medium">{consent.disclosure_text}</p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleConsentResponse(true)}
                        className="flex-1"
                      >
                        I Consent
                      </Button>
                      <Button 
                        onClick={() => handleConsentResponse(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                )}

                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
                    Recording in progress...
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search sessions by intent, state, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Sessions List */}
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        Session {session.id.slice(0, 8)}...
                      </h3>
                      <Badge variant={
                        session.status === 'active' ? 'default' :
                        session.status === 'ended' ? 'secondary' : 'outline'
                      }>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.started_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(session.started_at, session.ended_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {session.consent_mode} consent
                    </div>
                    <div>
                      State: {session.state}
                    </div>
                    {session.vault_document_id && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Recorded
                      </div>
                    )}
                  </div>

                  {session.summary && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Primary Intent: </span>
                      <Badge variant="outline">
                        {session.summary.primary_intent}
                      </Badge>
                      {session.summary.intent_count > 1 && (
                        <span className="ml-2 text-muted-foreground">
                          +{session.summary.intent_count - 1} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No meeting sessions found.</p>
              <p className="text-sm">Start your first meeting to begin.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}