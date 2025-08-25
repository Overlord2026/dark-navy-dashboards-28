// Simple partner management for K401 white-label integration
export type Partner = 'Vestwell' | 'Guideline' | 'Betterment' | 'None';

const PARTNER_KEY = 'k401_partner';

export function setPartner(partner: Partner): void {
  localStorage.setItem(PARTNER_KEY, partner);
}

export function getPartner(): Partner {
  return (localStorage.getItem(PARTNER_KEY) as Partner) || 'Vestwell';
}

export function getPartnerConfig(partner: Partner) {
  const configs = {
    Vestwell: {
      name: 'Vestwell',
      apiEndpoint: 'https://api.vestwell.com',
      features: ['plan_setup', 'participant_management', 'fiduciary_support']
    },
    Guideline: {
      name: 'Guideline',
      apiEndpoint: 'https://api.guideline.com',
      features: ['automated_setup', 'compliance_monitoring', 'investment_management']
    },
    Betterment: {
      name: 'Betterment',
      apiEndpoint: 'https://api.betterment.com',
      features: ['digital_onboarding', 'robo_advisory', 'participant_education']
    },
    None: {
      name: 'None',
      apiEndpoint: '',
      features: []
    }
  };
  
  return configs[partner];
}