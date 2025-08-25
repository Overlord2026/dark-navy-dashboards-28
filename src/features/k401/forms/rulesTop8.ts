import type { ProviderRule } from './types';

export const RULES_TOP8: ProviderRule[] = [
  {
    provider: 'Vanguard', 
    acceptsESign: true,
    rolloverTypes: ['IRA', 'New401k', 'InService'],
    paperwork: [
      { 
        name: 'Rollover Request', 
        templateId: 'vanguard_rollover_req', 
        how: 'upload', 
        note: 'Use secure upload portal.' 
      }
    ],
    addresses: { 
      uploadUrl: 'https://secure.vanguard.com', 
      fax: '800-555-1212' 
    },
    phone: '800-662-7447', 
    notes: 'Confirm in-service eligibility; verify plan ID',
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'Fidelity', 
    acceptsESign: true,
    rolloverTypes: ['IRA', 'New401k', 'InService'],
    paperwork: [
      { 
        name: 'Rollover Initiation', 
        templateId: 'fidelity_rollover_init', 
        how: 'esubmit' 
      }
    ],
    addresses: { 
      uploadUrl: 'https://workplace.fidelity.com' 
    },
    phone: '800-835-5097', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'Schwab', 
    acceptsESign: true,
    rolloverTypes: ['IRA', 'New401k'],
    paperwork: [
      { 
        name: 'Rollover Kit', 
        templateId: 'schwab_rollover_kit', 
        how: 'upload' 
      }
    ],
    addresses: { 
      uploadUrl: 'https://client.schwab.com' 
    },
    phone: '800-724-7526', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'Principal', 
    acceptsESign: false,
    rolloverTypes: ['IRA', 'New401k'],
    paperwork: [
      { 
        name: 'Distribution Form', 
        templateId: 'principal_distribution', 
        how: 'mail' 
      }
    ],
    addresses: { 
      mail: 'Principal Processing, PO Box 14362, Des Moines, IA 50306' 
    },
    phone: '800-986-3343', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'Empower', 
    acceptsESign: true,
    rolloverTypes: ['IRA', 'New401k', 'InService'],
    paperwork: [
      { 
        name: 'Rollover eForm', 
        templateId: 'empower_rollover_eform', 
        how: 'esubmit' 
      }
    ],
    phone: '855-756-4738', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'T. Rowe Price', 
    acceptsESign: false,
    rolloverTypes: ['IRA', 'New401k'],
    paperwork: [
      { 
        name: 'Rollover Form', 
        templateId: 'trp_rollover_form', 
        how: 'fax' 
      }
    ],
    addresses: { 
      fax: '800-638-8790' 
    },
    phone: '800-922-9945', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'John Hancock', 
    acceptsESign: false,
    rolloverTypes: ['IRA', 'New401k'],
    paperwork: [
      { 
        name: 'Distribution Package', 
        templateId: 'jh_distribution_pkg', 
        how: 'mail' 
      }
    ],
    addresses: { 
      mail: 'John Hancock Processing, PO Box 17180, Boston, MA 02117' 
    },
    phone: '800-395-1113', 
    updatedAt: new Date().toISOString()
  },
  {
    provider: 'Merrill', 
    acceptsESign: true,
    rolloverTypes: ['IRA', 'New401k'],
    paperwork: [
      { 
        name: 'Rollover PDF', 
        templateId: 'merrill_rollover', 
        how: 'upload' 
      }
    ],
    addresses: { 
      uploadUrl: 'https://benefits.ml.com' 
    },
    phone: '800-228-4015', 
    updatedAt: new Date().toISOString()
  }
];

export function getProviderRule(provider: string): ProviderRule | undefined {
  return RULES_TOP8.find(rule => rule.provider.toLowerCase() === provider.toLowerCase());
}

export function getSupportedProviders(): string[] {
  return RULES_TOP8.map(rule => rule.provider);
}