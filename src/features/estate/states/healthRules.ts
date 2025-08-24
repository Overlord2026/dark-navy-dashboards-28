import { ALL_STATES_DC, conservativeHealthRule } from './registry';

export type HealthcareRule = {
  code: string; 
  witnesses: number; 
  notaryRequired: boolean; 
  selfProvingAffidavit?: boolean;
  remoteNotaryAllowed?: boolean; 
  healthcareForms: ('AdvanceDirective'|'LivingWill'|'HealthcarePOA'|'HIPAA'|'Surrogate')[];
  surrogateTerminology?: string; 
  witnessEligibility?: string; 
  notarizationText?: string; 
  specialNotes?: string;
};

export const HEALTH_RULES: Record<string, HealthcareRule> = {
  CA: { code:'CA', witnesses:0, notaryRequired:true, selfProvingAffidavit:true, remoteNotaryAllowed:true, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'], specialNotes:'Hospital policies vary.' },
  TX: { code:'TX', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'], remoteNotaryAllowed:true },
  FL: { code:'FL', witnesses:2, notaryRequired:false, selfProvingAffidavit:true, healthcareForms:['LivingWill','HealthcarePOA','HIPAA'] },
  NY: { code:'NY', witnesses:2, notaryRequired:false, healthcareForms:['Surrogate','HIPAA'], surrogateTerminology:'Health Care Proxy' },
  PA: { code:'PA', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  IL: { code:'IL', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  OH: { code:'OH', witnesses:2, notaryRequired:false, healthcareForms:['LivingWill','HealthcarePOA','HIPAA'] },
  GA: { code:'GA', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  NC: { code:'NC', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  MI: { code:'MI', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  NJ: { code:'NJ', witnesses:2, notaryRequired:false, selfProvingAffidavit:true, remoteNotaryAllowed:true, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'], surrogateTerminology:'Health Care Proxy', specialNotes:'Hospital policies may vary by system.' },
  VA: { code:'VA', witnesses:2, notaryRequired:false, remoteNotaryAllowed:true, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  WA: { code:'WA', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'], specialNotes:'Community property; confirm provider acceptance.' },
  AZ: { code:'AZ', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'], specialNotes:'State AD forms widely used.' },
  MA: { code:'MA', witnesses:2, notaryRequired:false, healthcareForms:['Surrogate','HIPAA'], surrogateTerminology:'Health Care Proxy' },
  TN: { code:'TN', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  IN: { code:'IN', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  MO: { code:'MO', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  MD: { code:'MD', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },
  WI: { code:'WI', witnesses:2, notaryRequired:false, healthcareForms:['AdvanceDirective','HealthcarePOA','HIPAA'] },

};

// Add remaining states with conservative defaults - two-step to avoid TDZ
for (const s of ALL_STATES_DC) {
  if (!(s in HEALTH_RULES)) {
    HEALTH_RULES[s] = conservativeHealthRule(s);
  }
}

// Apply specific overrides for known state terminology
if (HEALTH_RULES['MA']) HEALTH_RULES['MA'].surrogateTerminology = 'Health Care Proxy';
if (HEALTH_RULES['NY']) HEALTH_RULES['NY'].surrogateTerminology = 'Health Care Proxy';

export function getHealthRule(state: string): HealthcareRule | null {
  return HEALTH_RULES[state] || null;
}

export function getAllHealthStates(): string[] {
  return Object.keys(HEALTH_RULES);
}