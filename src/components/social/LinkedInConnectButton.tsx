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
      // Try real LinkedIn OAuth first, fallback to simulation
      const useRealOAuth = false; // Set to true when LinkedIn app is configured
      
      if (useRealOAuth) {
        // Generate LinkedIn OAuth URL
        const clientId = '78c9g8au2ddoil';
        const redirectUri = `${window.location.origin}/linkedin-callback`;
        const scope = 'r_liteprofile r_emailaddress w_member_social';
        const state = crypto.randomUUID();
        
        // Store state for security
        sessionStorage.setItem('linkedin_oauth_state', state);
        
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}&` +
          `scope=${encodeURIComponent(scope)}`;
        
        // Redirect to LinkedIn OAuth
        window.location.href = authUrl;
        return;
      }
      
      // Fallback: simulate the connection for demo
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