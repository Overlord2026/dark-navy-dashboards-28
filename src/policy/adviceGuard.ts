export type PersonaKey = 'families_retiree' | 'families_aspiring' | 'advisors' | 'insurance' | 'cpa' | 'attorney' | 'nil';

export const ADVICE_GUARDS: Record<PersonaKey, {
  forbidden: string[];
  mustSuggestHuman: string[];
}> = {
  families_retiree: {
    forbidden: ['specific investment advice', 'tax preparation', 'legal representation'],
    mustSuggestHuman: ['estate planning', 'tax strategy', 'insurance claims']
  },
  families_aspiring: {
    forbidden: ['specific investment advice', 'tax preparation', 'legal representation'],
    mustSuggestHuman: ['retirement planning', 'tax optimization', 'estate planning']
  },
  advisors: {
    forbidden: ['client-specific advice', 'compliance violations'],
    mustSuggestHuman: ['regulatory issues', 'client complaints']
  },
  insurance: {
    forbidden: ['underwriting decisions', 'claim settlements'],
    mustSuggestHuman: ['policy modifications', 'coverage disputes']
  },
  cpa: {
    forbidden: ['tax return preparation', 'audit representation'],
    mustSuggestHuman: ['complex tax planning', 'IRS matters']
  },
  attorney: {
    forbidden: ['legal representation', 'case strategy'],
    mustSuggestHuman: ['litigation matters', 'regulatory compliance']
  },
  nil: {
    forbidden: ['professional advice'],
    mustSuggestHuman: ['professional consultation']
  }
};

export function personaBanner(persona: PersonaKey): string {
  switch (persona) {
    case 'families_retiree':
    case 'families_aspiring':
      return 'Educational assistance only. Not financial, tax, or legal advice. Consult your professional.';
    case 'advisors':
      return 'For educational purposes. Not compliance or regulatory advice. Consult your compliance office.';
    case 'insurance':
      return 'Educational content only. Not underwriting or claims advice. Consult your carrier.';
    case 'cpa':
      return 'Educational purposes only. Not tax preparation or audit advice. Consult your CPA firm.';
    case 'attorney':
      return 'Educational content only. Not legal representation or case advice. Consult your law firm.';
    default:
      return 'Educational assistance only. Not professional advice. Consult appropriate professionals.';
  }
}