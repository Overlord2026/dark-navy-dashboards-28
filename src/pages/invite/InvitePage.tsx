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
        // For now, fallback to family persona since prospect_invitations table may not have persona_group column
        console.log('Processing invitation token:', token);
        // Default to family persona for invitations
        const persona_group: PersonaGroup = "family";
        
        // Set persona context
        localStorage.setItem("persona_group", persona_group);
        document.cookie = `persona_group=${persona_group};path=/;SameSite=Lax`;
        
        // Fire persona-switched event
        window.dispatchEvent(new CustomEvent("persona-switched", { 
          detail: { group: persona_group } 
        }));

        // Always redirect to families for now
        window.location.replace("/families");
        
      } catch (error) {
        console.error('Error processing invitation:', error);
        // Fallback to families page
        window.location.replace("/families");
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