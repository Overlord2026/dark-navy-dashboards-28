export interface OnboardingReceipt {
  id: string;
  type: 'persona_select' | 'goal_create' | 'account_connect' | 'first_calculation' | 'invite_consent';
  timestamp: string; // ISO 8601
  user_id?: string;
  session_id: string;
  data: {
    persona?: 'aspiring' | 'retiree';
    complexity_tier?: 'foundational' | 'advanced';
    goal_details?: {
      type: string;
      amount?: number;
      target_date?: string;
      priority: 'high' | 'medium' | 'low';
    };
    account_info?: {
      institution: string;
      account_type: string;
      last_four: string;
      connected_at: string;
    };
    calculation_result?: {
      type: string;
      input_values: Record<string, any>;
      result_value: number | string;
      recommendations?: string[];
    };
    invite_details?: {
      professional_type: 'advisor' | 'cpa' | 'attorney';
      email?: string;
      relationship: string;
      consent_given: boolean;
    };
  };
  ttfv_metrics?: {
    step_start_time: string;
    step_completion_time: string;
    duration_seconds: number;
    cumulative_time_seconds: number;
    target_threshold_seconds: number;
    met_target: boolean;
  };
  entitlements?: {
    current_tier: 'basic' | 'premium' | 'elite';
    feature_accessed?: string;
    gated_action?: boolean;
    pricing_redirect?: boolean;
  };
  accessibility_score?: number;
  performance_score?: number;
  errors?: string[];
}

export interface OnboardingSession {
  id: string;
  user_id?: string;
  started_at: string;
  completed_at?: string;
  persona: 'aspiring' | 'retiree';
  complexity_tier: 'foundational' | 'advanced';
  current_step: number;
  total_steps: number;
  receipts: OnboardingReceipt[];
  ttfv_target_seconds: number; // 600 for aspiring, 720 for retiree
  ttfv_actual_seconds?: number;
  ttfv_achieved: boolean;
  abandoned_at?: string;
  completion_rate: number; // 0-100
  next_best_action?: {
    type: 'pricing' | 'support' | 'resume' | 'alternative';
    description: string;
    route: string;
    feature?: string;
  };
}

// Helper functions
export function createOnboardingReceipt(
  type: OnboardingReceipt['type'],
  data: OnboardingReceipt['data'],
  sessionId: string,
  ttfvMetrics?: OnboardingReceipt['ttfv_metrics']
): OnboardingReceipt {
  return {
    id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: new Date().toISOString(),
    session_id: sessionId,
    data,
    ttfv_metrics: ttfvMetrics,
    accessibility_score: 95, // Default high score
    performance_score: 80,   // Default target score
    errors: []
  };
}

export function calculateTTFVMetrics(
  stepStartTime: Date,
  targetSeconds: number
): OnboardingReceipt['ttfv_metrics'] {
  const now = new Date();
  const durationSeconds = Math.floor((now.getTime() - stepStartTime.getTime()) / 1000);
  
  return {
    step_start_time: stepStartTime.toISOString(),
    step_completion_time: now.toISOString(),
    duration_seconds: durationSeconds,
    cumulative_time_seconds: durationSeconds, // Will be updated by session tracker
    target_threshold_seconds: targetSeconds,
    met_target: durationSeconds <= targetSeconds
  };
}

export function initializeOnboardingSession(
  persona: 'aspiring' | 'retiree',
  complexityTier: 'foundational' | 'advanced' = 'foundational'
): OnboardingSession {
  const ttfvTargets = {
    aspiring: 600,  // 10 minutes
    retiree: 720    // 12 minutes
  };

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    started_at: new Date().toISOString(),
    persona,
    complexity_tier: complexityTier,
    current_step: 1,
    total_steps: 5, // Streamlined to 5 key steps
    receipts: [],
    ttfv_target_seconds: ttfvTargets[persona],
    ttfv_achieved: false,
    completion_rate: 0
  };
}