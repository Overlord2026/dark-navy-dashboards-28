
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

interface UserProfile {
  id: string;
  name?: string;
  role?: string;
  email?: string;
}

export function useProfile() {
  const { userProfile, isLoading: contextLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (contextLoading) {
      setLoading(true);
      return;
    }
    
    if (!userProfile?.id) {
      setLoading(false);
      return;
    }

    // Create profile data directly from the UserContext
    const profileData = {
      id: userProfile.id,
      name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
      role: userProfile.role,
      email: userProfile.email
    };

    setProfile(profileData);
    setLoading(false);
  }, [userProfile, contextLoading]);

  return { profile, loading, error };
}
