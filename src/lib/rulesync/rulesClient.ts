import { supabase } from "@/integrations/supabase/client";
import { sha256Hex, canonicalizeObject } from "@/lib/canonical";
import { TaxRuleBundle, TaxRuleContent, TaxRuleOrchestration, ValidationResult } from "@/types/tax-orchestration";

export type PolicyBundle = {
  id: string;
  tenant_id: string;
  domain: string;
  jurisdiction: string;
  version: string;
  bundle_id: string;
  provider_id: string;
  provider_sig: string | null;
  content: any;
  content_hash: string;
  effective_at: string;
  created_at: string;
  created_by: string;
};

export async function ensureTenant(): Promise<string> {
  // For now, return a default tenant ID - this would need proper implementation
  return "00000000-0000-0000-0000-000000000001";
}

export async function resolveBundle(domain: string, jurisdiction: string): Promise<PolicyBundle | null> {
  const tenant_id = await ensureTenant();
  
  try {
    const { data: bundles } = await supabase
      .rpc('rules_resolve', {
        p_domain: domain,
        p_jurisdiction: jurisdiction,
        p_at: new Date().toISOString()
      });
    
    if (bundles && bundles.length > 0) {
      return bundles[0] as PolicyBundle;
    }
    
    console.log(`No policy bundles found for domain: ${domain}, jurisdiction: ${jurisdiction}`);
    return null;
  } catch (error) {
    console.error(`Error resolving policy bundles:`, error);
    return null;
  }
}

export async function publishMockUpdate(domain: string, jurisdiction: string) {
  const tenant_id = await ensureTenant();
  const now = new Date().toISOString();
  const version = now; // timestamp version
  const content = {
    rules: [
      { id: "baseline.hitl", when: "always", require: "HITL_APPROVAL:2-of-3" }
    ],
    meta: { domain, jurisdiction, issued_at: now }
  };
  const content_hash = await sha256Hex(JSON.stringify(content));
  const bundle_id = `rs://${domain}@${version}`;
  
  // This would need to be implemented with actual policy_bundles table if it exists
  console.log(`Would create policy bundle with ID: ${bundle_id}`);
  
  // Return mock data
  const mockBundle: PolicyBundle = {
    id: crypto.randomUUID(),
    tenant_id,
    domain,
    jurisdiction,
    version,
    bundle_id,
    provider_id: "internal",
    provider_sig: null,
    content,
    content_hash,
    effective_at: now,
    created_at: now,
    created_by: (await supabase.auth.getUser()).data?.user?.id || "system"
  };

  console.log("Mock policy bundle created:", mockBundle);
  return mockBundle;
}

// Tax Rules Orchestration Implementation
export class TaxRulesOrchestrator implements TaxRuleOrchestration {
  async resolveCurrentRules(domain: string, jurisdiction: string, year: number): Promise<TaxRuleBundle | null> {
    const bundle = await resolveBundle(`tax-${domain}`, jurisdiction);
    if (!bundle) return null;
    
    // Validate the bundle contains tax rule content
    const taxBundle = bundle as TaxRuleBundle;
    if (taxBundle.content.tax_year === year) {
      return taxBundle;
    }
    
    return null;
  }

  async publishTaxUpdate(rules: TaxRuleContent, domain: string, jurisdiction: string): Promise<TaxRuleBundle> {
    const tenant_id = await ensureTenant();
    const now = new Date().toISOString();
    const version = `${rules.tax_year}-${now}`;
    const canonical = canonicalizeObject(rules);
    const content_hash = await sha256Hex(JSON.stringify(canonical));
    const bundle_id = `rs://tax-${domain}@${version}`;
    
    const taxBundle: TaxRuleBundle = {
      id: crypto.randomUUID(),
      tenant_id,
      domain: `tax-${domain}`,
      jurisdiction,
      version,
      bundle_id,
      provider_id: rules.meta.source,
      provider_sig: null,
      content: rules,
      content_hash,
      effective_at: rules.effective_date,
      created_at: now,
      created_by: (await supabase.auth.getUser()).data?.user?.id || "system"
    };

    // In a real implementation, this would save to policy_bundles table
    console.log("Tax rule bundle created:", taxBundle);
    return taxBundle;
  }

  async validateRuleConsistency(rules: TaxRuleContent): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate tax brackets
    if (rules.brackets) {
      for (const bracket of rules.brackets) {
        const sortedBrackets = bracket.brackets.sort((a, b) => a.bracket_order - b.bracket_order);
        for (let i = 0; i < sortedBrackets.length - 1; i++) {
          if (sortedBrackets[i].max_income && 
              sortedBrackets[i + 1].min_income !== sortedBrackets[i].max_income + 1) {
            errors.push(`Tax bracket gap detected for ${bracket.filing_status}`);
          }
        }
      }
    }

    // Validate estate rules
    if (rules.estate_rules) {
      if (rules.estate_rules.federal_exemption <= 0) {
        errors.push("Federal estate exemption must be positive");
      }
      if (rules.estate_rules.annual_exclusion <= 0) {
        errors.push("Annual exclusion must be positive");
      }
    }

    // Validate retirement rules
    if (rules.retirement_rules) {
      const secureActStart = new Date(rules.retirement_rules.secure_act.ten_year_rule_start);
      if (secureActStart > new Date()) {
        warnings.push("SECURE Act 10-year rule start date is in the future");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async getTaxRuleHistory(domain: string, jurisdiction: string): Promise<TaxRuleBundle[]> {
    // This would query the policy_bundles table for historical versions
    console.log(`Getting tax rule history for domain: tax-${domain}, jurisdiction: ${jurisdiction}`);
    return [];
  }
}

export const taxRulesOrchestrator = new TaxRulesOrchestrator();