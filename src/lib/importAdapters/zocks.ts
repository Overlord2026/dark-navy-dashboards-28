/**
 * Zocks Platform Import Adapter
 * Normalizes Zocks meeting transcripts to Decision-RDS + Vault-RDS format
 */

export interface ZocksTranscript {
  id: string;
  title: string;
  date: string;
  participants: string[];
  transcript: string;
  duration: number;
  meeting_type?: string;
  metadata?: Record<string, any>;
}

export interface ZocksParsedMeeting {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  riskFlags: string[];
  participants: string[];
  duration: number;
  complianceNotes: string[];
  followUpRequired: boolean;
}

export interface ImportedMeetingData {
  source: 'zocks' | 'jump';
  originalId: string;
  title: string;
  date: string;
  parsedData: ZocksParsedMeeting;
  inputsHash: string;
  consentVerified: boolean;
  minimumNecessary: boolean;
}

/**
 * Parse Zocks transcript data and extract key information
 */
export const parseZocksTranscript = (transcript: ZocksTranscript): ZocksParsedMeeting => {
  // Extract summary from transcript using AI or rule-based parsing
  const summary = extractSummary(transcript.transcript);
  
  // Extract key discussion points
  const keyPoints = extractKeyPoints(transcript.transcript);
  
  // Extract action items and commitments
  const actionItems = extractActionItems(transcript.transcript);
  
  // Identify potential compliance risks
  const riskFlags = identifyRiskFlags(transcript.transcript, transcript.meeting_type);
  
  // Extract compliance-relevant notes
  const complianceNotes = extractComplianceNotes(transcript.transcript);
  
  return {
    summary,
    keyPoints,
    actionItems,
    riskFlags,
    participants: transcript.participants,
    duration: transcript.duration,
    complianceNotes,
    followUpRequired: actionItems.length > 0 || riskFlags.length > 0
  };
};

/**
 * Generate inputs hash for Decision-RDS receipt
 */
export const generateInputsHash = (transcript: ZocksTranscript): string => {
  const hashInput = {
    id: transcript.id,
    title: transcript.title,
    date: transcript.date,
    participants: transcript.participants,
    transcript_length: transcript.transcript.length,
    duration: transcript.duration
  };
  
  // Use browser-safe hashing instead of Node.js crypto
  return btoa(JSON.stringify(hashInput)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

/**
 * Verify consent freshness and minimum necessary principles
 */
export const verifyConsentAndMinimumNecessary = (
  transcript: ZocksTranscript,
  importingUserId: string
): { consentVerified: boolean; minimumNecessary: boolean; errors: string[] } => {
  const errors: string[] = [];
  let consentVerified = true;
  let minimumNecessary = true;

  // Check if all participants have valid consent (365-day freshness for advisor context)
  const consentCutoff = new Date();
  consentCutoff.setDate(consentCutoff.getDate() - 365);
  
  // Verify each participant has consented to meeting recording/analysis
  for (const participant of transcript.participants) {
    // This would check against a consent database
    const hasValidConsent = checkParticipantConsent(participant, consentCutoff);
    if (!hasValidConsent) {
      consentVerified = false;
      errors.push(`Participant ${participant} lacks valid consent for meeting analysis`);
    }
  }

  // Verify minimum necessary principle - only extract business-relevant content
  const containsSensitiveData = checkForSensitiveData(transcript.transcript);
  if (containsSensitiveData.hasPII || containsSensitiveData.hasFinancialDetails) {
    minimumNecessary = false;
    errors.push('Transcript contains sensitive data that exceeds minimum necessary requirements');
  }

  return { consentVerified, minimumNecessary, errors };
};

/**
 * Create Vault package with transcript and summary PDF
 */
export const createVaultPackage = (
  transcript: ZocksTranscript, 
  parsedData: ZocksParsedMeeting
): { files: { name: string; content: string; type: string }[] } => {
  const files = [];

  // Original transcript (sanitized - no raw text in receipts)
  files.push({
    name: `transcript_${transcript.id}_sanitized.json`,
    content: JSON.stringify({
      id: transcript.id,
      title: transcript.title,
      date: transcript.date,
      participants: transcript.participants,
      duration: transcript.duration,
      meeting_type: transcript.meeting_type,
      // Note: Raw transcript excluded for minimum necessary compliance
      transcript_hash: generateInputsHash(transcript)
    }),
    type: 'application/json'
  });

  // Meeting summary PDF content
  const summaryPdf = generateSummaryPDF(transcript, parsedData);
  files.push({
    name: `meeting_summary_${transcript.id}.pdf`,
    content: summaryPdf,
    type: 'application/pdf'
  });

  return { files };
};

// Helper functions (simplified implementations)
const extractSummary = (transcript: string): string => {
  // AI-powered summary extraction or rule-based parsing
  const sentences = transcript.split('.').filter(s => s.trim().length > 0);
  return sentences.slice(0, 3).join('. ') + '.';
};

const extractKeyPoints = (transcript: string): string[] => {
  // Extract key discussion points
  const keywordPatterns = [
    /discussed?\s+(.{20,100})/gi,
    /agreed?\s+(.{20,100})/gi,
    /decided?\s+(.{20,100})/gi
  ];
  
  const points: string[] = [];
  keywordPatterns.forEach(pattern => {
    const matches = transcript.match(pattern);
    if (matches) {
      points.push(...matches.slice(0, 3));
    }
  });
  
  return points.slice(0, 5);
};

const extractActionItems = (transcript: string): string[] => {
  // Extract action items and commitments
  const actionPatterns = [
    /will\s+(.{10,80})/gi,
    /todo:\s*(.{10,80})/gi,
    /action\s+item:\s*(.{10,80})/gi,
    /follow\s+up\s+(.{10,80})/gi
  ];
  
  const actions: string[] = [];
  actionPatterns.forEach(pattern => {
    const matches = transcript.match(pattern);
    if (matches) {
      actions.push(...matches.slice(0, 2));
    }
  });
  
  return actions.slice(0, 5);
};

const identifyRiskFlags = (transcript: string, meetingType?: string): string[] => {
  const riskKeywords = [
    'high risk', 'regulatory', 'compliance', 'audit', 'violation',
    'SEC', 'FINRA', 'litigation', 'complaint', 'investigation'
  ];
  
  const flags: string[] = [];
  riskKeywords.forEach(keyword => {
    if (transcript.toLowerCase().includes(keyword.toLowerCase())) {
      flags.push(`Risk keyword detected: ${keyword}`);
    }
  });
  
  // Meeting type specific risks
  if (meetingType === 'investment_advisory' && !transcript.includes('disclosure')) {
    flags.push('Investment advisory meeting lacks disclosure references');
  }
  
  return flags;
};

const extractComplianceNotes = (transcript: string): string[] => {
  const compliancePatterns = [
    /disclosure\s+(.{20,100})/gi,
    /risk\s+(.{20,100})/gi,
    /suitability\s+(.{20,100})/gi
  ];
  
  const notes: string[] = [];
  compliancePatterns.forEach(pattern => {
    const matches = transcript.match(pattern);
    if (matches) {
      notes.push(...matches.slice(0, 2));
    }
  });
  
  return notes;
};

const checkParticipantConsent = (participant: string, cutoffDate: Date): boolean => {
  // This would integrate with actual consent management system
  // For demo purposes, assume consent exists for known participants
  return participant.includes('@') || participant.length > 5;
};

const checkForSensitiveData = (transcript: string): { hasPII: boolean; hasFinancialDetails: boolean } => {
  const ssnPattern = /\d{3}-?\d{2}-?\d{4}/;
  const accountPattern = /account\s+\d{8,}/i;
  const ssnMatch = ssnPattern.test(transcript);
  const accountMatch = accountPattern.test(transcript);
  
  return {
    hasPII: ssnMatch,
    hasFinancialDetails: accountMatch
  };
};

const generateSummaryPDF = (transcript: ZocksTranscript, parsedData: ZocksParsedMeeting): string => {
  // Generate PDF content (base64 encoded)
  const pdfContent = {
    title: `Meeting Summary: ${transcript.title}`,
    date: transcript.date,
    participants: parsedData.participants,
    summary: parsedData.summary,
    keyPoints: parsedData.keyPoints,
    actionItems: parsedData.actionItems,
    riskFlags: parsedData.riskFlags,
    complianceNotes: parsedData.complianceNotes
  };
  
  // In real implementation, use PDF generation library
  return btoa(JSON.stringify(pdfContent));
};