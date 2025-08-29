// src/components/voice/VoiceMic.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, Wand2 } from 'lucide-react';
import { transcribeAudio, summarizeMeeting } from '@/services/voice';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Small utility to check mic
async function ensureMicPermission(): Promise<boolean> {
  try {
    const status = await navigator.permissions?.query?.({ name: 'microphone' as any });
    if (status && status.state === 'denied') return false;
    // Prompt now; media tracks will be closed immediately
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach(t => t.stop());
    return true;
  } catch {
    return false;
  }
}

export interface VoiceMicProps {
  // called with the final transcript
  onTranscript?: (text: string) => void;
  // if provided, component will auto-summarize and call back
  autoSummarize?: boolean;
  onSummary?: (summary: any) => void;

  // optional labels / persona tag for analytics
  label?: string;
  persona?: 'family' | 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'nil' | 'other';

  // limit recording length (seconds)
  maxDurationSec?: number;

  // size & class tweaks
  size?: 'sm' | 'md' | 'lg';
  className?: string;

  // disable entirely
  disabled?: boolean;
}

export default function VoiceMic({
  onTranscript,
  autoSummarize = false,
  onSummary,
  label = 'Voice',
  persona = 'family',
  maxDurationSec = 90,
  size = 'md',
  className,
  disabled
}: VoiceMicProps) {
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(s);
      if (s >= maxDurationSec) stopRecording();
    }, 250) as unknown as number;
  };

  const clearTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current as number);
    timerRef.current = null;
    setElapsed(0);
  };

  const startRecording = async () => {
    try {
      if (!(await ensureMicPermission())) {
        toast({
          title: 'Microphone blocked',
          description: 'Please allow microphone access in your browser settings.',
          variant: 'destructive'
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType =
        MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
        MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg' :
        'audio/webm'; // fallback

      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        try {
          setBusy(true);
          const blob = new Blob(chunksRef.current, { type: mimeType });
          // 1) transcribe
          const { text } = await transcribeAudio(blob);
          if (onTranscript) onTranscript(text ?? '');

          // 2) optional summarize
          if (autoSummarize && text) {
            const summary = await summarizeMeeting(text);
            if (onSummary) onSummary(summary);
          }
          toast({ title: 'Transcribed', description: 'Voice captured successfully.' });
        } catch (err: any) {
          toast({ title: 'Transcription failed', description: err?.message ?? String(err), variant: 'destructive' });
        } finally {
          setBusy(false);
        }
      };

      mr.start(100); // gather chunks every 100ms
      setRecording(true);
      startTimer();
    } catch (e: any) {
      toast({ title: 'Unable to start recording', description: e?.message ?? String(e), variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setRecording(false);
    clearTimer();
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
    };
  }, []);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  return (
    <TooltipProvider>
      <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={disabled || busy}
              variant={recording ? 'destructive' : 'default'}
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
              onClick={recording ? stopRecording : startRecording}
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : recording ? (
                <Square className="mr-2 h-4 w-4" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {recording ? `Stop ${minutes}:${seconds}` : `${label}`}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{recording ? 'Stop recording' : 'Record and transcribe with AI'}</p>
          </TooltipContent>
        </Tooltip>

        {autoSummarize && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Wand2 className="h-3 w-3" /> Auto-summary enabled
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}