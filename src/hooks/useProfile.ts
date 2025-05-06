
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
        
        // The Supabase database doesn't have a 'users' table, it only has 'user_roles'
        // Instead of trying to fetch from a non-existent table, we'll directly use the user profile
        // data from the context, which is what we'd fall back to anyway
        
        // Create profile data from the context
        const profileData = {
          id: userProfile.id,
          name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          role: userProfile.role,
          email: userProfile.email
        };

        setProfile(profileData);
      } catch (err) {
        console.error("Error handling profile:", err);
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
