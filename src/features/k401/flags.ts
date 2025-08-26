// K401 feature flags for checklist auto-detection

interface K401Flags {
  compliance_pack?: boolean;
  broker_demo_pack?: boolean;
}

export function setK401Flags(flags: K401Flags) {
  if (flags.compliance_pack !== undefined) {
    localStorage.setItem('k401.compliancePack.ready', String(flags.compliance_pack));
    localStorage.setItem('k401.compliancePack.date', new Date().toISOString().slice(0, 10));
  }
  
  if (flags.broker_demo_pack !== undefined) {
    localStorage.setItem('k401.brokerDemoPack.ready', String(flags.broker_demo_pack));
    localStorage.setItem('k401.brokerDemoPack.date', new Date().toISOString().slice(0, 10));
  }
}

export function getK401Flags(): K401Flags {
  return {
    compliance_pack: localStorage.getItem('k401.compliancePack.ready') === 'true',
    broker_demo_pack: localStorage.getItem('k401.brokerDemoPack.ready') === 'true'
  };
}