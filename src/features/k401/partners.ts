let PARTNER: 'Vestwell' | 'Guideline' | 'Betterment' | 'None' = 'None';

export function setPartner(p: 'Vestwell' | 'Guideline' | 'Betterment' | 'None') { 
  PARTNER = p; 
}

export function getPartner() { 
  return PARTNER; 
}