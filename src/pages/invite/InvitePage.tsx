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
        // TODO: lookup token in Supabase (prospect_invitations table)
        // const { data, error } = await supabase
        //   .from('prospect_invitations')
        //   .select('persona_group, target_path, status')
        //   .eq('invitation_token', token)
        //   .single();

        // For now, default to family persona
        const persona_group: PersonaGroup = "family";
        
        // Set persona context
        localStorage.setItem("persona_group", persona_group);
        document.cookie = `persona_group=${persona_group};path=/;SameSite=Lax`;
        
        // Fire persona-switched event
        window.dispatchEvent(new CustomEvent("persona-switched", { 
          detail: { group: persona_group } 
        }));

        // Redirect to appropriate landing
        const target = persona_group === "pro" ? "/pros" : "/families";
        window.location.replace(target);
        
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