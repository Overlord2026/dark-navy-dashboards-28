
import { supabase } from '@/lib/supabase';
import { PasswordPolicyValidator, PasswordValidationResult } from './passwordPolicy';
import { auditLog } from '@/services/auditLog/auditLogService';
import { mfaBypassService } from './mfaBypassService';
import { getEnvironmentConfig } from '@/utils/environment';

export interface PrivilegedRole {
  role: string;
  requiresMFA: boolean;
  maxSessionDuration: number; // in hours
}

export const PRIVILEGED_ROLES: PrivilegedRole[] = [
  { role: 'admin', requiresMFA: true, maxSessionDuration: 8 },
  { role: 'tenant_admin', requiresMFA: true, maxSessionDuration: 8 },
  { role: 'system_administrator', requiresMFA: true, maxSessionDuration: 4 }, // MFA enforced for security
  { role: 'developer', requiresMFA: true, maxSessionDuration: 12 }, // MFA enforced for security
  { role: 'consultant', requiresMFA: false, maxSessionDuration: 24 },
  { role: 'accountant', requiresMFA: false, maxSessionDuration: 24 },
  { role: 'attorney', requiresMFA: false, maxSessionDuration: 24 }
];

export class AuthSecurityService {
  private passwordValidator: PasswordPolicyValidator;

  constructor() {
    this.passwordValidator = new PasswordPolicyValidator();
  }

  async validatePasswordStrength(password: string, userId?: string): Promise<PasswordValidationResult> {
    let previousPasswords: string[] = [];
    
    if (userId) {
      // In a real implementation, we'd fetch password history from a secure store
      // For now, we'll simulate this check
      previousPasswords = [];
    }

    return this.passwordValidator.validatePassword(password, previousPasswords);
  }

  async checkMFARequirement(userRole: string): Promise<boolean> {
    const privilegedRole = PRIVILEGED_ROLES.find(pr => pr.role === userRole);
    return privilegedRole?.requiresMFA || false;
  }

  async enforcePrivilegedUserMFA(userId: string, userRole: string): Promise<{
    requiresMFA: boolean;
    mfaEnabled: boolean;
    shouldBlock: boolean;
    gracePeriodExpired: boolean;
  }> {
    // Check environment - disable MFA enforcement in non-production environments
    const env = getEnvironmentConfig();
    if (!env.isProduction) {
      console.log('MFA enforcement disabled in non-production environment');
      return {
        requiresMFA: false,
        mfaEnabled: true, // Pretend MFA is enabled to avoid UI issues
        shouldBlock: false,
        gracePeriodExpired: false
      };
    }

    const requiresMFA = await this.checkMFARequirement(userRole);
    
    if (!requiresMFA) {
      return {
        requiresMFA: false,
        mfaEnabled: false,
        shouldBlock: false,
        gracePeriodExpired: false
      };
    }

    // Check if user has MFA enabled
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('two_factor_enabled, created_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error checking MFA status:', error);
      return {
        requiresMFA: true,
        mfaEnabled: false,
        shouldBlock: true,
        gracePeriodExpired: true
      };
    }

    const mfaEnabled = profile.two_factor_enabled || false;
    
    // Check for active MFA bypass first
    const hasActiveBypass = await mfaBypassService.hasActiveMFABypass(userId);
    
    // Calculate grace period (168 hours = 7 days from account creation)
    const gracePeriodHours = 168; // 7 days for users to set up MFA
    const accountAge = Date.now() - new Date(profile.created_at).getTime();
    const gracePeriodMs = gracePeriodHours * 60 * 60 * 1000;
    const gracePeriodExpired = accountAge > gracePeriodMs;

    // Block access if MFA is required but not enabled, grace period expired, and no active bypass
    const shouldBlock = !mfaEnabled && gracePeriodExpired && !hasActiveBypass;

    // Log security event
    auditLog.log(
      userId,
      'mfa_enforcement_check',
      shouldBlock ? 'failure' : 'success',
      {
        userRole,
        requiresMFA,
        mfaEnabled,
        shouldBlock,
        gracePeriodExpired,
        accountAgeHours: Math.floor(accountAge / (1000 * 60 * 60))
      }
    );

    return {
      requiresMFA,
      mfaEnabled,
      shouldBlock,
      gracePeriodExpired
    };
  }

  async rotateUserSessions(userId: string, reason: string): Promise<void> {
    try {
      // Force sign out from all sessions
      const { error } = await supabase.auth.admin.signOut(userId, 'global');
      
      if (error) {
        console.error('Error rotating user sessions:', error);
        throw error;
      }

      // Log security action
      auditLog.log(
        userId,
        'session_rotation',
        'success',
        {
          reason,
          timestamp: new Date().toISOString(),
          action: 'force_signout_all_sessions'
        }
      );
    } catch (error) {
      auditLog.log(
        userId,
        'session_rotation',
        'failure',
        {
          reason,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      throw error;
    }
  }

  async auditUserAccounts(): Promise<{
    totalUsers: number;
    privilegedUsers: number;
    mfaCompliantPrivileged: number;
    orphanedAccounts: number;
    recommendations: string[];
  }> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, role, two_factor_enabled, last_login_at, created_at, email');

      if (error) {
        throw error;
      }

      const totalUsers = profiles?.length || 0;
      const privilegedRoleNames = PRIVILEGED_ROLES.filter(pr => pr.requiresMFA).map(pr => pr.role);
      const privilegedUsers = profiles?.filter(p => privilegedRoleNames.includes(p.role)) || [];
      const mfaCompliantPrivileged = privilegedUsers.filter(p => p.two_factor_enabled).length;
      
      // Define orphaned accounts (no login in 90 days, or never logged in after 30 days)
      const now = Date.now();
      const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      const orphanedAccounts = profiles?.filter(p => {
        const lastLogin = p.last_login_at ? new Date(p.last_login_at).getTime() : null;
        const createdAt = new Date(p.created_at).getTime();
        
        if (lastLogin) {
          return lastLogin < ninetyDaysAgo;
        } else {
          return createdAt < thirtyDaysAgo;
        }
      }) || [];

      const recommendations: string[] = [];
      
      if (privilegedUsers.length > mfaCompliantPrivileged) {
        recommendations.push(`${privilegedUsers.length - mfaCompliantPrivileged} privileged users need MFA enabled`);
      }
      
      if (orphanedAccounts.length > 0) {
        recommendations.push(`${orphanedAccounts.length} potentially orphaned accounts should be reviewed`);
      }
      
      if (totalUsers > 0 && (mfaCompliantPrivileged / privilegedUsers.length) < 1) {
        recommendations.push('Enforce mandatory MFA for all privileged accounts');
      }

      return {
        totalUsers,
        privilegedUsers: privilegedUsers.length,
        mfaCompliantPrivileged,
        orphanedAccounts: orphanedAccounts.length,
        recommendations
      };
    } catch (error) {
      console.error('Error auditing user accounts:', error);
      throw error;
    }
  }
}

export const authSecurityService = new AuthSecurityService();
