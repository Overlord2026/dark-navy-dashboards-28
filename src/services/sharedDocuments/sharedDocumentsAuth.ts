
import { supabase } from '@/lib/supabase';

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const validateUserAuthentication = (user: any) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};
