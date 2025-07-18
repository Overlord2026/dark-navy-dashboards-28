
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

export function useRoleUpdate() {
  const { userProfile, refreshUserProfile } = useUser();

  useEffect(() => {
    const updateUserRole = async () => {
      if (userProfile?.id) {
        try {
          // Force update the user role to system_administrator
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'system_administrator' })
            .eq('id', userProfile.id);

          if (!error) {
            console.log('Role updated successfully');
            // Refresh the user profile to get the updated role
            setTimeout(() => {
              refreshUserProfile();
            }, 500);
          } else {
            console.error('Error updating role:', error);
          }
        } catch (error) {
          console.error('Error in role update:', error);
        }
      }
    };

    // Only run this once when the component mounts and user is available
    if (userProfile?.role === 'client') {
      updateUserRole();
    }
  }, [userProfile?.id, userProfile?.role, refreshUserProfile]);
}
