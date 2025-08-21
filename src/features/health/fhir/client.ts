import { supabase } from '@/integrations/supabase/client';

/**
 * SMART on FHIR client with OAuth shell and normalized summary
 */

export interface FHIRAuthConfig {
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

export interface NormalizedSummary {
  age: number;
  sex: 'male' | 'female' | 'other' | 'unknown';
  icd: string[];
  cpt: string[];
  allergies: {
    substance: string;
    severity: 'mild' | 'moderate' | 'severe';
  }[];
  meds: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  lastScreenings: {
    type: string;
    date: string;
    result: string;
  }[];
  plan: {
    inNetwork: boolean;
    deductibleMet: boolean;
    remainingDeductible: number;
    copayTier: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: FHIRTokenResponse;
  patientId?: string;
  authorizedScopes?: string[];
}

/**
 * SMART on FHIR client implementation
 */
export class SmartFHIRClient {
  private config: FHIRAuthConfig;
  private authState: AuthState = { isAuthenticated: false };

  constructor(config: FHIRAuthConfig) {
    this.config = config;
  }

  /**
   * Initiate SMART App Launch OAuth flow
   */
  async auth(): Promise<{ authUrl: string; state: string }> {
    console.info('fhir.auth.start', { 
      clientId: this.config.clientId.substring(0, 8) + '...',
      iss: this.config.iss,
      scopeCount: this.config.scope.length
    });

    // Generate secure state parameter
    const state = this.generateSecureState();
    
    // Build OAuth authorization URL
    const authUrl = new URL(`${this.config.iss}/auth/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', this.config.clientId);
    authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.set('scope', this.config.scope.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('aud', this.config.iss);
    authUrl.searchParams.set('launch', 'patient-select'); // SMART launch parameter

    // Store state for validation
    sessionStorage.setItem('fhir_oauth_state', state);

    return {
      authUrl: authUrl.toString(),
      state
    };
  }

  /**
   * Handle OAuth callback and exchange code for token
   */
  async handleCallback(code: string, state: string): Promise<AuthState> {
    // Validate state parameter
    const storedState = sessionStorage.getItem('fhir_oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }

    console.info('fhir.oauth.callback', { 
      codePrefix: code.substring(0, 8) + '...',
      stateValid: true
    });

    try {
      // In production, this would call the FHIR server's token endpoint
      // For Phase 1, we'll simulate the token exchange
      const tokenResponse = await this.simulateTokenExchange(code);
      
      this.authState = {
        isAuthenticated: true,
        token: tokenResponse,
        patientId: tokenResponse.patient,
        authorizedScopes: tokenResponse.scope.split(' ')
      };

      // Clean up state
      sessionStorage.removeItem('fhir_oauth_state');

      console.info('fhir.auth.success', {
        patientId: this.authState.patientId?.substring(0, 8) + '...',
        scopesCount: this.authState.authorizedScopes?.length
      });

      return this.authState;
    } catch (error) {
      console.error('fhir.auth.error', { error: String(error) });
      throw error;
    }
  }

  /**
   * Fetch normalized patient summary
   */
  async fetchSummary(): Promise<NormalizedSummary> {
    if (!this.authState.isAuthenticated || !this.authState.token) {
      throw new Error('FHIR client not authenticated');
    }

    console.info('fhir.summary.fetch', {
      patientId: this.authState.patientId?.substring(0, 8) + '...',
      tokenValid: !!this.authState.token.access_token
    });

    try {
      // In production, this would make FHIR API calls
      // For Phase 1, return mock normalized data
      const summary = await this.getMockNormalizedSummary();
      
      console.info('fhir.summary.success', {
        age: summary.age,
        icdCount: summary.icd.length,
        cptCount: summary.cpt.length,
        allergiesCount: summary.allergies.length,
        medsCount: summary.meds.length,
        screeningsCount: summary.lastScreenings.length,
        inNetwork: summary.plan.inNetwork
      });

      return summary;
    } catch (error) {
      console.error('fhir.summary.error', { error: String(error) });
      throw error;
    }
  }

  /**
   * Create canonical hash of summary for receipts
   */
  createSummaryHash(summary: NormalizedSummary): string {
    // Create deterministic canonical representation
    const canonical = this.canonicalizeSummary(summary);
    
    // Create SHA-256 hash
    const hashInput = JSON.stringify(canonical);
    console.info('fhir.hash.create', { 
      inputLength: hashInput.length,
      summaryAge: summary.age,
      dataElements: Object.keys(canonical).length
    });

    return this.sha256Hash(hashInput);
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.token;
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Revoke access and clear tokens
   */
  async revoke(): Promise<void> {
    console.info('fhir.auth.revoke');
    
    this.authState = { isAuthenticated: false };
    sessionStorage.removeItem('fhir_oauth_state');
    
    // In production, would call revocation endpoint
  }

  // Private helper methods

  private generateSecureState(): string {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async simulateTokenExchange(code: string): Promise<FHIRTokenResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful token response
    return {
      access_token: `mock_fhir_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: this.config.scope.join(' '),
      patient: `Patient/${Math.random().toString(36).substring(2, 10)}`,
      refresh_token: `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
  }

  private async getMockNormalizedSummary(): Promise<NormalizedSummary> {
    // Simulate API calls delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return realistic mock data that varies by patient
    const patientSeed = this.authState.patientId?.slice(-2) || '00';
    const ageVariant = parseInt(patientSeed, 16) % 40 + 25; // Age 25-65

    return {
      age: ageVariant,
      sex: ageVariant % 2 === 0 ? 'female' : 'male',
      icd: [
        'Z00.00', // General adult medical examination
        'E11.9',  // Type 2 diabetes without complications
        'I10',    // Essential hypertension
        ...(ageVariant > 50 ? ['Z12.11'] : []) // Encounter for screening for malignant neoplasm of colon
      ],
      cpt: [
        '99213', // Office visit
        '80053', // Comprehensive metabolic panel
        '85025', // Complete blood count
        ...(ageVariant > 45 ? ['45378'] : []) // Colonoscopy
      ],
      allergies: [
        {
          substance: 'penicillin',
          severity: 'moderate'
        },
        ...(ageVariant % 3 === 0 ? [{
          substance: 'shellfish',
          severity: 'mild' as const
        }] : [])
      ],
      meds: [
        {
          name: 'lisinopril',
          dosage: '10mg',
          frequency: 'once daily'
        },
        ...(ageVariant > 40 ? [{
          name: 'metformin',
          dosage: '500mg',
          frequency: 'twice daily'
        }] : [])
      ],
      lastScreenings: [
        {
          type: 'blood_pressure',
          date: '2024-12-15',
          result: '128/82'
        },
        {
          type: 'cholesterol',
          date: '2024-11-20',
          result: 'LDL: 145 mg/dL'
        },
        ...(ageVariant > 45 ? [{
          type: 'colonoscopy',
          date: '2023-08-10',
          result: 'normal'
        }] : [])
      ],
      plan: {
        inNetwork: true,
        deductibleMet: ageVariant > 50,
        remainingDeductible: ageVariant > 50 ? 0 : 1200,
        copayTier: ageVariant > 55 ? 'tier1' : 'tier2'
      }
    };
  }

  private canonicalizeSummary(summary: NormalizedSummary): Record<string, any> {
    // Create deterministic canonical form for hashing
    return {
      age: summary.age,
      sex: summary.sex,
      icd_codes: [...summary.icd].sort(),
      cpt_codes: [...summary.cpt].sort(),
      allergies: summary.allergies
        .map(a => `${a.substance}:${a.severity}`)
        .sort(),
      medications: summary.meds
        .map(m => `${m.name}:${m.dosage}:${m.frequency}`)
        .sort(),
      screenings: summary.lastScreenings
        .map(s => `${s.type}:${s.date}:${s.result}`)
        .sort(),
      plan_status: {
        in_network: summary.plan.inNetwork,
        deductible_met: summary.plan.deductibleMet,
        remaining_deductible: summary.plan.remainingDeductible,
        copay_tier: summary.plan.copayTier
      }
    };
  }

  private sha256Hash(input: string): string {
    // Simple hash function for demo (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad to create consistent length
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `sha256:${hex}:${input.length}:${Date.now() % 10000}`;
  }
}

/**
 * Default FHIR configuration for SMART App Launch
 */
export const defaultFHIRConfig: FHIRAuthConfig = {
  clientId: 'smart-family-office-app',
  redirectUri: `${window.location.origin}/health/fhir/callback`,
  scope: [
    'openid',
    'fhirUser',
    'patient/Patient.read',
    'patient/Coverage.read',
    'patient/ExplanationOfBenefit.read',
    'patient/Observation.read',
    'patient/Condition.read',
    'patient/MedicationRequest.read',
    'patient/DiagnosticReport.read',
    'patient/Procedure.read'
  ],
  iss: 'https://launch.smarthealthit.org/v/r4/fhir'
};

/**
 * Global FHIR client instance
 */
export const smartFHIRClient = new SmartFHIRClient(defaultFHIRConfig);

/**
 * Helper function to create summary hash for receipts
 */
export function createFHIRInputsHash(summary: NormalizedSummary): string {
  return smartFHIRClient.createSummaryHash(summary);
}