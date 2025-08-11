// Feature Extractor for Multi-Persona OS
// Vectorizes user events and joins compliance status for ML classification

import { supabase } from '@/integrations/supabase/client';

export interface UserEvent {
  page: string;
  timestamp: number;
  duration: number;
  action: string;
  metadata?: Record<string, any>;
}

export interface ComplianceContext {
  licenses: Array<{
    type: string;
    state: string;
    status: string;
    expiration: string;
  }>;
  ce_status: {
    current_hours: number;
    required_hours: number;
    renewal_date: string;
  };
  certifications: string[];
}

export interface PersonaFeatures {
  page_sequence_vector: number[];
  dwell_time_stats: {
    mean: number;
    std: number;
    total: number;
  };
  click_periodicity: {
    frequency: number;
    variance: number;
    patterns: number[];
  };
  device_posture: {
    screen_size: number;
    mobile_ratio: number;
    interaction_type: string;
  };
  compliance_features: {
    license_score: number;
    ce_compliance: number;
    cert_count: number;
    jurisdiction_count: number;
  };
  temporal_features: {
    session_count: number;
    avg_session_duration: number;
    activity_hours: number[];
    day_pattern: number[];
  };
}

export class FeatureExtractor {
  private pageSequenceVocab: Map<string, number> = new Map();
  private initialized = false;
  private modelId: string;
  private modelVersion: string;

  constructor(modelId: string = 'default-extractor', modelVersion: string = '1.0.0') {
    this.modelId = modelId;
    this.modelVersion = modelVersion;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Initialize page vocabulary for sequence encoding
    const pages = [
      'dashboard', 'clients', 'documents', 'billing', 'reports',
      'portfolio', 'investments', 'goals', 'planning', 'insurance',
      'tax', 'legal', 'compliance', 'audit', 'ce-tracking',
      'practice-management', 'appointments', 'cases', 'contracts'
    ];
    
    pages.forEach((page, idx) => {
      this.pageSequenceVocab.set(page, idx + 1);
    });
    
    this.initialized = true;
  }

  async extractFeatures(
    events: UserEvent[],
    userId: string,
    sessionId: string
  ): Promise<PersonaFeatures> {
    await this.initialize();
    
    // Extract behavioral features
    const pageSequenceVector = this.extractPageSequence(events);
    const dwellTimeStats = this.calculateDwellTimeStats(events);
    const clickPeriodicity = this.analyzeClickPeriodicity(events);
    const devicePosture = this.extractDevicePosture(events);
    const temporalFeatures = this.extractTemporalFeatures(events);
    
    // Get compliance context
    const complianceFeatures = await this.extractComplianceFeatures(userId);
    
    // Store features as signals
    await this.storePersonaSignals(userId, sessionId, {
      page_sequence_vector: pageSequenceVector,
      dwell_time_stats: dwellTimeStats,
      click_periodicity: clickPeriodicity,
      device_posture: devicePosture,
      compliance_features: complianceFeatures,
      temporal_features: temporalFeatures
    });
    
    return {
      page_sequence_vector: pageSequenceVector,
      dwell_time_stats: dwellTimeStats,
      click_periodicity: clickPeriodicity,
      device_posture: devicePosture,
      compliance_features: complianceFeatures,
      temporal_features: temporalFeatures,
      model: {
        id: this.modelId,
        version: this.modelVersion,
        extractedAt: Date.now()
      }
    };
  }

  private extractPageSequence(events: UserEvent[]): number[] {
    const sequence: number[] = [];
    const windowSize = 10; // Last 10 page views
    
    const pageEvents = events
      .filter(e => e.action === 'page_view')
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-windowSize);
    
    for (const event of pageEvents) {
      const pageId = this.pageSequenceVocab.get(event.page) || 0;
      sequence.push(pageId);
    }
    
    // Pad sequence to fixed length
    while (sequence.length < windowSize) {
      sequence.unshift(0);
    }
    
    return sequence;
  }

  private calculateDwellTimeStats(events: UserEvent[]): {
    mean: number;
    std: number;
    total: number;
  } {
    const dwellTimes = events
      .filter(e => e.action === 'page_view' && e.duration > 0)
      .map(e => e.duration);
    
    if (dwellTimes.length === 0) {
      return { mean: 0, std: 0, total: 0 };
    }
    
    const mean = dwellTimes.reduce((sum, t) => sum + t, 0) / dwellTimes.length;
    const variance = dwellTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / dwellTimes.length;
    const std = Math.sqrt(variance);
    const total = dwellTimes.reduce((sum, t) => sum + t, 0);
    
    return { mean, std, total };
  }

  private analyzeClickPeriodicity(events: UserEvent[]): {
    frequency: number;
    variance: number;
    patterns: number[];
  } {
    const clickEvents = events
      .filter(e => e.action === 'click')
      .sort((a, b) => a.timestamp - b.timestamp);
    
    if (clickEvents.length < 2) {
      return { frequency: 0, variance: 0, patterns: [] };
    }
    
    // Calculate intervals between clicks
    const intervals: number[] = [];
    for (let i = 1; i < clickEvents.length; i++) {
      intervals.push(clickEvents[i].timestamp - clickEvents[i-1].timestamp);
    }
    
    const frequency = intervals.length / (clickEvents[clickEvents.length - 1].timestamp - clickEvents[0].timestamp);
    const meanInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - meanInterval, 2), 0) / intervals.length;
    
    // Pattern analysis: bucket intervals into time ranges
    const patterns = new Array(10).fill(0);
    intervals.forEach(interval => {
      const bucket = Math.min(9, Math.floor(interval / 1000)); // 1-second buckets
      patterns[bucket]++;
    });
    
    return { frequency, variance, patterns };
  }

  private extractDevicePosture(events: UserEvent[]): {
    screen_size: number;
    mobile_ratio: number;
    interaction_type: string;
  } {
    let mobileEvents = 0;
    let totalEvents = events.length;
    let screenSize = 1920; // Default desktop
    let interactionType = 'mouse';
    
    events.forEach(event => {
      if (event.metadata?.screen_width) {
        screenSize = Math.max(screenSize, event.metadata.screen_width);
      }
      if (event.metadata?.is_mobile) {
        mobileEvents++;
      }
      if (event.metadata?.interaction_type) {
        interactionType = event.metadata.interaction_type;
      }
    });
    
    return {
      screen_size: screenSize,
      mobile_ratio: totalEvents > 0 ? mobileEvents / totalEvents : 0,
      interaction_type: interactionType
    };
  }

  private extractTemporalFeatures(events: UserEvent[]): {
    session_count: number;
    avg_session_duration: number;
    activity_hours: number[];
    day_pattern: number[];
  } {
    // Group events by session (gap > 30 minutes = new session)
    const sessions: UserEvent[][] = [];
    let currentSession: UserEvent[] = [];
    
    const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
    
    for (const event of sortedEvents) {
      if (currentSession.length === 0 || 
          event.timestamp - currentSession[currentSession.length - 1].timestamp > 30 * 60 * 1000) {
        if (currentSession.length > 0) {
          sessions.push(currentSession);
        }
        currentSession = [event];
      } else {
        currentSession.push(event);
      }
    }
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    // Calculate session durations
    const sessionDurations = sessions.map(session => {
      if (session.length < 2) return 0;
      return session[session.length - 1].timestamp - session[0].timestamp;
    });
    
    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length 
      : 0;
    
    // Activity by hour of day (0-23)
    const activityHours = new Array(24).fill(0);
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      activityHours[hour]++;
    });
    
    // Day of week pattern (0=Sunday, 6=Saturday)
    const dayPattern = new Array(7).fill(0);
    events.forEach(event => {
      const day = new Date(event.timestamp).getDay();
      dayPattern[day]++;
    });
    
    return {
      session_count: sessions.length,
      avg_session_duration: avgSessionDuration,
      activity_hours: activityHours,
      day_pattern: dayPattern
    };
  }

  private async extractComplianceFeatures(userId: string): Promise<{
    license_score: number;
    ce_compliance: number;
    cert_count: number;
    jurisdiction_count: number;
  }> {
    try {
      // Get compliance records
      const { data: complianceRecords } = await supabase
        .from('compliance_records')
        .select('*')
        .eq('user_id', userId);
      
      if (!complianceRecords) {
        return { license_score: 0, ce_compliance: 0, cert_count: 0, jurisdiction_count: 0 };
      }
      
      // Calculate license score (active licenses / total licenses)
      const totalLicenses = complianceRecords.filter(r => r.record_type === 'license').length;
      const activeLicenses = complianceRecords.filter(r => 
        r.record_type === 'license' && r.status === 'active'
      ).length;
      const licenseScore = totalLicenses > 0 ? activeLicenses / totalLicenses : 0;
      
      // Calculate CE compliance
      const ceRecords = complianceRecords.filter(r => ['ce', 'cle', 'cpe'].includes(r.record_type));
      const currentCE = ceRecords.filter(r => r.status === 'active').length;
      const requiredCE = ceRecords.length;
      const ceCompliance = requiredCE > 0 ? currentCE / requiredCE : 0;
      
      // Count certifications
      const certCount = complianceRecords.filter(r => 
        r.record_type === 'certification' && r.status === 'active'
      ).length;
      
      // Count jurisdictions
      const jurisdictions = new Set(complianceRecords.map(r => r.state_jurisdiction).filter(Boolean));
      const jurisdictionCount = jurisdictions.size;
      
      return {
        license_score: licenseScore,
        ce_compliance: ceCompliance,
        cert_count: certCount,
        jurisdiction_count: jurisdictionCount
      };
    } catch (error) {
      console.error('Error extracting compliance features:', error);
      return { license_score: 0, ce_compliance: 0, cert_count: 0, jurisdiction_count: 0 };
    }
  }

  private async storePersonaSignals(
    userId: string,
    sessionId: string,
    features: PersonaFeatures
  ): Promise<void> {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userId)
        .single();
      
      if (!userProfile) return;
      
      // Store each feature type as a separate signal
      const signals = [
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'page_sequence',
          signal_value: { vector: features.page_sequence_vector },
          confidence: 0.8
        },
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'dwell_time',
          signal_value: features.dwell_time_stats,
          confidence: 0.9
        },
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'click_periodicity',
          signal_value: features.click_periodicity,
          confidence: 0.7
        },
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'device_posture',
          signal_value: features.device_posture,
          confidence: 0.95
        },
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'compliance_features',
          signal_value: features.compliance_features,
          confidence: 1.0
        },
        {
          user_id: userId,
          tenant_id: userProfile.tenant_id,
          session_id: sessionId,
          signal_type: 'temporal_features',
          signal_value: features.temporal_features,
          confidence: 0.85
        }
      ];
      
      await supabase.from('persona_signals').insert(signals);
    } catch (error) {
      console.error('Error storing persona signals:', error);
    }
  }

  // Utility method to create hash of inputs for audit trail
  public static hashFeatures(features: PersonaFeatures): string {
    const canonical = JSON.stringify(features, Object.keys(features).sort());
    // Simple hash function for demonstration - in production use crypto.subtle
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      const char = canonical.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}