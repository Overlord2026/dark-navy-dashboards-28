import React, { useState, useRef, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Send, Shield, AlertTriangle, PhoneCall } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveMeetingNote } from '@/services/notes';
import { transcribeAudio } from '@/services/voice';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface VoiceDrawerProps {
  persona: string;
  onNoteSaved?: (note: string) => void;
}

const FORBIDDEN_TOPICS = [
  'insider trading', 'market manipulation', 'tax evasion', 'money laundering',
  'bribery', 'kickbacks', 'ponzi', 'pyramid scheme', 'cryptocurrency scam'
];

const COMPLIANCE_CONTACTS = {
  advisor: { name: 'Compliance Dept', phone: '1-800-555-0199' },
  cpa: { name: 'Ethics Hotline', phone: '1-800-555-0188' },
  attorney: { name: 'Bar Association', phone: '1-800-555-0177' },
  insurance: { name: 'DOI Compliance', phone: '1-800-555-0166' }
};

export function VoiceDrawer({ persona, onNoteSaved }: VoiceDrawerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { ready, live, error, start, stop, audioElRef } = useRealtimeVoice();
  
  const VOICE_LIVE_ENABLED = false; // Feature flag

  const checkForbiddenTopics = (text: string): string[] => {
    return FORBIDDEN_TOPICS.filter(topic => 
      text.toLowerCase().includes(topic.toLowerCase())
    );
  };

  const handleSaveNote = async () => {
    if (!transcript.trim()) return;

    try {
      await saveMeetingNote({ persona, text: transcript });
      setRecentNotes(prev => [transcript, ...prev.slice(0, 2)]);
      onNoteSaved?.(transcript);
      setTranscript('');
      
      toast({
        title: "Note Saved",
        description: "Meeting note saved successfully",
      });
    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: "Save Failed",
        description: "Could not save meeting note",
        variant: "destructive"
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Mic className="h-4 w-4" />
          Voice Assistant
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Assistant - {persona.charAt(0).toUpperCase() + persona.slice(1)}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="consent"
                checked={consentGiven}
                onCheckedChange={setConsentGiven}
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to audio recording and transcription for meeting notes
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Transcript will appear here..."
              className="min-h-[120px]"
            />
            
            <Button
              onClick={handleSaveNote}
              disabled={!transcript.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Save Meeting Note
            </Button>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Compliance Guardian Active:</strong> Forbidden topics monitored.
            </AlertDescription>
          </Alert>
        </div>
      </DrawerContent>
    </Drawer>
  );
}