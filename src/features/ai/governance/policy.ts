export const SAFETY_POLICY = {
  // Content and trade safety
  allowFreeTextOrders: false,
  requireDualApproval: true,
  maxAdvicePerDay: 10,
  
  // Rate limiting
  maxToolCallsPerMinute: 30,
  maxSimulationsPerHour: 20,
  
  // Content filtering
  blockSensitiveQueries: true,
  requireExplanations: true,
  
  // AI model constraints
  maxTokensPerRequest: 4000,
  temperatureLimit: 0.7,
  
  // Audit requirements
  logAllInteractions: true,
  contentFreeLogging: true,
  requireReceiptAnchoring: false, // Optional blockchain anchoring
  
  // Escalation thresholds
  autoEscalateOnHighRisk: true,
  humanReviewThreshold: 0.8, // Confidence threshold for human review
  
  // Data protection
  anonymizePersonalData: true,
  dataRetentionDays: 365,
};

export const GOVERNANCE_LEVELS = {
  FAMILY: {
    allowedTools: ['rag.search', 'k401.rules', 'policy.check', 'receipt.log'],
    maxDailyInteractions: 50,
    requireSupervisorApproval: false,
  },
  ADVISOR: {
    allowedTools: ['rag.search', 'k401.rules', 'k401.trade', 'rollover.generate', 'policy.check', 'receipt.log'],
    maxDailyInteractions: 200,
    requireSupervisorApproval: true,
  },
  CPA: {
    allowedTools: ['rag.search', 'tax.analyze', 'reports.generate', 'policy.check', 'receipt.log'],
    maxDailyInteractions: 100,
    requireSupervisorApproval: false,
  },
  ATTORNEY: {
    allowedTools: ['rag.search', 'estate.rules', 'documents.generate', 'policy.check', 'receipt.log'],
    maxDailyInteractions: 75,
    requireSupervisorApproval: false,
  },
  ADMIN: {
    allowedTools: ['*'], // All tools
    maxDailyInteractions: 1000,
    requireSupervisorApproval: false,
  }
};

export function validateSafetyPolicy(persona: keyof typeof GOVERNANCE_LEVELS, action: string): {
  allowed: boolean;
  reason?: string;
  requiresApproval?: boolean;
} {
  const level = GOVERNANCE_LEVELS[persona];
  
  if (!level) {
    return { allowed: false, reason: 'Invalid persona' };
  }
  
  // Check tool allowlist
  if (!level.allowedTools.includes('*') && !level.allowedTools.includes(action)) {
    return { allowed: false, reason: `Tool ${action} not allowed for ${persona}` };
  }
  
  // Check if approval required
  if (level.requireSupervisorApproval && action.includes('trade')) {
    return { allowed: true, requiresApproval: true };
  }
  
  return { allowed: true };
}

export function updateSafetyPolicy(updates: Partial<typeof SAFETY_POLICY>): void {
  Object.assign(SAFETY_POLICY, updates);
  console.log('[AI Governance] Safety policy updated:', updates);
}

export function getSafetyPolicy(): typeof SAFETY_POLICY {
  return { ...SAFETY_POLICY }; // Return copy to prevent mutation
}