import { useMemo } from 'react';
import { canUse, Plan, FeatureKey } from '@/lib/featureAccess';
import { useAuth } from '@/context/AuthContext';
import { useFeatureFlags } from '@/lib/featureFlags';

export interface GateResult {
  allowed: boolean;
  plan: Plan;
  flags: any;
  blockedBy?: 'plan' | 'flag';
  requiredPlan?: Plan;
}

export function useGate(featureKey: FeatureKey): GateResult {
  const { userProfile } = useAuth(); // assume `userProfile.plan` exists or default
  const flags = useFeatureFlags();
  const plan: Plan = ((userProfile as any)?.plan ?? 'basic') as Plan;

  const enabledByFlag = useMemo(() => {
    const map: Record<string, boolean> = {
      families_tools_band: !!flags.families_tools_band,
      pricing_gates: !!flags.pricing_gates,
      consent_module: !!flags.consent_module,
      nil_booking_v1: !!flags.nil_booking_v1,
    };
    
    // Turn feature on if any controlling flag covers it
    if (featureKey === 'calculators_advanced') return map.pricing_gates;
    if (featureKey === 'secure_vault' || featureKey === 'custody_router') return map.pricing_gates;
    if (featureKey === 'nil_booking') return map.nil_booking_v1;
    if (featureKey === 'vault_advanced' || featureKey === 'properties') return map.families_tools_band;
    if (featureKey === 'e_sign_ron_ipen' || featureKey === 'concierge') return map.consent_module;
    
    return true; // Default to enabled if no specific flag controls it
  }, [flags, featureKey]);

  const allowedByPlan = canUse(plan, featureKey);
  
  const result: GateResult = {
    allowed: enabledByFlag && allowedByPlan,
    plan,
    flags
  };

  // Add diagnostic info about what's blocking access
  if (!result.allowed) {
    if (!enabledByFlag) {
      result.blockedBy = 'flag';
    } else if (!allowedByPlan) {
      result.blockedBy = 'plan';
      // Get the required plan from feature matrix
      const featureMatrix = {
        calculators_basic: 'basic',
        calculators_advanced: 'premium',
        secure_vault: 'premium',
        custody_router: 'elite',
        nil_booking: 'basic',
        accounts_overview: 'basic',
        goal_tracking: 'basic',
        document_vault: 'basic',
        cash_transfers: 'basic',
        vault_advanced: 'premium',
        properties: 'premium',
        estate_advanced: 'premium',
        tax_advanced: 'premium',
        e_sign_ron_ipen: 'elite',
        concierge: 'elite',
        link_accounts: 'basic',
        upload_doc: 'basic',
        create_goal: 'basic',
        run_swag: 'premium',
        run_monte_carlo: 'premium',
        invite_pro: 'basic'
      };
      result.requiredPlan = featureMatrix[featureKey] as Plan;
    }
  }

  return result;
}