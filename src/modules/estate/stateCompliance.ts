export interface StateCompliance {
  code: string;
  name: string;
  witnessesRequired: number;
  ronAllowed: boolean;
  rinAllowed: boolean;
  wetSignatureRequired: boolean;
  specialNotes?: string[];
  filingOptions: Array<'api' | 'efile' | 'mail' | 'in_person'>;
  notaryRequired: boolean;
  selfProvingWillAllowed: boolean;
}

export const stateComplianceMap: Record<string, StateCompliance> = {
  FL: {
    code: 'FL',
    name: 'Florida',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: true,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON (Remote Online Notarization) permitted',
      'Self-proving wills allowed with notarization'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  CA: {
    code: 'CA',
    name: 'California',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted for notarization',
      'Holographic wills recognized'
    ],
    filingOptions: ['api', 'efile', 'mail', 'in_person']
  },
  NY: {
    code: 'NY',
    name: 'New York',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted since 2022',
      'Self-proving affidavit recommended'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: true,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON and RIN both permitted',
      'Holographic wills recognized'
    ],
    filingOptions: ['api', 'efile', 'mail', 'in_person']
  },
  IL: {
    code: 'IL',
    name: 'Illinois',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Electronic wills allowed under specific conditions'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Self-proving wills require notarization'
    ],
    filingOptions: ['mail', 'in_person']
  },
  OH: {
    code: 'OH',
    name: 'Ohio',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Electronic signature laws apply'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Year of our Lord dating requirement'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  NC: {
    code: 'NC',
    name: 'North Carolina',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Self-proving affidavit strongly recommended'
    ],
    filingOptions: ['efile', 'mail', 'in_person']
  },
  WA: {
    code: 'WA',
    name: 'Washington',
    witnessesRequired: 2,
    ronAllowed: true,
    rinAllowed: false,
    wetSignatureRequired: false,
    notaryRequired: false,
    selfProvingWillAllowed: true,
    specialNotes: [
      'Two witnesses required for will execution',
      'RON permitted',
      'Electronic wills and signatures allowed'
    ],
    filingOptions: ['api', 'efile', 'mail', 'in_person']
  }
};

export function getStateCompliance(stateCode: string): StateCompliance | null {
  return stateComplianceMap[stateCode.toUpperCase()] || null;
}

export function getRequiredSteps(stateCode: string): string[] {
  const compliance = getStateCompliance(stateCode);
  if (!compliance) return [];

  const steps = ['intake', 'drafting', 'review'];
  
  if (compliance.witnessesRequired > 0) {
    steps.push('witnessing');
  }
  
  if (compliance.ronAllowed || compliance.rinAllowed || compliance.notaryRequired) {
    steps.push('notarizing');
  }
  
  steps.push('signing');
  
  if (compliance.filingOptions.length > 0) {
    steps.push('filing');
  }
  
  steps.push('complete');
  
  return steps;
}

export function getFilingMethods(stateCode: string): Array<{ value: string; label: string; description: string }> {
  const compliance = getStateCompliance(stateCode);
  if (!compliance) return [];

  const methodLabels = {
    api: { label: 'Electronic Filing (API)', description: 'Instant electronic submission' },
    efile: { label: 'E-File Portal', description: 'State e-filing system' },
    mail: { label: 'Mail Filing', description: 'Traditional mail submission' },
    in_person: { label: 'In-Person Filing', description: 'Direct courthouse filing' }
  };

  return compliance.filingOptions.map(option => ({
    value: option,
    ...methodLabels[option]
  }));
}