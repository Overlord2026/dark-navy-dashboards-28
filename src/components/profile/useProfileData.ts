
import { useState } from 'react';
import { mockUserProfile, UserProfile } from '@/data/mock/userProfile';

export const useProfileData = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  return {
    userProfile,
    updateUserProfile
  };
};
