import { UserProfile } from '@/context/UserContext';

export const getClientTier = (userProfile: UserProfile | null): 'basic' | 'premium' => {
  if (!userProfile) return 'basic';
  
  // Prioritize explicit client_tier field
  if (userProfile.client_tier) {
    return userProfile.client_tier;
  }
  
  // Check subscription data for premium status
  // Note: 'client_premium' is a display role, not a database role
  
  return 'basic';
};

export const isPremiumClient = (userProfile: UserProfile | null): boolean => {
  return getClientTier(userProfile) === 'premium';
};

export const getEffectiveRole = (userProfile: UserProfile | null): string => {
  if (!userProfile?.role) return 'client';
  
  // For client roles, append tier information for navigation
  if (userProfile.role === 'client') {
    const tier = getClientTier(userProfile);
    return tier === 'premium' ? 'client_premium' : 'client';
  }
  
  return userProfile.role;
};