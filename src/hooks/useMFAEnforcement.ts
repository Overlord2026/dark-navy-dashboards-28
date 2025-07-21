
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { authSecurityService } from '@/services/security/authSecurity';
import { useNavigate } from 'react-router-dom';

interface MFAEnforcementState {
  requiresMFA: boolean;
  mfaEnabled: boolean;
  shouldBlock: boolean;
  gracePeriodExpired: boolean;
  loading: boolean;
  gracePeriodHours: number;
}

export function useMFAEnforcement(redirectOnBlock: boolean = true) {
  const { user, logout } = useAuth();
  const { userProfile } = useUser();
  const navigate = useNavigate();
  
  const [state, setState] = useState<MFAEnforcementState>({
    requiresMFA: false,
    mfaEnabled: false,
    shouldBlock: false,
    gracePeriodExpired: false,
    loading: true,
    gracePeriodHours: 0
  });

  useEffect(() => {
    checkMFAStatus();
  }, [user, userProfile]);

  const checkMFAStatus = async () => {
    if (!user || !userProfile?.role) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const status = await authSecurityService.enforcePrivilegedUserMFA(
        user.id,
        userProfile.role
      );

      // Calculate remaining grace period
      let gracePeriodHours = 0;
      if (status.requiresMFA && !status.mfaEnabled && !status.gracePeriodExpired) {
        const accountAge = Date.now() - new Date(user.created_at).getTime();
        const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        const remainingMs = gracePeriodMs - accountAge;
        gracePeriodHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
      }

      setState({
        ...status,
        loading: false,
        gracePeriodHours
      });

      // Handle access blocking
      if (status.shouldBlock && redirectOnBlock) {
        // Force logout and redirect to auth page
        try {
          await authSecurityService.rotateUserSessions(user.id, 'mfa_enforcement_violation');
        } catch (error) {
          console.error('Error rotating sessions:', error);
        }
        logout();
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const forceLogout = async () => {
    try {
      if (user) {
        await authSecurityService.rotateUserSessions(user.id, 'manual_mfa_enforcement');
      }
    } catch (error) {
      console.error('Error during forced logout:', error);
    }
    logout();
  };

  return {
    ...state,
    checkMFAStatus,
    forceLogout
  };
}
