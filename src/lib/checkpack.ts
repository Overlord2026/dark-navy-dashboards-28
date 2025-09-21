export async function runCheckPack(sandboxName: string, budgetCents: number, vendor?: string) {
  const m = await import('@/integrations/supabase/client'); 
  const sb: any = (m as any).supabase || (m as any).default || m;
  
  try {
    const { data: sbx } = await sb
      .from('mission_sandboxes')
      .select('*, checkpacks:checkpack_id(*)')
      .eq('name', sandboxName)
      .single();
    
    const rules = sbx?.checkpacks?.rules || {};
    const withinBudget = typeof rules.budget_max_cents !== 'number' || budgetCents <= rules.budget_max_cents;
    const vendorOK = !Array.isArray(rules.vendor_allowlist) || !vendor || rules.vendor_allowlist.includes(vendor);
    const risk = Number(rules.risk_score || 0);
    
    return { 
      pass: withinBudget && vendorOK, 
      risk, 
      rules,
      sandbox: sbx?.name || sandboxName
    };
  } catch (error) {
    console.warn('CheckPack validation failed:', error);
    // Fail closed - if we can't validate, don't allow the action
    return { 
      pass: false, 
      risk: 5, 
      rules: {},
      error: 'Policy validation unavailable'
    };
  }
}

export interface CheckPackResult {
  pass: boolean;
  risk: number;
  rules: Record<string, any>;
  sandbox?: string;
  error?: string;
}