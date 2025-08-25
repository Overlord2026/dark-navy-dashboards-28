export type MergeCtx = {
  client: { 
    id: string; 
    name: string; 
    email?: string; 
    phone?: string; 
    address?: string; 
    ssnLast4?: string 
  };
  account: { 
    id: string; 
    provider: string; 
    planId?: string; 
    balance?: number; 
    sdb?: string 
  };
  advisor: { 
    id: string; 
    name: string; 
    firm?: string; 
    email?: string; 
    phone?: string 
  };
  provider: { 
    name: string; 
    phone?: string; 
    uploadUrl?: string; 
    fax?: string; 
    mail?: string 
  };
  rollover: { 
    type: 'IRA' | 'New401k' | 'InService' | 'InPlanRoth'; 
    reason?: string; 
    feeSummaryId?: string 
  };
};

export type Paperwork = { 
  name: string; 
  templateId: string; 
  how: 'esubmit' | 'upload' | 'mail' | 'fax'; 
  note?: string 
};

export type ProviderRule = {
  provider: string;
  acceptsESign: boolean;
  rolloverTypes: Array<MergeCtx['rollover']['type']>;
  paperwork: Paperwork[];
  addresses?: { 
    mail?: string; 
    fax?: string; 
    uploadUrl?: string 
  };
  phone?: string;
  notes?: string;
  updatedAt: string;
};