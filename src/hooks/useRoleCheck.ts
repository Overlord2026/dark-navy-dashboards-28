
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

export function useRoleCheck() {
  const { userProfile } = useUser();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!userProfile?.id) {
        setUserRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user roles from Supabase
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userProfile.id);

        if (error) {
          console.error('Error fetching roles:', error);
          setUserRoles([]);
        } else {
          const roles = data?.map(item => item.role) || [];
          setUserRoles(roles);
        }
      } catch (err) {
        console.error('Error handling roles:', err);
        setUserRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [userProfile?.id]);

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isAdvisor = (): boolean => {
    return hasRole('advisor');
  };

  const isClient = (): boolean => {
    return hasRole('client');
  };

  return {
    userRoles,
    hasRole,
    isAdmin,
    isAdvisor,
    isClient,
    isLoading
  };
}
