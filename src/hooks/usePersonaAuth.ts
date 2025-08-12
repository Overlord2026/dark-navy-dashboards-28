// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export type PersonaKind = 'client' | 'advisor' | 'agent' | 'guardian' | 'coach' | 'sponsor' | 'admin';

export interface Persona {
  id: string;
  user_id: string;
  kind: PersonaKind;
  created_at: string;
}

export interface PersonaSession {
  id: string;
  user_id: string;
  persona_id: string;
  active: boolean;
  started_at: string;
  ended_at?: string;
}

export interface ConsentToken {
  id: string;
  subject_user: string;
  issuer_user?: string;
  scopes: {
    jurisdiction?: string[];
    media?: string[];
    likeness?: boolean;
    time?: { start: string; end: string };
    audience?: string[];
  };
  conditions?: {
    training?: boolean;
    disclosures?: string[];
    conflicts?: string[];
  };
  valid_from: string;
  valid_to?: string;
  status: 'active' | 'revoked' | 'expired';
}

export interface ReasonReceipt {
  id: string;
  user_id: string;
  persona_id: string;
  action_key: string;
  reason_code: string;
  explanation?: string;
  hash?: string;
  anchor_txid?: string;
  created_at: string;
}

export const usePersonaAuth = () => {
  const { user } = useAuth();
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeSession, setActiveSession] = useState<PersonaSession | null>(null);
  const [consentTokens, setConsentTokens] = useState<ConsentToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's personas and active session
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadPersonaData = async () => {
      try {
        // Load personas
        const { data: personasData } = await supabase
          .from('personas')
          .select('*')
          .eq('user_id', user.id);

        if (personasData) {
          setPersonas(personasData);
        }

        // Load active session
        const { data: sessionData } = await supabase
          .from('persona_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sessionData) {
          setActiveSession(sessionData);
          // Find the persona for this session
          const persona = personasData?.find(p => p.id === sessionData.persona_id);
          if (persona) {
            setCurrentPersona(persona);
          }
        }

        // Load consent tokens
        const { data: consentData } = await supabase
          .from('consent_tokens')
          .select('*')
          .eq('subject_user', user.id)
          .eq('status', 'active');

        if (consentData) {
          setConsentTokens(consentData);
        }
      } catch (error) {
        console.error('Error loading persona data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonaData();
  }, [user]);

  // Switch persona with instant UI update and reason receipt
  const switchPersona = useCallback(async (persona: Persona): Promise<ReasonReceipt | null> => {
    if (!user || !persona) return null;

    try {
      // Immediately update UI
      setCurrentPersona(persona);

      // End current session
      if (activeSession) {
        await supabase
          .from('persona_sessions')
          .update({ active: false, ended_at: new Date().toISOString() })
          .eq('id', activeSession.id);
      }

      // Start new session
      const { data: newSession } = await supabase
        .from('persona_sessions')
        .insert({
          user_id: user.id,
          persona_id: persona.id,
          active: true
        })
        .select()
        .single();

      if (newSession) {
        setActiveSession(newSession);
      }

      // Create reason receipt
      const receipt = await createReasonReceipt(
        persona.id,
        'persona_switch',
        'PERSONA_SWITCH_OK',
        `Switched to ${persona.kind} persona`
      );

      return receipt;
    } catch (error) {
      console.error('Error switching persona:', error);
      return null;
    }
  }, [user, activeSession]);

  // Check if action is allowed for current persona
  const checkActionPermission = useCallback((actionKey: string): { allowed: boolean; reason: string } => {
    if (!currentPersona) {
      return { allowed: false, reason: 'NO_PERSONA' };
    }

    // Define action permissions by persona
    const permissions: Record<PersonaKind, string[]> = {
      client: ['view_portfolio', 'request_meeting', 'view_documents'],
      advisor: ['create_proposal', 'manage_clients', 'view_all_portfolios', 'create_documents'],
      agent: ['represent_client', 'negotiate_terms', 'access_confidential'],
      guardian: ['approve_minor_actions', 'manage_trust', 'view_protected_info'],
      coach: ['provide_guidance', 'access_performance_data', 'create_plans'],
      sponsor: ['fund_activities', 'approve_expenses', 'view_financials'],
      admin: ['system_access', 'manage_users', 'view_audit_logs', 'configure_system']
    };

    const allowedActions = permissions[currentPersona.kind] || [];
    
    if (allowedActions.includes(actionKey) || currentPersona.kind === 'admin') {
      return { allowed: true, reason: 'OK_POLICY' };
    }

    return { allowed: false, reason: 'INSUFFICIENT_PERSONA_PERMISSIONS' };
  }, [currentPersona]);

  // Create reason receipt
  const createReasonReceipt = useCallback(async (
    personaId: string,
    actionKey: string,
    reasonCode: string,
    explanation?: string
  ): Promise<ReasonReceipt | null> => {
    if (!user) return null;

    try {
      const { data: receipt } = await supabase
        .from('reason_receipts')
        .insert({
          user_id: user.id,
          persona_id: personaId,
          action_key: actionKey,
          reason_code: reasonCode,
          explanation,
          hash: `sha256_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();

      return receipt;
    } catch (error) {
      console.error('Error creating reason receipt:', error);
      return null;
    }
  }, [user]);

  // Guard action with consent check and receipt generation
  const guardAction = useCallback(async (actionKey: string): Promise<{
    allowed: boolean;
    receipt: ReasonReceipt | null;
    reason: string;
  }> => {
    if (!currentPersona) {
      return {
        allowed: false,
        receipt: null,
        reason: 'No active persona'
      };
    }

    const permission = checkActionPermission(actionKey);
    
    const receipt = await createReasonReceipt(
      currentPersona.id,
      actionKey,
      permission.allowed ? 'OK_POLICY' : 'BLOCK_INSUFFICIENT_PERMISSIONS',
      permission.reason
    );

    return {
      allowed: permission.allowed,
      receipt,
      reason: permission.reason
    };
  }, [currentPersona, checkActionPermission, createReasonReceipt]);

  // Create consent token
  const createConsentToken = useCallback(async (
    scopes: ConsentToken['scopes'],
    conditions?: ConsentToken['conditions'],
    validTo?: string
  ): Promise<ConsentToken | null> => {
    if (!user) return null;

    try {
      const { data: token } = await supabase
        .from('consent_tokens')
        .insert({
          subject_user: user.id,
          scopes,
          conditions,
          valid_to: validTo,
          status: 'active'
        })
        .select()
        .single();

      if (token) {
        setConsentTokens(prev => [...prev, token]);
      }

      return token;
    } catch (error) {
      console.error('Error creating consent token:', error);
      return null;
    }
  }, [user]);

  // Revoke consent token
  const revokeConsentToken = useCallback(async (tokenId: string, reason?: string): Promise<boolean> => {
    try {
      // Update token status
      await supabase
        .from('consent_tokens')
        .update({ status: 'revoked' })
        .eq('id', tokenId);

      // Create revocation record
      await supabase
        .from('revocations')
        .insert({
          consent_id: tokenId,
          reason: reason || 'User revoked consent'
        });

      // Update local state
      setConsentTokens(prev => 
        prev.map(token => 
          token.id === tokenId 
            ? { ...token, status: 'revoked' as const }
            : token
        )
      );

      return true;
    } catch (error) {
      console.error('Error revoking consent token:', error);
      return false;
    }
  }, []);

  return {
    currentPersona,
    personas,
    activeSession,
    consentTokens,
    isLoading,
    switchPersona,
    checkActionPermission,
    guardAction,
    createReasonReceipt,
    createConsentToken,
    revokeConsentToken
  };
};