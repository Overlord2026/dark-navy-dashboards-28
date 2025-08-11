// @ts-nocheck
/**
 * ===================================================
 * Patent #9: Automated Professional Vetting Engine
 * Multi-Registry Fusion & Streak-Based Trust Scoring
 * ===================================================
 */

import { supabase } from '@/integrations/supabase/client';

export interface VettingRequest {
  id: string;
  professional_id: string;
  request_type: 'initial' | 'periodic' | 'triggered' | 'manual';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'escalated';
  priority: number;
  sla_deadline?: string;
  metadata: Record<string, any>;
}

export interface RegistrySource {
  id: string;
  source_name: string;
  source_type: 'cfp_board' | 'finra' | 'state_bar' | 'cpa_board' | 'medical_board' | 'insurance_board' | 'other';
  api_endpoint?: string;
  rate_limit_per_minute: number;
  reliability_score: number;
  jurisdiction?: string;
}

export interface RegistryRecord {
  id: string;
  source_id: string;
  professional_id: string;
  match_score: number;
  field_confidence: Record<string, number>;
  identity_matches: Record<string, any>;
  license_status?: string;
  license_number?: string;
  license_expiry?: string;
  verification_status: 'verified' | 'partial' | 'failed' | 'conflicted';
  raw_response: Record<string, any>;
}

export interface TrustScore {
  id: string;
  professional_id: string;
  base_score: number;
  computed_score: number;
  streak_count: number;
  streak_bonus: number;
  decay_factor: number;
  days_since_last_verification: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  confidence_level: number;
  score_history: Array<{
    date: string;
    score: number;
    reason: string;
    streak_count: number;
  }>;
}

export class VettingEngine {
  private static instance: VettingEngine;
  
  public static getInstance(): VettingEngine {
    if (!VettingEngine.instance) {
      VettingEngine.instance = new VettingEngine();
    }
    return VettingEngine.instance;
  }

  /**
   * Patent Feature: Multi-Registry Fusion Engine
   * Probabilistic identity matching across multiple credential sources
   */
  async initiateVettingRequest(professionalId: string, requestType: string = 'initial', priority: number = 5): Promise<VettingRequest> {
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 24); // 24-hour SLA

    const { data, error } = await supabase
      .from('vetting_requests')
      .insert({
        professional_id: professionalId,
        request_type: requestType,
        priority,
        sla_deadline: slaDeadline.toISOString(),
        requested_by: (await supabase.auth.getUser()).data.user?.id,
        metadata: {
          initiated_at: new Date().toISOString(),
          source: 'automated_vetting_engine'
        }
      })
      .select()
      .single();

    if (error) throw error;
    
    // Trigger parallel registry queries
    await this.executeMultiRegistryFusion(data.id, professionalId);
    
    return data;
  }

  /**
   * Patent Feature: Multi-Registry Fusion with Field-Level Confidence
   * Query multiple registries in parallel with weighted scoring
   */
  private async executeMultiRegistryFusion(vettingRequestId: string, professionalId: string): Promise<void> {
    // Get active credential sources
    const { data: sources } = await supabase
      .from('credential_sources')
      .select('*')
      .eq('is_active', true)
      .order('reliability_score', { ascending: false });

    if (!sources) return;

    // Get professional data for queries
    const { data: professional } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single();

    if (!professional) throw new Error('Professional not found');

    // Execute parallel queries with circuit breaker pattern
    const registryPromises = sources.map(source => 
      this.queryRegistryWithCircuitBreaker(vettingRequestId, source, professional)
    );

    const results = await Promise.allSettled(registryPromises);
    
    // Process results and calculate aggregate scores
    await this.processRegistryResults(vettingRequestId, professionalId, results);
  }

  /**
   * Patent Feature: Circuit Breaker with Rate Limiting
   * Defensive external API querying with fallback to cache
   */
  private async queryRegistryWithCircuitBreaker(
    vettingRequestId: string, 
    source: RegistrySource, 
    professional: any
  ): Promise<RegistryRecord | null> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = `${source.id}_${professional.id}_${new Date().toDateString()}`;
      const { data: cached } = await supabase
        .from('registry_records')
        .select('*')
        .eq('cache_key', cacheKey)
        .gte('cache_expires_at', new Date().toISOString())
        .maybeSingle();

      if (cached) {
        return cached;
      }

      // Rate limiting check
      await this.enforceRateLimit(source.id, source.rate_limit_per_minute);

      // Query external registry (simulated - replace with actual API calls)
      const response = await this.simulateRegistryQuery(source, professional);
      
      const queryDuration = Date.now() - startTime;
      
      // Calculate field-level confidence scores
      const fieldConfidence = this.calculateFieldConfidence(response, professional);
      const matchScore = this.calculateOverallMatchScore(fieldConfidence);

      // Store registry record
      const { data: record, error } = await supabase
        .from('registry_records')
        .insert({
          vetting_request_id: vettingRequestId,
          source_id: source.id,
          professional_id: professional.id,
          query_parameters: {
            name: professional.name,
            email: professional.email,
            certifications: professional.certifications
          },
          raw_response: response,
          parsed_data: this.parseRegistryResponse(response),
          match_score: matchScore,
          field_confidence: fieldConfidence,
          identity_matches: this.calculateIdentityMatches(response, professional),
          verification_status: this.determineVerificationStatus(matchScore, fieldConfidence),
          cache_key: cacheKey,
          cache_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h cache
          query_duration_ms: queryDuration,
          response_code: 200
        })
        .select()
        .single();

      if (error) throw error;
      return record;

    } catch (error) {
      console.error(`Registry query failed for ${source.source_name}:`, error);
      
      // Log failure for circuit breaker
      await this.logRegistryFailure(source.id, error);
      
      return null;
    }
  }

  /**
   * Patent Feature: Field-Level Confidence Scoring
   * Probabilistic matching with weighted field importance
   */
  private calculateFieldConfidence(response: any, professional: any): Record<string, number> {
    const confidence: Record<string, number> = {};
    
    // Name matching with phonetic similarity
    confidence.name = this.calculateNameConfidence(response.name, professional.name);
    
    // License number exact match
    confidence.license_number = response.license_number === professional.license_number ? 1.0 : 0.0;
    
    // Email domain matching
    confidence.email = this.calculateEmailConfidence(response.email, professional.email);
    
    // Certification matching
    confidence.certifications = this.calculateCertificationConfidence(
      response.certifications, 
      professional.certifications
    );
    
    // Address proximity matching
    confidence.address = this.calculateAddressConfidence(response.address, professional.address);
    
    return confidence;
  }

  private calculateNameConfidence(registryName: string, professionalName: string): number {
    if (!registryName || !professionalName) return 0.0;
    
    // Exact match
    if (registryName.toLowerCase() === professionalName.toLowerCase()) return 1.0;
    
    // Levenshtein distance scoring
    const distance = this.levenshteinDistance(
      registryName.toLowerCase(), 
      professionalName.toLowerCase()
    );
    const maxLength = Math.max(registryName.length, professionalName.length);
    const similarity = 1 - (distance / maxLength);
    
    // Apply threshold
    return similarity > 0.8 ? similarity : 0.0;
  }

  private calculateEmailConfidence(registryEmail: string, professionalEmail: string): number {
    if (!registryEmail || !professionalEmail) return 0.0;
    return registryEmail.toLowerCase() === professionalEmail.toLowerCase() ? 1.0 : 0.0;
  }

  private calculateCertificationConfidence(registryCerts: string[], professionalCerts: string[]): number {
    if (!registryCerts?.length || !professionalCerts?.length) return 0.0;
    
    const matches = registryCerts.filter(cert => 
      professionalCerts.some(pCert => 
        pCert.toLowerCase().includes(cert.toLowerCase()) ||
        cert.toLowerCase().includes(pCert.toLowerCase())
      )
    );
    
    return matches.length / Math.max(registryCerts.length, professionalCerts.length);
  }

  private calculateAddressConfidence(registryAddress: string, professionalAddress: string): number {
    if (!registryAddress || !professionalAddress) return 0.0;
    
    // Extract zip codes for quick matching
    const registryZip = registryAddress.match(/\d{5}/)?.[0];
    const professionalZip = professionalAddress.match(/\d{5}/)?.[0];
    
    if (registryZip && professionalZip) {
      return registryZip === professionalZip ? 0.8 : 0.0;
    }
    
    return 0.0;
  }

  private calculateOverallMatchScore(fieldConfidence: Record<string, number>): number {
    // Weighted scoring based on field importance
    const weights = {
      name: 0.3,
      license_number: 0.4,
      email: 0.1,
      certifications: 0.15,
      address: 0.05
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.entries(fieldConfidence).forEach(([field, confidence]) => {
      const weight = weights[field as keyof typeof weights] || 0.1;
      weightedSum += confidence * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0.0;
  }

  /**
   * Patent Feature: Streak-Based Trust Scoring with Temporal Decay
   * Formula: ComputedScore = BaseScore × (DecayFactor ^ DaysSinceLastVerification) + (StreakBonus × StreakCount)
   */
  async calculateTrustScore(professionalId: string): Promise<TrustScore> {
    // Get current trust score
    let { data: trustScore } = await supabase
      .from('trust_scores')
      .select('*')
      .eq('professional_id', professionalId)
      .maybeSingle();

    if (!trustScore) {
      // Initialize new trust score
      trustScore = {
        professional_id: professionalId,
        base_score: 0.5,
        computed_score: 0.5,
        streak_count: 0,
        streak_bonus: 0.0,
        decay_factor: 0.99,
        days_since_last_verification: 0,
        confidence_level: 0.5,
        tier: 'bronze',
        score_history: []
      };
    }

    // Get latest verification results
    const { data: registryRecords } = await supabase
      .from('registry_records')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!registryRecords?.length) return trustScore;

    // Calculate verification success rate
    const successfulVerifications = registryRecords.filter(r => r.verification_status === 'verified');
    const verificationRate = successfulVerifications.length / registryRecords.length;

    // Update base score based on verification results
    const newBaseScore = Math.min(1.0, Math.max(0.0, verificationRate * 0.8 + 0.2));

    // Calculate days since last verification
    const lastVerification = new Date(registryRecords[0].created_at);
    const daysSince = Math.floor((Date.now() - lastVerification.getTime()) / (1000 * 60 * 60 * 24));

    // Check for adverse events (sanctions, disciplinary actions)
    const { data: sanctionHits } = await supabase
      .from('sanction_hits')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    let streakCount = trustScore.streak_count;
    let lastAdverseEvent = trustScore.last_adverse_event_date;

    // Reset streak on new adverse events
    if (sanctionHits?.length) {
      const latestSanction = new Date(sanctionHits[0].created_at);
      if (!lastAdverseEvent || latestSanction > new Date(lastAdverseEvent)) {
        streakCount = 0;
        lastAdverseEvent = latestSanction.toISOString();
      }
    } else if (verificationRate >= 0.9) {
      // Increment streak for high success rate
      streakCount += 1;
    }

    // Apply temporal decay formula
    const decayFactor = trustScore.decay_factor;
    const streakBonus = Math.min(0.2, streakCount * 0.02); // Max 20% bonus
    
    const computedScore = Math.min(1.0, 
      newBaseScore * Math.pow(decayFactor, daysSince) + streakBonus
    );

    // Determine tier based on computed score
    const tier = this.calculateTier(computedScore, streakCount);

    // Update score history
    const scoreHistory = [
      ...(trustScore.score_history || []),
      {
        date: new Date().toISOString(),
        score: computedScore,
        reason: `Verification rate: ${(verificationRate * 100).toFixed(1)}%, Streak: ${streakCount}`,
        streak_count: streakCount
      }
    ].slice(-50); // Keep last 50 entries

    const updatedTrustScore: TrustScore = {
      ...trustScore,
      base_score: newBaseScore,
      computed_score: computedScore,
      streak_count: streakCount,
      streak_bonus: streakBonus,
      days_since_last_verification: daysSince,
      last_verification_date: lastVerification.toISOString(),
      last_adverse_event_date: lastAdverseEvent,
      score_history: scoreHistory,
      confidence_level: Math.min(1.0, registryRecords.length * 0.1),
      tier,
      tier_updated_at: new Date().toISOString()
    };

    // Save updated trust score
    await supabase
      .from('trust_scores')
      .upsert(updatedTrustScore);

    return updatedTrustScore;
  }

  private calculateTier(computedScore: number, streakCount: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (computedScore >= 0.9 && streakCount >= 10) return 'platinum';
    if (computedScore >= 0.8 && streakCount >= 5) return 'gold';
    if (computedScore >= 0.7 && streakCount >= 2) return 'silver';
    return 'bronze';
  }

  /**
   * Patent Feature: Cross-Jurisdiction License Reconciliation
   * Normalize and reconcile license status across jurisdictions
   */
  async reconcileLicenseConflicts(professionalId: string): Promise<void> {
    const { data: records } = await supabase
      .from('registry_records')
      .select('*')
      .eq('professional_id', professionalId)
      .not('license_number', 'is', null);

    if (!records || records.length < 2) return;

    // Group by jurisdiction
    const jurisdictionGroups = records.reduce((groups, record) => {
      const jurisdiction = record.parsed_data?.jurisdiction || 'unknown';
      if (!groups[jurisdiction]) groups[jurisdiction] = [];
      groups[jurisdiction].push(record);
      return groups;
    }, {} as Record<string, any[]>);

    // Detect conflicts
    for (const [jurisdiction, jurisdictionRecords] of Object.entries(jurisdictionGroups)) {
      if (jurisdictionRecords.length > 1) {
        await this.processJurisdictionConflict(professionalId, jurisdiction, jurisdictionRecords);
      }
    }
  }

  private async processJurisdictionConflict(
    professionalId: string, 
    jurisdiction: string, 
    conflictingRecords: any[]
  ): Promise<void> {
    const conflictDetails = {
      jurisdiction,
      conflict_type: 'duplicate_licenses',
      records: conflictingRecords.map(r => ({
        source: r.source_id,
        license_number: r.license_number,
        status: r.license_status,
        expiry: r.license_expiry
      }))
    };

    // Determine resolution method
    let resolutionMethod = 'pending';
    let resolutionReason = '';

    // Auto-resolve if all records have same license number
    const uniqueLicenseNumbers = [...new Set(conflictingRecords.map(r => r.license_number))];
    if (uniqueLicenseNumbers.length === 1) {
      resolutionMethod = 'auto_resolved';
      resolutionReason = 'Same license number across all sources';
    }

    await supabase
      .from('reconciliation_logs')
      .insert({
        professional_id: professionalId,
        reconciliation_type: 'license_conflict',
        source_records: conflictingRecords.map(r => r.id),
        conflict_details: conflictDetails,
        resolution_method: resolutionMethod,
        resolution_reason: resolutionReason,
        confidence_score: resolutionMethod === 'auto_resolved' ? 0.95 : null
      });
  }

  // Helper methods
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private async enforceRateLimit(sourceId: string, limitPerMinute: number): Promise<void> {
    // Implementation would track API calls per source
    // For now, add a small delay to simulate rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async simulateRegistryQuery(source: RegistrySource, professional: any): Promise<any> {
    // Simulate external API call with realistic response
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    return {
      name: professional.name,
      license_number: professional.certifications?.[0] || 'MOCK-123456',
      license_status: 'active',
      email: professional.email,
      certifications: professional.certifications || [],
      jurisdiction: source.jurisdiction || 'CA',
      verified: Math.random() > 0.1, // 90% success rate
      disciplinary_actions: []
    };
  }

  private parseRegistryResponse(response: any): any {
    return {
      license_active: response.license_status === 'active',
      has_sanctions: response.disciplinary_actions?.length > 0,
      jurisdiction: response.jurisdiction,
      verification_source: response.source || 'external_registry'
    };
  }

  private calculateIdentityMatches(response: any, professional: any): Record<string, any> {
    return {
      name_match: response.name === professional.name,
      license_match: response.license_number === professional.certifications?.[0],
      email_match: response.email === professional.email
    };
  }

  private determineVerificationStatus(matchScore: number, fieldConfidence: Record<string, number>): string {
    if (matchScore >= 0.9) return 'verified';
    if (matchScore >= 0.7) return 'partial';
    if (matchScore >= 0.5) return 'conflicted';
    return 'failed';
  }

  private async processRegistryResults(
    vettingRequestId: string, 
    professionalId: string, 
    results: PromiseSettledResult<RegistryRecord | null>[]
  ): Promise<void> {
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<RegistryRecord> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    // Update vetting request status
    const overallStatus = successfulResults.length > 0 ? 'completed' : 'failed';
    
    await supabase
      .from('vetting_requests')
      .update({
        status: overallStatus,
        completed_at: new Date().toISOString(),
        metadata: {
          registry_queries: results.length,
          successful_queries: successfulResults.length,
          overall_match_score: successfulResults.reduce((sum, r) => sum + r.match_score, 0) / successfulResults.length || 0
        }
      })
      .eq('id', vettingRequestId);

    // Calculate updated trust score
    await this.calculateTrustScore(professionalId);

    // Perform license reconciliation
    await this.reconcileLicenseConflicts(professionalId);
  }

  private async logRegistryFailure(sourceId: string, error: any): Promise<void> {
    console.error(`Registry failure logged for source ${sourceId}:`, error);
    // Implementation would update circuit breaker state
  }
}