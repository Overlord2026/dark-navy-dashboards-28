import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type PersonaGroup = "family" | "pro";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    const processInvitation = async () => {
      if (!token) return;

      try {
        console.log('Processing invitation token:', token);
        
        // Call the secure RPC function to validate and accept the invitation
        const { data, error } = await supabase.rpc('accept_invite', { 
          raw_token: token 
        });

        if (error) {
          console.error('Error validating invitation:', error);
          // Redirect to home with error
          window.location.replace("/?error=invalid_invitation");
          return;
        }

        if (!data || data.length === 0) {
          console.error('Invalid or expired invitation token');
          window.location.replace("/?error=expired_invitation");
          return;
        }

        const invitation = data[0];
        const persona_group: PersonaGroup = invitation.persona_group === 'pro' ? 'pro' : 'family';
        const target_path = invitation.target_path || (persona_group === 'pro' ? '/pros' : '/families');
        
        // Set persona context
        localStorage.setItem("persona_group", persona_group);
        document.cookie = `persona_group=${persona_group};path=/;SameSite=Lax`;
        
        // Fire persona-switched event
        window.dispatchEvent(new CustomEvent("persona-switched", { 
          detail: { group: persona_group } 
        }));

        // Redirect to appropriate target
        window.location.replace(target_path);
        
      } catch (error) {
        console.error('Error processing invitation:', error);
        // Fallback to home with error
        window.location.replace("/?error=invitation_error");
      }
    };

    processInvitation();
  }, [token]);

  // Show loading while processing
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Processing your invitation...</p>
      </div>
    </div>
  );
}