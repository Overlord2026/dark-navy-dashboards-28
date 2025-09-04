import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';

export interface VoiceDrawerProps {
  open?: boolean;
  onClose?: () => void;
  persona?: string;
  triggerLabel?: string;
  children?: React.ReactNode;
  endpoint?: string;
}

export function VoiceDrawer({
  open = false,
  onClose,
  persona = 'default',
  triggerLabel = 'Voice Assistant',
  children,
  endpoint
}: VoiceDrawerProps) {
  // Voice functionality disabled - show disabled state
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5" />
            Linda Voice Assistant (Disabled)
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Linda's voice functionality has been permanently disabled in the development environment.
              Voice features, greetings, and audio playback are not available.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              Navigation and login functionality remain fully operational.
            </p>
          </div>
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default VoiceDrawer;