import React from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';

export interface VoiceMicProps {
  label?: string;
  disabled?: boolean;
  className?: string;
  onRecordingComplete?: (audioBlob: Blob) => void;
  onTranscriptionReceived?: (text: string) => void;
}

export default function VoiceMic({
  label = 'Voice Disabled',
  disabled = true,
  className = '',
  onRecordingComplete,
  onTranscriptionReceived
}: VoiceMicProps) {
  // Voice functionality permanently disabled
  const handleClick = () => {
    console.log('[Voice] Linda voice functionality is permanently disabled in dev environment');
  };

  return (
    <Button
      onClick={handleClick}
      disabled={true}
      variant="outline"
      size="sm"
      className={`gap-2 opacity-50 cursor-not-allowed ${className}`}
      title="Voice functionality is disabled in development"
    >
      <VolumeX className="h-4 w-4" />
      {label}
    </Button>
  );
}