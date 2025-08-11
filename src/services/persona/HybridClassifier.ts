// Hybrid Classifier for Multi-Persona OS
// Uses gradient-boosted trees with rule priors (log-odds offsets)

import { PersonaFeatures } from './FeatureExtractor';

export interface ClassificationResult {
  probs: Record<string, number>;
  topPersona: string;
  confidence: number;
  reasoning: string[];
  features_used: string[];
}

export interface PersonaRule {
  name: string;
  condition: (features: PersonaFeatures) => boolean;
  log_odds_offset: number;
  weight: number;
  reasoning: string;
}

export interface ClassificationContext {
  time_of_day: number;
  day_of_week: number;
  session_length: number;
  previous_classifications: string[];
  tenant_context?: Record<string, any>;
}

export class HybridClassifier {
  private rules: PersonaRule[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Define rule priors for each persona type
    this.rules = [
      // Financial Advisor Rules
      {
        name: 'advisor_portfolio_focus',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [6, 7, 8].includes(p)).length >= 3 &&
          features.compliance_features.license_score > 0.8,
        log_odds_offset: 2.5,
        weight: 0.9,
        reasoning: 'High portfolio page activity with strong license compliance'
      },
      {
        name: 'advisor_client_management',
        condition: (features) => 
          features.dwell_time_stats.mean > 30000 && // 30+ seconds per page
          features.temporal_features.session_count > 5,
        log_odds_offset: 1.8,
        weight: 0.8,
        reasoning: 'Extended engagement patterns typical of client management'
      },
      
      // Attorney Rules
      {
        name: 'attorney_document_focus',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [3, 12, 18].includes(p)).length >= 2 &&
          features.compliance_features.ce_compliance > 0.7,
        log_odds_offset: 2.2,
        weight: 0.85,
        reasoning: 'Document and legal page focus with CLE compliance'
      },
      {
        name: 'attorney_case_patterns',
        condition: (features) => 
          features.click_periodicity.frequency > 0.1 &&
          features.temporal_features.activity_hours.slice(9, 18).some(h => h > 10),
        log_odds_offset: 1.5,
        weight: 0.7,
        reasoning: 'Business hours activity with case management patterns'
      },
      
      // CPA Rules
      {
        name: 'cpa_tax_compliance',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [11, 14, 15].includes(p)).length >= 2 &&
          features.compliance_features.license_score > 0.9,
        log_odds_offset: 2.8,
        weight: 0.95,
        reasoning: 'Tax and compliance focus with active CPA license'
      },
      {
        name: 'cpa_seasonal_patterns',
        condition: (features) => 
          features.temporal_features.session_count > 8 &&
          features.dwell_time_stats.total > 300000, // 5+ minutes total
        log_odds_offset: 1.6,
        weight: 0.8,
        reasoning: 'High-volume usage consistent with tax season activity'
      },
      
      // Insurance Agent Rules
      {
        name: 'insurance_product_focus',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [10].includes(p)).length >= 1 &&
          features.compliance_features.license_score > 0.6,
        log_odds_offset: 2.0,
        weight: 0.8,
        reasoning: 'Insurance page activity with licensing'
      },
      
      // Client Rules
      {
        name: 'client_planning_focus',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [8, 9].includes(p)).length >= 2 &&
          features.compliance_features.license_score === 0,
        log_odds_offset: 1.5,
        weight: 0.7,
        reasoning: 'Planning focus without professional licensing'
      },
      {
        name: 'client_mobile_usage',
        condition: (features) => 
          features.device_posture.mobile_ratio > 0.6 &&
          features.dwell_time_stats.mean < 20000,
        log_odds_offset: 1.2,
        weight: 0.6,
        reasoning: 'Mobile-heavy usage with shorter session times'
      },
      
      // Compliance Officer Rules
      {
        name: 'compliance_audit_patterns',
        condition: (features) => 
          features.page_sequence_vector.filter(p => [13, 14].includes(p)).length >= 2 &&
          features.temporal_features.activity_hours.filter(h => h > 0).length > 12,
        log_odds_offset: 2.5,
        weight: 0.9,
        reasoning: 'Compliance and audit focus with extended work hours'
      }
    ];
    
    this.initialized = true;
  }

  async classify(
    features: PersonaFeatures, 
    context: ClassificationContext
  ): Promise<ClassificationResult> {
    await this.initialize();
    
    // Initialize base probabilities
    const baseProbs = {
      'advisor': 0.15,
      'attorney': 0.12,
      'cpa': 0.12,
      'accountant': 0.10,
      'insurance_agent': 0.08,
      'consultant': 0.06,
      'coach': 0.05,
      'enterprise_admin': 0.03,
      'compliance': 0.04,
      'imo_fmo': 0.02,
      'agency': 0.02,
      'organization': 0.01,
      'healthcare_consultant': 0.03,
      'realtor': 0.05,
      'property_manager': 0.02,
      'client': 0.10
    };
    
    // Apply gradient boosted decision trees with rule priors
    const logOdds = this.calculateLogOdds(features, context, baseProbs);
    const probs = this.softmaxTransform(logOdds);
    
    // Find top persona
    const sortedPersonas = Object.entries(probs)
      .sort(([,a], [,b]) => b - a);
    
    const topPersona = sortedPersonas[0][0];
    const confidence = sortedPersonas[0][1];
    
    // Generate reasoning
    const reasoning = this.generateReasoning(features, topPersona);
    const featuresUsed = this.getRelevantFeatures(features, topPersona);
    
    return {
      probs,
      topPersona,
      confidence,
      reasoning,
      features_used: featuresUsed
    };
  }

  private calculateLogOdds(
    features: PersonaFeatures,
    context: ClassificationContext,
    baseProbs: Record<string, number>
  ): Record<string, number> {
    const logOdds: Record<string, number> = {};
    
    // Start with base log-odds
    for (const [persona, prob] of Object.entries(baseProbs)) {
      logOdds[persona] = Math.log(prob / (1 - prob));
    }
    
    // Apply rule-based adjustments
    for (const rule of this.rules) {
      if (rule.condition(features)) {
        // Determine which personas this rule affects
        const affectedPersonas = this.getRulePersonas(rule.name);
        
        for (const persona of affectedPersonas) {
          if (logOdds[persona] !== undefined) {
            logOdds[persona] += rule.log_odds_offset * rule.weight;
          }
        }
      }
    }
    
    // Apply gradient boosted tree features
    this.applyGradientBoostingAdjustments(logOdds, features, context);
    
    // Apply temporal context adjustments
    this.applyTemporalAdjustments(logOdds, context);
    
    return logOdds;
  }

  private getRulePersonas(ruleName: string): string[] {
    const rulePersonaMap: Record<string, string[]> = {
      'advisor_portfolio_focus': ['advisor'],
      'advisor_client_management': ['advisor'],
      'attorney_document_focus': ['attorney'],
      'attorney_case_patterns': ['attorney'],
      'cpa_tax_compliance': ['cpa', 'accountant'],
      'cpa_seasonal_patterns': ['cpa', 'accountant'],
      'insurance_product_focus': ['insurance_agent'],
      'client_planning_focus': ['client'],
      'client_mobile_usage': ['client'],
      'compliance_audit_patterns': ['compliance']
    };
    
    return rulePersonaMap[ruleName] || [];
  }

  private applyGradientBoostingAdjustments(
    logOdds: Record<string, number>,
    features: PersonaFeatures,
    context: ClassificationContext
  ): void {
    // Tree 1: Compliance-based splits
    if (features.compliance_features.license_score > 0.5) {
      if (features.compliance_features.jurisdiction_count > 2) {
        logOdds['advisor'] += 1.2;
        logOdds['attorney'] += 0.8;
      } else {
        logOdds['cpa'] += 1.0;
        logOdds['insurance_agent'] += 0.6;
      }
    } else {
      logOdds['client'] += 1.5;
      logOdds['consultant'] += 0.3;
    }
    
    // Tree 2: Activity pattern splits
    if (features.temporal_features.session_count > 10) {
      if (features.dwell_time_stats.mean > 45000) {
        logOdds['attorney'] += 0.9;
        logOdds['cpa'] += 0.7;
      } else {
        logOdds['advisor'] += 0.6;
        logOdds['compliance'] += 0.8;
      }
    }
    
    // Tree 3: Device and interaction patterns
    if (features.device_posture.mobile_ratio < 0.3) {
      if (features.click_periodicity.frequency > 0.2) {
        logOdds['cpa'] += 0.8;
        logOdds['attorney'] += 0.6;
      } else {
        logOdds['advisor'] += 0.5;
      }
    } else {
      logOdds['client'] += 0.7;
      logOdds['realtor'] += 0.4;
    }
  }

  private applyTemporalAdjustments(
    logOdds: Record<string, number>,
    context: ClassificationContext
  ): void {
    // Business hours boost for professionals
    if (context.time_of_day >= 9 && context.time_of_day <= 17) {
      logOdds['advisor'] += 0.3;
      logOdds['attorney'] += 0.3;
      logOdds['cpa'] += 0.3;
      logOdds['insurance_agent'] += 0.2;
    }
    
    // Evening/weekend boost for clients
    if (context.time_of_day > 17 || context.day_of_week === 0 || context.day_of_week === 6) {
      logOdds['client'] += 0.4;
    }
    
    // Tax season adjustments (simplified - would be more sophisticated in production)
    const month = new Date().getMonth();
    if (month >= 0 && month <= 3) { // Jan-Apr
      logOdds['cpa'] += 0.5;
      logOdds['accountant'] += 0.5;
    }
  }

  private softmaxTransform(logOdds: Record<string, number>): Record<string, number> {
    const maxLogOdds = Math.max(...Object.values(logOdds));
    const expValues: Record<string, number> = {};
    let sumExp = 0;
    
    for (const [persona, odds] of Object.entries(logOdds)) {
      expValues[persona] = Math.exp(odds - maxLogOdds);
      sumExp += expValues[persona];
    }
    
    const probs: Record<string, number> = {};
    for (const [persona, expValue] of Object.entries(expValues)) {
      probs[persona] = expValue / sumExp;
    }
    
    return probs;
  }

  private generateReasoning(features: PersonaFeatures, topPersona: string): string[] {
    const reasoning: string[] = [];
    
    // Check which rules fired
    for (const rule of this.rules) {
      if (rule.condition(features)) {
        const affectedPersonas = this.getRulePersonas(rule.name);
        if (affectedPersonas.includes(topPersona)) {
          reasoning.push(rule.reasoning);
        }
      }
    }
    
    // Add feature-based reasoning
    if (features.compliance_features.license_score > 0.7) {
      reasoning.push(`Strong professional licensing (${(features.compliance_features.license_score * 100).toFixed(0)}% compliance)`);
    }
    
    if (features.temporal_features.session_count > 8) {
      reasoning.push(`High engagement (${features.temporal_features.session_count} sessions)`);
    }
    
    if (features.dwell_time_stats.mean > 30000) {
      reasoning.push(`Extended page engagement (${(features.dwell_time_stats.mean / 1000).toFixed(1)}s average)`);
    }
    
    return reasoning.length > 0 ? reasoning : ['Pattern-based classification'];
  }

  private getRelevantFeatures(features: PersonaFeatures, topPersona: string): string[] {
    const relevantFeatures: string[] = [];
    
    if (features.compliance_features.license_score > 0) {
      relevantFeatures.push('licensing_status');
    }
    
    if (features.temporal_features.session_count > 5) {
      relevantFeatures.push('activity_level');
    }
    
    if (features.page_sequence_vector.some(p => p > 0)) {
      relevantFeatures.push('navigation_patterns');
    }
    
    if (features.dwell_time_stats.mean > 0) {
      relevantFeatures.push('engagement_depth');
    }
    
    if (features.device_posture.mobile_ratio !== 0) {
      relevantFeatures.push('device_usage');
    }
    
    return relevantFeatures;
  }

  // Utility method for creating hash of classification inputs
  public static hashInputs(features: PersonaFeatures, context: ClassificationContext): string {
    const inputData = { features, context };
    const canonical = JSON.stringify(inputData, Object.keys(inputData).sort());
    
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      const char = canonical.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Utility method for creating hash of classification outputs
  public static hashOutputs(result: ClassificationResult): string {
    const outputData = {
      topPersona: result.topPersona,
      confidence: Math.round(result.confidence * 1000) / 1000, // Round for consistency
      features_used: result.features_used.sort()
    };
    const canonical = JSON.stringify(outputData, Object.keys(outputData).sort());
    
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      const char = canonical.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}