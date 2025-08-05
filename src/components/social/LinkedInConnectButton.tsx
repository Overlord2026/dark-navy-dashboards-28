import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEventTracking } from '@/hooks/useEventTracking';
import { Loader2, CheckCircle, Linkedin } from 'lucide-react';

interface LinkedInConnectButtonProps {
  onSuccess?: () => void;
  onSkip?: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export const LinkedInConnectButton: React.FC<LinkedInConnectButtonProps> = ({
  onSuccess,
  onSkip,
  variant = 'default',
  size = 'default'
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { trackFeatureUsed } = useEventTracking();

  const handleLinkedInConnect = async () => {
    setIsConnecting(true);
    trackFeatureUsed('linkedin_connect_attempt');

    try {
      // In a real implementation, this would initiate LinkedIn OAuth
      // For demo purposes, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "LinkedIn Connected!",
        description: "Your professional profile has been imported successfully.",
      });

      trackFeatureUsed('linkedin_connect_success');
      
      // Simulate profile data import
      setTimeout(() => {
        onSuccess?.();
      }, 1000);

    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to LinkedIn. Please try again.",
        variant: "destructive",
      });
      trackFeatureUsed('linkedin_connect_error');
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">LinkedIn Connected!</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleLinkedInConnect}
        disabled={isConnecting}
        variant={variant}
        size={size}
        className="w-full bg-[#0077b5] hover:bg-[#0077b5]/90 text-white"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Linkedin className="mr-2 h-4 w-4" />
            Import from LinkedIn
          </>
        )}
      </Button>
      
      {onSkip && (
        <Button
          onClick={onSkip}
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
        >
          Skip for now
        </Button>
      )}
    </div>
  );
};