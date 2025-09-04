import React from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';

interface VoiceMicButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export function VoiceMicButton({ onClick, children }: VoiceMicButtonProps) {
  const handleClick = () => {
    console.log('[Voice] Linda voice functionality is disabled in dev environment');
    // Still call onClick to potentially open drawer showing disabled state
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="gap-2 opacity-50"
      disabled
      title="Voice functionality is disabled in development"
    >
      <VolumeX className="h-4 w-4" />
      {children || 'Voice Disabled'}
    </Button>
  );
}