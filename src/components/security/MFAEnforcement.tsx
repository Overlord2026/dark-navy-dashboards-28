
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { authSecurityService } from '@/services/security/authSecurity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { TwoFactorToggle } from "@/components/profile/TwoFactorToggle";
import { getEnvironmentConfig } from '@/utils/environment';

interface MFAEnforcementProps {
  onMFAEnabled?: () => void;
  onAccessBlocked?: () => void;
}

export function MFAEnforcement({ onMFAEnabled, onAccessBlocked }: MFAEnforcementProps) {
  const { user, logout } = useAuth();
  const { userProfile } = useUser();
  
  // QA MODE: Always disable MFA enforcement regardless of environment
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-blue-800 dark:text-blue-200">QA Testing Mode</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
            MFA Disabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          🛠️ QA Mode Active: Multi-Factor Authentication enforcement is temporarily disabled for testing. 
          All authentication barriers have been removed to enable comprehensive QA testing.
        </p>
      </CardContent>
    </Card>
  );

  const [mfaStatus, setMfaStatus] = useState<{
    requiresMFA: boolean;
    mfaEnabled: boolean;
    shouldBlock: boolean;
    gracePeriodExpired: boolean;
    loading: boolean;
  }>({
    requiresMFA: false,
    mfaEnabled: false,
    shouldBlock: false,
    gracePeriodExpired: false,
    loading: true
  });

  const [gracePeriodHours, setGracePeriodHours] = useState<number>(0);

  useEffect(() => {
    checkMFAStatus();
  }, [user, userProfile]);

  const checkMFAStatus = async () => {
    if (!user || !userProfile?.role) {
      setMfaStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const status = await authSecurityService.enforcePrivilegedUserMFA(
        user.id,
        userProfile.role
      );

      setMfaStatus({
        ...status,
        loading: false
      });

      // Calculate remaining grace period
      if (status.requiresMFA && !status.mfaEnabled && !status.gracePeriodExpired) {
        const accountAge = Date.now() - new Date(user.created_at).getTime();
        const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        const remainingMs = gracePeriodMs - accountAge;
        const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
        setGracePeriodHours(remainingHours);
      }

      // Handle access blocking
      if (status.shouldBlock && onAccessBlocked) {
        onAccessBlocked();
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setMfaStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleForceLogout = async () => {
    try {
      await authSecurityService.rotateUserSessions(user!.id, 'mfa_enforcement_violation');
      logout();
    } catch (error) {
      console.error('Error during forced logout:', error);
      logout(); // Fallback to local logout
    }
  };

  const handleMFAEnabled = () => {
    setMfaStatus(prev => ({ ...prev, mfaEnabled: true, shouldBlock: false }));
    if (onMFAEnabled) {
      onMFAEnabled();
    }
  };

  if (mfaStatus.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Checking security requirements...</span>
      </div>
    );
  }

  // No MFA required for this role
  if (!mfaStatus.requiresMFA) {
    return null;
  }

  // MFA is enabled - show success state
  if (mfaStatus.mfaEnabled) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800 dark:text-green-200">
              Security Compliant
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 dark:text-green-300">
            Multi-factor authentication is enabled for your privileged account.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Access is blocked - show blocking message
  if (mfaStatus.shouldBlock) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-800 dark:text-red-200">
              Access Restricted
            </CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            Multi-factor authentication is required for your privileged account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Your account has privileged access ({userProfile?.role}) and requires MFA. 
              The 7-day grace period has expired. Please enable MFA to continue using the application.
            </AlertDescription>
          </Alert>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <TwoFactorToggle onMFAEnabled={handleMFAEnabled} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={checkMFAStatus}
              variant="outline"
              className="flex-1"
            >
              Recheck Status
            </Button>
            <Button 
              onClick={handleForceLogout}
              variant="destructive"
              className="flex-1"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grace period active - show warning
  return (
    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800 dark:text-amber-200">
            MFA Required Soon
          </CardTitle>
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            {gracePeriodHours}h remaining
          </Badge>
        </div>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          Your privileged account requires multi-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            As a {userProfile?.role}, you must enable MFA within the grace period. 
            After {gracePeriodHours} hours, access will be restricted until MFA is enabled.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Grace period progress</span>
            <span>{Math.max(0, 168 - gracePeriodHours)}/168 hours used</span>
          </div>
          <Progress 
            value={((168 - gracePeriodHours) / 168) * 100} 
            className="h-2"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <TwoFactorToggle onMFAEnabled={handleMFAEnabled} />
        </div>

        <Button 
          onClick={checkMFAStatus}
          variant="outline"
          className="w-full"
        >
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  );
}
