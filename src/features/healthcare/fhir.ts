import { Persona, ComplexityTier } from '@/features/personalization/types';

export interface FHIRConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
  iss: string; // FHIR server base URL
}

export interface FHIRTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  patient?: string;
  refresh_token?: string;
}

export interface HealthPlan {
  id: string;
  name: string;
  type: 'commercial' | 'medicare' | 'medicaid' | 'other';
  deductible?: number;
  maxOutOfPocket?: number;
  copay?: Record<string, number>;
  coverage?: {
    preventive: boolean;
    prescription: boolean;
    mentalHealth: boolean;
    dental: boolean;
    vision: boolean;
  };
}

export interface PatientSummary {
  patientId: string;
  plans: HealthPlan[];
  lastVisit?: Date;
  chronicConditions?: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  // No PHI stored - only metadata
  hasActiveInsurance: boolean;
  estimatedAnnualCosts: number;
}

/**
 * FHIR SMART on FHIR OAuth connector stub
 * In production, this would implement full SMART App Launch flow
 */
export class FHIRConnector {
  private config: FHIRConfig;
  private token?: FHIRTokenResponse;

  constructor(config: FHIRConfig) {
    this.config = config;
  }

  /**
   * Initiate SMART App Launch flow
   */
  async authorize(): Promise<string> {
    const state = btoa(JSON.stringify({ timestamp: Date.now() }));
    const authUrl = new URL(`${this.config.iss}/auth/authorize`);
    
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', this.config.clientId);
    authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.set('scope', this.config.scope.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('aud', this.config.iss);

    console.info('fhir.auth.initiated', { 
      client_id: this.config.clientId,
      scope: this.config.scope 
    });

    return authUrl.toString();
  }

  /**
   * Exchange code for access token
   */
  async exchangeCode(code: string, state: string): Promise<FHIRTokenResponse> {
    // In real implementation, this would make actual HTTP request
    console.info('fhir.token.exchange', { code: code.substring(0, 8) + '...' });

    // Mock successful token response
    this.token = {
      access_token: 'mock_access_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      scope: this.config.scope.join(' '),
      patient: 'patient_' + Math.random().toString(36).substring(2, 8)
    };

    return this.token;
  }

  /**
   * Get patient summary (PHI-minimal)
   */
  async getPatientSummary(persona: Persona, tier: ComplexityTier): Promise<PatientSummary> {
    if (!this.token) {
      throw new Error('Not authenticated with FHIR server');
    }

    console.info('fhir.patient.summary.requested', { 
      persona, 
      tier,
      patient_id: this.token.patient?.substring(0, 8) + '...'
    });

    // Return mock data based on persona
    const mockSummary: PatientSummary = {
      patientId: this.token.patient || 'unknown',
      plans: this.getMockHealthPlans(persona),
      hasActiveInsurance: true,
      estimatedAnnualCosts: this.getEstimatedCosts(persona)
    };

    if (persona === 'retiree') {
      mockSummary.chronicConditions = ['hypertension', 'diabetes'];
      mockSummary.medications = [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'twice daily' }
      ];
    }

    return mockSummary;
  }

  private getMockHealthPlans(persona: Persona): HealthPlan[] {
    if (persona === 'retiree') {
      return [
        {
          id: 'medicare_a',
          name: 'Medicare Part A',
          type: 'medicare',
          deductible: 1632,
          maxOutOfPocket: 8000,
          coverage: {
            preventive: true,
            prescription: false,
            mentalHealth: true,
            dental: false,
            vision: false
          }
        },
        {
          id: 'medicare_b',
          name: 'Medicare Part B',
          type: 'medicare',
          deductible: 240,
          copay: { 'primary_care': 30, 'specialist': 60 },
          coverage: {
            preventive: true,
            prescription: false,
            mentalHealth: true,
            dental: false,
            vision: false
          }
        }
      ];
    }

    return [
      {
        id: 'employer_plan',
        name: 'Blue Cross Blue Shield PPO',
        type: 'commercial',
        deductible: 2500,
        maxOutOfPocket: 6000,
        copay: { 'primary_care': 25, 'specialist': 45, 'urgent_care': 75 },
        coverage: {
          preventive: true,
          prescription: true,
          mentalHealth: true,
          dental: true,
          vision: true
        }
      }
    ];
  }

  private getEstimatedCosts(persona: Persona): number {
    return persona === 'retiree' ? 8500 : 4200;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<FHIRTokenResponse> {
    if (!this.token?.refresh_token) {
      throw new Error('No refresh token available');
    }

    console.info('fhir.token.refresh');
    
    // Mock refresh
    this.token.access_token = 'refreshed_token_' + Date.now();
    return this.token;
  }

  /**
   * Revoke access
   */
  async revoke(): Promise<void> {
    console.info('fhir.access.revoked');
    this.token = undefined;
  }
}

/**
 * Default FHIR configuration for demo
 */
export const defaultFHIRConfig: FHIRConfig = {
  clientId: 'demo_smart_app',
  redirectUri: `${window.location.origin}/healthcare/fhir/callback`,
  scope: [
    'patient/Patient.read',
    'patient/Coverage.read',
    'patient/ExplanationOfBenefit.read',
    'patient/Observation.read'
  ],
  iss: 'https://demo.fhir.org/r4'
};

// Global connector instance
export const fhirConnector = new FHIRConnector(defaultFHIRConfig);