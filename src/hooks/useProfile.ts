
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

interface UserProfile {
  id: string;
  name?: string;
  role?: string;
  email?: string;
}

export function useProfile() {
  const { userProfile } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('id, name, role, email')
          .eq('id', userProfile.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // If no data returned from Supabase, use the context user profile
        const profileData = data || {
          id: userProfile.id,
          name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          role: userProfile.role,
          email: userProfile.email
        };

        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Fallback to context user data
        setProfile({
          id: userProfile.id,
          name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          role: userProfile.role,
          email: userProfile.email
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userProfile?.id]);

  return { profile, loading, error };
}
