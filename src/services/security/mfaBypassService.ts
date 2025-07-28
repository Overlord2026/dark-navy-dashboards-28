/**
 * MFA Bypass Audit Service
 * Logs and tracks any bypassing of MFA requirements for privileged users
 */

import { supabase } from '@/lib/supabase';

export interface MFABypassRecord {
  id: string;
  user_id: string;
  user_role: string;
  bypass_reason: string;
  initiated_by: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export class MFABypassService {
  /**
   * Log an MFA bypass event for audit purposes
   */
  async logMFABypass(
    userId: string,
    userRole: string,
    bypassReason: string,
    initiatedBy?: string,
    durationHours: number = 24
  ): Promise<MFABypassRecord | null> {
    try {
      const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('mfa_bypass_audit')
        .insert({
          user_id: userId,
          user_role: userRole,
          bypass_reason: bypassReason,
          initiated_by: initiatedBy,
          expires_at: expiresAt,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to log MFA bypass:', error);
        return null;
      }

      // Also log to security audit
      await this.logSecurityEvent(userId, 'mfa_bypass_granted', 'high', {
        user_role: userRole,
        bypass_reason: bypassReason,
        initiated_by: initiatedBy,
        duration_hours: durationHours,
        expires_at: expiresAt
      });

      return data;
    } catch (error) {
      console.error('Error logging MFA bypass:', error);
      return null;
    }
  }

  /**
   * Check if user has an active MFA bypass
   */
  async hasActiveMFABypass(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('mfa_bypass_audit')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) {
        console.error('Error checking MFA bypass status:', error);
        return false;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking MFA bypass:', error);
      return false;
    }
  }

  /**
   * Revoke an active MFA bypass
   */
  async revokeMFABypass(userId: string, revokedBy?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mfa_bypass_audit')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Failed to revoke MFA bypass:', error);
        return false;
      }

      // Log the revocation
      await this.logSecurityEvent(userId, 'mfa_bypass_revoked', 'medium', {
        revoked_by: revokedBy,
        revoked_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error revoking MFA bypass:', error);
      return false;
    }
  }

  /**
   * Get all MFA bypass records for audit purposes
   */
  async getMFABypassAudit(limit: number = 100): Promise<MFABypassRecord[]> {
    try {
      const { data, error } = await supabase
        .from('mfa_bypass_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch MFA bypass audit:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching MFA bypass audit:', error);
      return [];
    }
  }

  /**
   * Clean up expired MFA bypasses
   */
  async cleanupExpiredBypasses(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('mfa_bypass_audit')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString())
        .eq('is_active', true)
        .select('id');

      if (error) {
        console.error('Failed to cleanup expired bypasses:', error);
        return 0;
      }

      const cleanedCount = data?.length || 0;
      
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired MFA bypasses`);
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up expired bypasses:', error);
      return 0;
    }
  }

  /**
   * Log security events to the security audit log
   */
  private async logSecurityEvent(
    userId: string,
    eventType: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      // Call the log-security-event edge function
      await supabase.functions.invoke('log-security-event', {
        body: {
          user_id: userId,
          event_type: eventType,
          severity,
          resource_type: 'mfa_bypass',
          action_performed: eventType,
          outcome: 'success',
          metadata
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}

export const mfaBypassService = new MFABypassService();