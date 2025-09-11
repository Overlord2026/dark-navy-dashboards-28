import * as Canonical from "@/lib/canonical";

export async function exportCurrentRules(): Promise<{ json: any; hash: string }> {
  // Pull current runtime rules/policies from store
  const rules = { 
    policies: [
      { type: 'k401_compliance', status: 'active' },
      { type: 'pte_2020_02', status: 'active' },
      { type: 'rollover_forms', status: 'active' },
      { type: 'anchor_receipts', status: 'enabled' }
    ], 
    version: "K-2025",
    exported_at: new Date().toISOString(),
    env: import.meta.env.MODE,
    flags: {
      compliance_pack: localStorage.getItem('k401.compliancePack.ready') === 'true',
      broker_demo_pack: localStorage.getItem('k401.brokerDemoPack.ready') === 'true'
    }
  };
  
  const canon = JSON.stringify(rules);
  const hash = "sha256:" + (await Canonical.sha256Hex(canon));
  
  return { json: rules, hash };
}