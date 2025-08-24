/**
 * Jump Platform Import Adapter  
 * Normalizes Jump call summaries to Decision-RDS + Vault-RDS format
 */

export interface JumpCallSummary {
  id: string;
  call_title: string;
  call_date: string;
  attendees: string[];
  summary_text: string;
  key_topics: string[];
  decisions_made: string[];
  next_steps: string[];
  call_duration_minutes: number;
  call_type: string;
  metadata?: Record<string, any>;
}

export interface JumpParsedMeeting {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  riskFlags: string[];
  participants: string[];
  duration: number;
  complianceNotes: string[];
  followUpRequired: boolean;
}

/**
 * Parse Jump call summary and normalize to standard format
 */
export const parseJumpCallSummary = (callSummary: JumpCallSummary): JumpParsedMeeting => {
  // Use existing summary from Jump
  const summary = callSummary.summary_text;
  
  // Map key topics to key points
  const keyPoints = callSummary.key_topics || [];
  
  // Combine decisions and next steps as action items
  const actionItems = [
    ...(callSummary.decisions_made || []),
    ...(callSummary.next_steps || [])
  ];
  
  // Analyze for compliance risks
  const riskFlags = identifyJumpRiskFlags(callSummary);
  
  // Extract compliance notes from summary
  const complianceNotes = extractJumpComplianceNotes(callSummary);
  
  return {
    summary,
    keyPoints: keyPoints.slice(0, 5), // Limit key points
    actionItems: actionItems.slice(0, 5), // Limit action items
    riskFlags,
    participants: callSummary.attendees,
    duration: callSummary.call_duration_minutes,
    complianceNotes,
    followUpRequired: actionItems.length > 0 || riskFlags.length > 0
  };
};

/**
 * Generate inputs hash for Jump call summary
 */
export const generateJumpInputsHash = (callSummary: JumpCallSummary): string => {
  const hashInput = {
    id: callSummary.id,
    title: callSummary.call_title,
    date: callSummary.call_date,
    attendees: callSummary.attendees,
    summary_length: callSummary.summary_text.length,
    duration: callSummary.call_duration_minutes,
    call_type: callSummary.call_type
  };
  
  return btoa(JSON.stringify(hashInput)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

/**
 * Verify consent and minimum necessary for Jump imports
 */
export const verifyJumpConsentAndMinimumNecessary = (
  callSummary: JumpCallSummary,
  importingUserId: string
): { consentVerified: boolean; minimumNecessary: boolean; errors: string[] } => {
  const errors: string[] = [];
  let consentVerified = true;
  let minimumNecessary = true;

  // Check consent freshness (365-day TTL)
  const consentCutoff = new Date();
  consentCutoff.setDate(consentCutoff.getDate() - 365);
  
  // Verify attendee consent
  for (const attendee of callSummary.attendees) {
    const hasValidConsent = checkJumpAttendeeConsent(attendee, consentCutoff);
    if (!hasValidConsent) {
      consentVerified = false;
      errors.push(`Attendee ${attendee} lacks valid consent for call summary import`);
    }
  }

  // Check minimum necessary compliance
  const sensitiveDataCheck = checkJumpSensitiveData(callSummary);
  if (sensitiveDataCheck.hasExcessiveDetail || sensitiveDataCheck.hasPersonalInfo) {
    minimumNecessary = false;
    errors.push('Jump summary contains excessive detail beyond minimum necessary');
  }

  return { consentVerified, minimumNecessary, errors };
};

/**
 * Create Vault package for Jump call summary
 */
export const createJumpVaultPackage = (
  callSummary: JumpCallSummary,
  parsedData: JumpParsedMeeting
): { files: { name: string; content: string; type: string }[] } => {
  const files = [];

  // Sanitized call summary (minimum necessary only)
  files.push({
    name: `jump_summary_${callSummary.id}_sanitized.json`,
    content: JSON.stringify({
      id: callSummary.id,
      title: callSummary.call_title,
      date: callSummary.call_date,
      attendees: callSummary.attendees,
      duration: callSummary.call_duration_minutes,
      call_type: callSummary.call_type,
      // Exclude raw summary text - use parsed data only
      summary_hash: generateJumpInputsHash(callSummary),
      key_topics_count: callSummary.key_topics?.length || 0,
      decisions_count: callSummary.decisions_made?.length || 0
    }),
    type: 'application/json'
  });

  // Meeting summary PDF
  const summaryPdf = generateJumpSummaryPDF(callSummary, parsedData);
  files.push({
    name: `jump_meeting_summary_${callSummary.id}.pdf`,
    content: summaryPdf,
    type: 'application/pdf'
  });

  return { files };
};

// Helper functions for Jump processing
const identifyJumpRiskFlags = (callSummary: JumpCallSummary): string[] => {
  const flags: string[] = [];
  
  // Check summary text for risk indicators
  const riskKeywords = [
    'compliance issue', 'regulatory concern', 'audit finding',
    'violation', 'investigation', 'lawsuit', 'SEC', 'FINRA'
  ];
  
  const summaryLower = callSummary.summary_text.toLowerCase();
  riskKeywords.forEach(keyword => {
    if (summaryLower.includes(keyword.toLowerCase())) {
      flags.push(`Risk indicator: ${keyword}`);
    }
  });
  
  // Check for missing disclosures in investment-related calls
  if (callSummary.call_type === 'investment_review' || 
      callSummary.call_type === 'portfolio_discussion') {
    if (!summaryLower.includes('risk') && !summaryLower.includes('disclosure')) {
      flags.push('Investment discussion lacks risk disclosure references');
    }
  }
  
  // Check decisions for high-risk activities
  if (callSummary.decisions_made) {
    callSummary.decisions_made.forEach(decision => {
      const decisionLower = decision.toLowerCase();
      if (decisionLower.includes('leverage') || 
          decisionLower.includes('margin') ||
          decisionLower.includes('alternative investment')) {
        flags.push(`High-risk decision identified: ${decision.substring(0, 50)}...`);
      }
    });
  }
  
  return flags;
};

const extractJumpComplianceNotes = (callSummary: JumpCallSummary): string[] => {
  const notes: string[] = [];
  
  // Extract compliance-related content from summary
  const compliancePatterns = [
    /risk disclosure\s+(.{20,100})/gi,
    /suitability\s+(.{20,100})/gi,
    /fiduciary\s+(.{20,100})/gi,
    /compliance\s+(.{20,100})/gi
  ];
  
  compliancePatterns.forEach(pattern => {
    const matches = callSummary.summary_text.match(pattern);
    if (matches) {
      notes.push(...matches.slice(0, 2));
    }
  });
  
  // Check key topics for compliance items
  if (callSummary.key_topics) {
    callSummary.key_topics.forEach(topic => {
      const topicLower = topic.toLowerCase();
      if (topicLower.includes('compliance') || 
          topicLower.includes('regulation') ||
          topicLower.includes('disclosure')) {
        notes.push(`Compliance topic: ${topic}`);
      }
    });
  }
  
  return notes;
};

const checkJumpAttendeeConsent = (attendee: string, cutoffDate: Date): boolean => {
  // Integration with consent management system
  // For demo: basic validation
  return attendee.includes('@') && attendee.length > 5;
};

const checkJumpSensitiveData = (callSummary: JumpCallSummary): { 
  hasExcessiveDetail: boolean; 
  hasPersonalInfo: boolean;
} => {
  const summary = callSummary.summary_text;
  
  // Check for excessive personal details
  const personalIndicators = [
    /social security/i,
    /account number/i,
    /date of birth/i,
    /personal financial/i
  ];
  
  const hasPersonalInfo = personalIndicators.some(pattern => pattern.test(summary));
  
  // Check for excessive detail (summary too long or too detailed)
  const hasExcessiveDetail = summary.length > 2000 || 
    (callSummary.key_topics && callSummary.key_topics.length > 10);
  
  return { hasExcessiveDetail, hasPersonalInfo };
};

const generateJumpSummaryPDF = (
  callSummary: JumpCallSummary, 
  parsedData: JumpParsedMeeting
): string => {
  const pdfContent = {
    title: `Jump Call Summary: ${callSummary.call_title}`,
    date: callSummary.call_date,
    attendees: parsedData.participants,
    call_type: callSummary.call_type,
    duration: `${parsedData.duration} minutes`,
    summary: parsedData.summary,
    key_points: parsedData.keyPoints,
    action_items: parsedData.actionItems,
    risk_flags: parsedData.riskFlags,
    compliance_notes: parsedData.complianceNotes,
    follow_up_required: parsedData.followUpRequired
  };
  
  // Base64 encoded PDF content (in real implementation, use PDF library)
  return btoa(JSON.stringify(pdfContent));
};