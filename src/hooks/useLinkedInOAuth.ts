import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { useEventTracking } from '@/hooks/useEventTracking';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  profilePhotoUrl: string;
  email: string;
  experience: Array<{
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
}

export const useLinkedInOAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const { toast } = useToast();
  const { trackFeatureUsed } = useEventTracking();

  const generateLinkedInAuthUrl = () => {
    const clientId = '78c9g8au2ddoil';
    const redirectUri = `${window.location.origin}/linkedin-callback`;
    const scope = 'r_liteprofile r_emailaddress w_member_social';
    const state = crypto.randomUUID();
    
    // Store state in session storage for security
    sessionStorage.setItem('linkedin_oauth_state', state);
    
    return `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=${encodeURIComponent(scope)}`;
  };

  const initiateLinkedInAuth = () => {
    setIsConnecting(true);
    trackFeatureUsed('linkedin_oauth_initiated');
    
    try {
      const authUrl = generateLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating LinkedIn auth:', error);
      setIsConnecting(false);
      toast({
        title: "Authentication Error",
        description: "Failed to initiate LinkedIn authentication",
        variant: "destructive",
      });
    }
  };

  const handleLinkedInCallback = async (code: string, state: string) => {
    try {
      // Verify state
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid OAuth state');
      }
      
      sessionStorage.removeItem('linkedin_oauth_state');

      // Exchange code for profile data using edge function
      const { data, error } = await supabase.functions.invoke('linkedin-import', {
        body: {
          code,
          redirectUri: `${window.location.origin}/linkedin-callback`
        }
      });

      if (error) throw error;

      if (data.success) {
        const linkedInProfile = data.profile;
        setProfile(linkedInProfile);

        // Update user profile with LinkedIn data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({
              full_name: `${linkedInProfile.firstName} ${linkedInProfile.lastName}`,
              linkedin_profile: linkedInProfile,
              professional_headline: linkedInProfile.headline,
              professional_summary: linkedInProfile.summary,
              avatar_url: linkedInProfile.profilePhotoUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          analytics.track('linkedin_profile_imported', {
            user_id: user.id,
            has_experience: linkedInProfile.experience?.length > 0,
            has_education: linkedInProfile.education?.length > 0,
            has_photo: !!linkedInProfile.profilePhotoUrl
          });

          trackFeatureUsed('linkedin_oauth_success');

          toast({
            title: "LinkedIn Connected!",
            description: "Your professional profile has been imported successfully.",
          });

          return linkedInProfile;
        }
      } else {
        throw new Error(data.error || 'Failed to import LinkedIn profile');
      }
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      trackFeatureUsed('linkedin_oauth_error');
      
      toast({
        title: "Connection Failed",
        description: "Unable to import LinkedIn profile. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const disconnectLinkedIn = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            linkedin_profile: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        setProfile(null);
        
        analytics.track('linkedin_profile_disconnected', {
          user_id: user.id
        });

        toast({
          title: "LinkedIn Disconnected",
          description: "Your LinkedIn profile has been removed from your account.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect LinkedIn profile",
        variant: "destructive",
      });
    }
  };

  return {
    isConnecting,
    profile,
    initiateLinkedInAuth,
    handleLinkedInCallback,
    disconnectLinkedIn,
    setIsConnecting
  };
};