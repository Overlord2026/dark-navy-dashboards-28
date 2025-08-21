import React from 'react';
import { recordConsentRDS, ConsentRDS } from '@/features/healthcare/receipts';
import { getActiveConsents, validateConsent, type ConsentScope, type ActiveConsent } from './api';

export interface ConsentRequirement {
  purpose: 'care_coordination' | 'billing' | 'legal' | 'research' | 'quality_assurance';
  minimumScope?: string[];
  entities?: string[];
}

export interface ConsentEnforcementResult {
  allowed: boolean;
  consentRDS?: ConsentRDS;
  disclosures?: string[];
  blockedReason?: string;
}

export interface EnhancedReceiptData {
  disclosures: string[];
  [key: string]: any;
}

/**
 * Enforce HIPAA consent requirements for share/export operations
 */
export function enforceConsent(
  requirement: ConsentRequirement,
  userId?: string
): ConsentEnforcementResult {
  console.info('consent.enforce', {
    purpose: requirement.purpose,
    requiredScope: requirement.minimumScope?.length || 0,
    entities: requirement.entities?.length || 0
  });

  try {
    // Get active consents for user
    const activeConsents = getActiveConsents();
    
    // Find consent matching the purpose
    const matchingConsent = activeConsents.find(consent => 
      consent.scope.purpose === requirement.purpose &&
      consent.status === 'active'
    );

    if (!matchingConsent) {
      // No matching consent found - deny and record
      const denialRDS = recordConsentDenial(
        requirement.purpose,
        'CONSENT_NOT_FOUND',
        'No active consent found for this purpose'
      );

      return {
        allowed: false,
        consentRDS: denialRDS,
        blockedReason: 'No active consent found for purpose: ' + requirement.purpose
      };
    }

    // Check if consent is still fresh (not stale)
    const now = new Date();
    const consentTime = new Date(matchingConsent.consent_time);
    const daysSinceConsent = Math.floor((now.getTime() - consentTime.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check expiry
    if (matchingConsent.expiry && new Date(matchingConsent.expiry) < now) {
      const denialRDS = recordConsentDenial(
        requirement.purpose,
        'CONSENT_EXPIRED',
        `Consent expired on ${matchingConsent.expiry}`
      );

      return {
        allowed: false,
        consentRDS: denialRDS,
        blockedReason: 'Consent has expired'
      };
    }

    // Check freshness (90 days threshold)
    if (daysSinceConsent > 90) {
      const denialRDS = recordConsentDenial(
        requirement.purpose,
        'CONSENT_STALE',
        `Consent is ${daysSinceConsent} days old, exceeds 90-day freshness threshold`
      );

      return {
        allowed: false,
        consentRDS: denialRDS,
        blockedReason: 'Consent is stale and needs renewal'
      };
    }

    // Check scope requirements
    if (requirement.minimumScope) {
      const hasRequiredScope = requirement.minimumScope.every(requiredItem =>
        matchingConsent.scope.data_types.includes(requiredItem)
      );

      if (!hasRequiredScope) {
        const denialRDS = recordConsentDenial(
          requirement.purpose,
          'SCOPE_MISMATCH',
          'Consent scope does not include all required data types'
        );

        return {
          allowed: false,
          consentRDS: denialRDS,
          blockedReason: 'Insufficient consent scope for requested operation'
        };
      }
    }

    // Check entity requirements
    if (requirement.entities) {
      const hasRequiredEntities = requirement.entities.every(entity =>
        matchingConsent.scope.entities.includes(entity)
      );

      if (!hasRequiredEntities) {
        const denialRDS = recordConsentDenial(
          requirement.purpose,
          'SCOPE_MISMATCH',
          'Consent does not authorize sharing with required entities'
        );

        return {
          allowed: false,
          consentRDS: denialRDS,
          blockedReason: 'Consent does not authorize sharing with required entities'
        };
      }
    }

    // Consent is valid - prepare disclosures for receipt
    const disclosures = [
      'minimum-necessary',
      `purpose:${requirement.purpose}`,
      `consent-id:${matchingConsent.id}`,
      `consent-age:${daysSinceConsent}-days`
    ];

    // Add entity disclosures
    if (requirement.entities) {
      disclosures.push(...requirement.entities.map(entity => `shared-with:${entity}`));
    }

    console.info('consent.allowed', {
      purpose: requirement.purpose,
      consentId: matchingConsent.id,
      daysSinceConsent,
      disclosureCount: disclosures.length
    });

    return {
      allowed: true,
      disclosures
    };

  } catch (error) {
    console.error('consent.enforce.error', { error: String(error) });
    
    const errorRDS = recordConsentDenial(
      requirement.purpose,
      'SYSTEM_ERROR',
      'Consent validation system error'
    );

    return {
      allowed: false,
      consentRDS: errorRDS,
      blockedReason: 'System error during consent validation'
    };
  }
}

/**
 * Higher-order component that enforces consent requirements
 */
export function requireConsent<T extends Record<string, any>>(
  requirement: ConsentRequirement
) {
  return function ConsentGate(
    WrappedComponent: React.ComponentType<T>
  ): React.ComponentType<T & { onConsentDenied?: (result: ConsentEnforcementResult) => void }> {
    
    return function ConsentEnforcedComponent(props: T & { onConsentDenied?: (result: ConsentEnforcementResult) => void }) {
      const { onConsentDenied, ...wrappedProps } = props;

      // Check consent when component mounts or requirements change
      React.useEffect(() => {
        const enforcementResult = enforceConsent(requirement);
        
        if (!enforcementResult.allowed) {
          console.warn('consent.gate.blocked', {
            purpose: requirement.purpose,
            reason: enforcementResult.blockedReason
          });
          
          onConsentDenied?.(enforcementResult);
        }
      }, [requirement.purpose, requirement.minimumScope, requirement.entities, onConsentDenied]);

      // Always render the component, but it should check consent before performing actions
      return React.createElement(WrappedComponent, wrappedProps as T);
    };
  };
}

/**
 * Hook for consent-aware actions
 */
export function useConsentEnforcement(requirement: ConsentRequirement) {
  const [lastEnforcementResult, setLastEnforcementResult] = React.useState<ConsentEnforcementResult | null>(null);

  const checkConsent = React.useCallback(() => {
    const result = enforceConsent(requirement);
    setLastEnforcementResult(result);
    return result;
  }, [requirement.purpose, requirement.minimumScope, requirement.entities]);

  const executeWithConsent = React.useCallback(
    <TReturn>(
      action: (disclosures: string[]) => TReturn,
      onDenied?: (result: ConsentEnforcementResult) => void
    ): TReturn | null => {
      const result = checkConsent();
      
      if (!result.allowed) {
        onDenied?.(result);
        return null;
      }

      return action(result.disclosures || []);
    },
    [checkConsent]
  );

  return {
    checkConsent,
    executeWithConsent,
    lastResult: lastEnforcementResult
  };
}

/**
 * Enhance receipt data with consent disclosures
 */
export function enhanceReceiptWithDisclosures<T extends Record<string, any>>(
  baseReceiptData: T,
  disclosures: string[]
): T & EnhancedReceiptData {
  return {
    ...baseReceiptData,
    disclosures: [
      ...(baseReceiptData.disclosures || []),
      ...disclosures
    ]
  };
}

/**
 * Record a consent denial as Consent-RDS
 */
function recordConsentDenial(
  purpose: string,
  reason: string,
  details: string
): ConsentRDS {
  // Create a denial record using minimal scope
  const denialScope = [`purpose:${purpose}`, 'status:denied'];
  
  const denialRDS = recordConsentRDS(denialScope, purpose, 0);
  
  // Override the result to show denial
  const denialRecord: ConsentRDS = {
    ...denialRDS,
    hipaa_scope: denialScope,
    freshness_score: 0,
    expiry: new Date().toISOString(), // Immediate expiry for denial
    proof_hash: denialRDS.proof_hash + '_DENIED'
  };

  console.warn('consent.denied', {
    purpose,
    reason,
    details,
    rds_hash: denialRecord.proof_hash
  });

  return denialRecord;
}

/**
 * Middleware function to wrap API calls with consent enforcement
 */
export function withConsentEnforcement<TArgs extends readonly any[], TReturn>(
  requirement: ConsentRequirement,
  apiFunction: (disclosures: string[], ...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  return function enforcedApiFunction(...args: TArgs): TReturn {
    const enforcementResult = enforceConsent(requirement);
    
    if (!enforcementResult.allowed) {
      const error = new Error(`Consent required: ${enforcementResult.blockedReason}`);
      (error as any).consentRDS = enforcementResult.consentRDS;
      throw error;
    }

    return apiFunction(enforcementResult.disclosures || [], ...args);
  };
}