import { ProPersona } from '@/features/pro/types';

export interface ComplianceConfig {
  persona: ProPersona;
  regulatoryBodies: string[];
  ceRequirements: {
    hoursPerCycle: number;
    cycleMonths: number;
    ethicsHours?: number;
    specialtyRequirements?: Record<string, number>;
  };
  recordRetention: {
    clientRecords: number; // years
    transactions: number;
    communications: number;
    auditTrails: number;
  };
  auditFrequency: {
    internal: number; // months
    external: number; // years
    regulatory?: number; // years
  };
  jurisdictionRules: {
    requiresStateRegistration: boolean;
    countyVariances: boolean;
    federalOversight: boolean;
  };
  voiceAIFeatures: {
    ceDelivery: boolean;
    complianceAlerts: boolean;
    recordingRequirements: boolean;
    transcriptionMandatory: boolean;
  };
  premiumFeatures: {
    advancedAnalytics: boolean;
    customReporting: boolean;
    aiRiskScoring: boolean;
    realTimeMonitoring: boolean;
  };
}

export interface GeoComplianceConfig {
  state: string;
  county?: string;
  municipality?: string;
  specialRules: Record<string, any>;
  additionalRequirements: string[];
  exemptions: string[];
}

class CompliancePersonaRegistry {
  private static instance: CompliancePersonaRegistry;
  private configs: Map<ProPersona, ComplianceConfig> = new Map();
  private geoConfigs: Map<string, GeoComplianceConfig[]> = new Map();

  private constructor() {
    this.initializeConfigs();
  }

  static getInstance(): CompliancePersonaRegistry {
    if (!CompliancePersonaRegistry.instance) {
      CompliancePersonaRegistry.instance = new CompliancePersonaRegistry();
    }
    return CompliancePersonaRegistry.instance;
  }

  private initializeConfigs() {
    // Financial Advisors - SEC/FINRA/State Rules
    this.configs.set('advisor', {
      persona: 'advisor',
      regulatoryBodies: ['SEC', 'FINRA', 'STATE_SECURITIES'],
      ceRequirements: {
        hoursPerCycle: 30,
        cycleMonths: 36,
        ethicsHours: 2,
        specialtyRequirements: {
          'retirement_planning': 4,
          'estate_planning': 6,
          'tax_planning': 4
        }
      },
      recordRetention: {
        clientRecords: 7,
        transactions: 3,
        communications: 3,
        auditTrails: 5
      },
      auditFrequency: {
        internal: 12,
        external: 3,
        regulatory: 2
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: false,
        federalOversight: true
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: true,
        transcriptionMandatory: false
      },
      premiumFeatures: {
        advancedAnalytics: true,
        customReporting: true,
        aiRiskScoring: true,
        realTimeMonitoring: true
      }
    });

    // Accountants - AICPA/IRS Rules
    this.configs.set('cpa', {
      persona: 'cpa',
      regulatoryBodies: ['AICPA', 'IRS', 'STATE_BOARD_ACCOUNTANCY'],
      ceRequirements: {
        hoursPerCycle: 40,
        cycleMonths: 12,
        ethicsHours: 4,
        specialtyRequirements: {
          'tax_preparation': 8,
          'audit': 12,
          'forensic_accounting': 6
        }
      },
      recordRetention: {
        clientRecords: 7,
        transactions: 7,
        communications: 5,
        auditTrails: 7
      },
      auditFrequency: {
        internal: 6,
        external: 3,
        regulatory: 3
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: false,
        federalOversight: true
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: false,
        transcriptionMandatory: false
      },
      premiumFeatures: {
        advancedAnalytics: true,
        customReporting: true,
        aiRiskScoring: false,
        realTimeMonitoring: true
      }
    });

    // Estate Planning Attorneys - Bar/State Ethics
    this.configs.set('attorney', {
      persona: 'attorney',
      regulatoryBodies: ['STATE_BAR', 'ABA', 'STATE_ETHICS_BOARD'],
      ceRequirements: {
        hoursPerCycle: 15,
        cycleMonths: 12,
        ethicsHours: 3,
        specialtyRequirements: {
          'estate_planning': 6,
          'tax_law': 4,
          'elder_law': 5
        }
      },
      recordRetention: {
        clientRecords: 10,
        transactions: 7,
        communications: 7,
        auditTrails: 10
      },
      auditFrequency: {
        internal: 12,
        external: 5,
        regulatory: 3
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: true,
        federalOversight: false
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: true,
        transcriptionMandatory: true
      },
      premiumFeatures: {
        advancedAnalytics: true,
        customReporting: true,
        aiRiskScoring: true,
        realTimeMonitoring: true
      }
    });

    // Insurance Agents - NAIC/State/Product-Specific
    this.configs.set('insurance' as ProPersona, {
      persona: 'insurance' as ProPersona,
      regulatoryBodies: ['NAIC', 'STATE_INSURANCE_DEPT', 'FINRA'],
      ceRequirements: {
        hoursPerCycle: 24,
        cycleMonths: 24,
        ethicsHours: 3,
        specialtyRequirements: {
          'life_insurance': 8,
          'health_insurance': 6,
          'variable_products': 12,
          'medicare_supplement': 8,
          'long_term_care': 8,
          'property_casualty': 20
        }
      },
      recordRetention: {
        clientRecords: 10,
        transactions: 10,
        communications: 5,
        auditTrails: 10
      },
      auditFrequency: {
        internal: 12,
        external: 3,
        regulatory: 2
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: false,
        federalOversight: true
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: true,
        transcriptionMandatory: false
      },
      premiumFeatures: {
        advancedAnalytics: true,
        customReporting: true,
        aiRiskScoring: true,
        realTimeMonitoring: true
      }
    });

    // Healthcare Providers - HIPAA/State Health
    this.configs.set('healthcare', {
      persona: 'healthcare',
      regulatoryBodies: ['HHS', 'STATE_HEALTH_DEPT', 'MEDICAL_BOARD'],
      ceRequirements: {
        hoursPerCycle: 50,
        cycleMonths: 24,
        ethicsHours: 4,
        specialtyRequirements: {
          'medical_ethics': 8,
          'hipaa_compliance': 6,
          'patient_safety': 10
        }
      },
      recordRetention: {
        clientRecords: 7,
        transactions: 7,
        communications: 7,
        auditTrails: 6
      },
      auditFrequency: {
        internal: 6,
        external: 2,
        regulatory: 1
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: true,
        federalOversight: true
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: true,
        transcriptionMandatory: true
      },
      premiumFeatures: {
        advancedAnalytics: true,
        customReporting: true,
        aiRiskScoring: true,
        realTimeMonitoring: true
      }
    });

    // Realtors - NAR/State/County Zoning
    this.configs.set('realtor', {
      persona: 'realtor',
      regulatoryBodies: ['NAR', 'STATE_REAL_ESTATE_BOARD', 'LOCAL_MLS'],
      ceRequirements: {
        hoursPerCycle: 30,
        cycleMonths: 24,
        ethicsHours: 4,
        specialtyRequirements: {
          'ethics': 4,
          'fair_housing': 3,
          'contracts': 6
        }
      },
      recordRetention: {
        clientRecords: 7,
        transactions: 7,
        communications: 3,
        auditTrails: 5
      },
      auditFrequency: {
        internal: 12,
        external: 3,
        regulatory: 5
      },
      jurisdictionRules: {
        requiresStateRegistration: true,
        countyVariances: true,
        federalOversight: false
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: true,
        recordingRequirements: false,
        transcriptionMandatory: false
      },
      premiumFeatures: {
        advancedAnalytics: false,
        customReporting: true,
        aiRiskScoring: false,
        realTimeMonitoring: false
      }
    });

    // Coaches - General Ethics/CE
    this.configs.set('consultant' as ProPersona, {
      persona: 'consultant' as ProPersona,
      regulatoryBodies: ['ICF', 'CCE', 'PROFESSIONAL_ASSOCIATION'],
      ceRequirements: {
        hoursPerCycle: 20,
        cycleMonths: 36,
        ethicsHours: 3,
        specialtyRequirements: {
          'professional_ethics': 3,
          'continuing_education': 5
        }
      },
      recordRetention: {
        clientRecords: 7,
        transactions: 3,
        communications: 3,
        auditTrails: 5
      },
      auditFrequency: {
        internal: 24,
        external: 5
      },
      jurisdictionRules: {
        requiresStateRegistration: false,
        countyVariances: false,
        federalOversight: false
      },
      voiceAIFeatures: {
        ceDelivery: true,
        complianceAlerts: false,
        recordingRequirements: false,
        transcriptionMandatory: false
      },
      premiumFeatures: {
        advancedAnalytics: false,
        customReporting: false,
        aiRiskScoring: false,
        realTimeMonitoring: false
      }
    });
  }

  getConfig(persona: ProPersona): ComplianceConfig | undefined {
    return this.configs.get(persona);
  }

  getGeoConfig(state: string, county?: string): GeoComplianceConfig[] {
    const key = county ? `${state}-${county}` : state;
    return this.geoConfigs.get(key) || [];
  }

  updatePersonaConfig(persona: ProPersona, updates: Partial<ComplianceConfig>): void {
    const existing = this.configs.get(persona);
    if (existing) {
      this.configs.set(persona, { ...existing, ...updates });
    }
  }

  addGeoConfig(state: string, county: string | undefined, config: GeoComplianceConfig): void {
    const key = county ? `${state}-${county}` : state;
    const existing = this.geoConfigs.get(key) || [];
    existing.push(config);
    this.geoConfigs.set(key, existing);
  }

  getAllPersonas(): ProPersona[] {
    return Array.from(this.configs.keys());
  }

  isFeatureEnabled(persona: ProPersona, feature: keyof ComplianceConfig['premiumFeatures']): boolean {
    const config = this.configs.get(persona);
    return config?.premiumFeatures[feature] || false;
  }

  isVoiceFeatureEnabled(persona: ProPersona, feature: keyof ComplianceConfig['voiceAIFeatures']): boolean {
    const config = this.configs.get(persona);
    return config?.voiceAIFeatures[feature] || false;
  }
}

export default CompliancePersonaRegistry;