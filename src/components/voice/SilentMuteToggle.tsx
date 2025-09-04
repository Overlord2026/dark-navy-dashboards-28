import React from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';
import { shouldShowMuteToggle, isMuteToggleActive } from '@/utils/voiceSettings';

interface SilentMuteToggleProps {
  className?: string;
}

export function SilentMuteToggle({ className }: SilentMuteToggleProps) {
  // Only show if settings allow, but make it inactive
  if (!shouldShowMuteToggle()) {
    return null;
  }

  const handleClick = () => {
    // Do nothing - toggle is visible but inactive
    console.log('[Mute Toggle] Voice is permanently disabled in dev environment');
  };

  return (
    <Button
      variant="ghost" 
      size="sm"
      onClick={handleClick}
      disabled={!isMuteToggleActive()}
      className={`gap-2 opacity-50 cursor-not-allowed ${className}`}
      title="Voice functionality is disabled in development"
    >
      <VolumeX className="h-4 w-4" />
      <span className="text-xs">Voice Disabled</span>
    </Button>
  );
}