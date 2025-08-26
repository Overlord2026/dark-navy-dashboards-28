import type { ProviderRule } from './types';

// Channel legend: how: 'esubmit' | 'upload' | 'mail' | 'fax'
export const RULES_MORE: ProviderRule[] = [
  // --- Empower & sub-platforms ---
  { provider:'Empower (Great-West)', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover eForm', templateId:'empower_rollover', how:'esubmit' }],
    phone:'800-xxx-xxxx', notes:'Confirm plan site; some sub-platforms require upload portal.',
    updatedAt:new Date().toISOString()
  },
  { provider:'Empower (MassMutual legacy)', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Request', templateId:'empower_mm_dist_req', how:'upload' }],
    addresses:{ uploadUrl:'https://participant.empower-retirement.com' },
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },
  { provider:'Empower (Prudential legacy)', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover Request', templateId:'empower_pru_rollover', how:'esubmit' }],
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- Nationwide ---
  { provider:'Nationwide', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover/Distribution', templateId:'nationwide_rollover', how:'mail' }],
    addresses:{ mail:'Nationwide Benefit Processing, PO Box ...' },
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- Transamerica ---
  { provider:'Transamerica', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover Request', templateId:'transamerica_rollover', how:'upload' }],
    addresses:{ uploadUrl:'https://participant.transamerica.com' },
    phone:'800-xxx-xxxx', notes:'Check in-service terms; some plans require notarized forms.',
    updatedAt:new Date().toISOString()
  },

  // --- Voya ---
  { provider:'Voya', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution/Rollover eForm', templateId:'voya_rollover', how:'esubmit' }],
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- Lincoln Financial ---
  { provider:'Lincoln Financial', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Request', templateId:'lincoln_dist_req', how:'fax' }],
    addresses:{ fax:'800-555-1111' }, phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- OneAmerica ---
  { provider:'OneAmerica', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Package', templateId:'oneamerica_distribution', how:'mail' }],
    addresses:{ mail:'OneAmerica Recordkeeping, PO Box ...' }, phone:'800-xxx-xxxx',
    updatedAt:new Date().toISOString()
  },

  // --- Corebridge (AIG/VALIC) ---
  { provider:'Corebridge (AIG/VALIC)', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover eForm', templateId:'corebridge_rollover', how:'esubmit' }],
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- TIAA ---
  { provider:'TIAA', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover eForm', templateId:'tiaa_rollover', how:'esubmit' }],
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- Fidelity variants ---
  { provider:'Fidelity NetBenefits', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover Initiation', templateId:'fidelity_nb_rollover', how:'esubmit' }],
    addresses:{ uploadUrl:'https://nb.fidelity.com' }, phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },
  { provider:'Fidelity PSW (legacy)', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Request', templateId:'fidelity_psw_dist', how:'fax' }],
    addresses:{ fax:'800-555-2222' }, updatedAt:new Date().toISOString()
  },

  // --- Schwab Workplace Retirement ---
  { provider:'Schwab Workplace', acceptsESign:true, rolloverTypes:['IRA','New401k','InService'],
    paperwork:[{ name:'Rollover Kit', templateId:'schwab_wr_kit', how:'upload' }],
    addresses:{ uploadUrl:'https://workplace.schwab.com' }, phone:'800-xxx-xxxx',
    updatedAt:new Date().toISOString()
  },

  // --- John Hancock variants ---
  { provider:'John Hancock (Retirement)', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Package', templateId:'jh_ret_pkg', how:'mail' }],
    addresses:{ mail:'John Hancock Retirement, PO Box ...' }, updatedAt:new Date().toISOString()
  },

  // --- American Funds / Capital Group ---
  { provider:'Capital Group / American Funds', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover / Distribution', templateId:'amfunds_rollover', how:'mail' }],
    addresses:{ mail:'American Funds, PO Box ...' }, updatedAt:new Date().toISOString()
  },

  // --- Principal variants ---
  { provider:'Principal (Recordkeeper)', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution eForm', templateId:'principal_rk_dist', how:'esubmit' }],
    phone:'800-xxx-xxxx', updatedAt:new Date().toISOString()
  },

  // --- Ascensus / Newport / Paychex / ADP RS ---
  { provider:'Ascensus', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover eForm', templateId:'ascensus_rollover', how:'esubmit' }],
    updatedAt:new Date().toISOString()
  },
  { provider:'Newport', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover eForm', templateId:'newport_rollover', how:'upload' }],
    addresses:{ uploadUrl:'https://participant.newportgroup.com' }, updatedAt:new Date().toISOString()
  },
  { provider:'Paychex Retirement', acceptsESign:false, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Distribution Package', templateId:'paychex_dist_pkg', how:'mail' }],
    updatedAt:new Date().toISOString()
  },
  { provider:'ADP Retirement Services', acceptsESign:true, rolloverTypes:['IRA','New401k', 'InService'],
    paperwork:[{ name:'Rollover eForm', templateId:'adprs_rollover', how:'esubmit' }],
    updatedAt:new Date().toISOString()
  },

  // --- Merrill (BoA) Workplace ---
  { provider:'Merrill (Bank of America) Workplace', acceptsESign:true, rolloverTypes:['IRA','New401k'],
    paperwork:[{ name:'Rollover PDF', templateId:'merrill_wr_rollover', how:'upload' }],
    addresses:{ uploadUrl:'https://benefits.ml.com' }, updatedAt:new Date().toISOString()
  },
];

export function registerMoreProviderRules(setProviderRule: (r: ProviderRule) => any) {
  for (const r of RULES_MORE) setProviderRule(r);
}