
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { authSecurityService } from '@/services/security/authSecurity';
import { useNavigate } from 'react-router-dom';
import { getEnvironmentConfig } from '@/utils/environment';

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
    // QA MODE: Always disable MFA enforcement regardless of environment
    console.log('QA MODE: MFA enforcement disabled for all environments');
    setState({
      requiresMFA: false,
      mfaEnabled: true, // Pretend MFA is enabled to avoid UI issues
      shouldBlock: false,
      gracePeriodExpired: false,
      loading: false,
      gracePeriodHours: 0
    });
    return;

    if (!user || !userProfile?.role) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const status = await authSecurityService.enforcePrivilegedUserMFA(
        user.id,
        userProfile.role
      );

      // Calculate remaining grace period - aligned with backend (168 hours = 7 days)
      let gracePeriodHours = 0;
      if (status.requiresMFA && !status.mfaEnabled && !status.gracePeriodExpired) {
        const accountAge = Date.now() - new Date(user.created_at).getTime();
        const gracePeriodMs = 168 * 60 * 60 * 1000; // 168 hours (7 days) - aligned with backend
        const remainingMs = gracePeriodMs - accountAge;
        gracePeriodHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
      }

      setState({
        ...status,
        loading: false,
        gracePeriodHours
      });

      // Handle access blocking - but only if not in QA bypass mode
      if (status.shouldBlock && redirectOnBlock) {
        console.log('MFA enforcement blocking access:', {
          userId: user.id,
          userRole: userProfile.role,
          mfaEnabled: status.mfaEnabled,
          gracePeriodExpired: status.gracePeriodExpired
        });
        
        // Give user a moment to see the error before redirecting
        setTimeout(async () => {
          try {
            await authSecurityService.rotateUserSessions(user.id, 'mfa_enforcement_violation');
          } catch (error) {
            console.error('Error rotating sessions:', error);
          }
          logout();
          navigate('/auth');
        }, 2000);
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
