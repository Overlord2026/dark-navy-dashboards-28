/**
 * Due Diligence Service
 * Handles advisor background checks and compliance scoring
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface DiligenceCase {
  id: string;
  advisor_name_hash: string; // Content-free identifier
  crd_number?: string;
  iard_number?: string;
  status: 'open' | 'in_progress' | 'completed' | 'archived';
  risk_score: number; // 0-100
  created_at: string;
  completed_at?: string;
  created_by: string;
}

export interface RubricCriteria {
  id: string;
  category: 'regulatory' | 'financial' | 'operational' | 'reputation';
  criterion: string;
  weight: number; // 1-10
  pass_threshold: number;
  scoring_guide: string;
  active: boolean;
}

export interface CaseScore {
  case_id: string;
  criteria_id: string;
  score: number;
  evidence_hash: string; // Content-free reference to vault evidence
  notes_hash: string;   // Content-free reference to analyst notes
  scored_by: string;
  scored_at: string;
}

export interface BackgroundCheckResult {
  source: 'brokercheck' | 'iapd' | 'finra' | 'sec';
  data_hash: string; // Content-free identifier
  findings_count: number;
  risk_flags: string[];
  last_updated: string;
}

const DEFAULT_RUBRIC: RubricCriteria[] = [
  {
    id: 'reg_violations',
    category: 'regulatory',
    criterion: 'Regulatory Violations History',
    weight: 10,
    pass_threshold: 8,
    scoring_guide: '10=No violations, 8=Minor violations >3yr old, 5=Recent minor, 1=Major violations',
    active: true
  },
  {
    id: 'financial_status',
    category: 'financial',
    criterion: 'Financial Standing',
    weight: 8,
    pass_threshold: 7,
    scoring_guide: '10=Excellent financial standing, 5=Some concerns, 1=Significant issues',
    active: true
  },
  {
    id: 'client_complaints',
    category: 'operational',
    criterion: 'Client Complaint History',
    weight: 9,
    pass_threshold: 7,
    scoring_guide: '10=No complaints, 7=Resolved minor complaints, 3=Pattern of complaints',
    active: true
  },
  {
    id: 'professional_conduct',
    category: 'reputation',
    criterion: 'Professional Conduct',
    weight: 7,
    pass_threshold: 6,
    scoring_guide: '10=Exemplary conduct, 6=Minor issues, 1=Serious conduct problems',
    active: true
  },
  {
    id: 'licensing_status',
    category: 'regulatory',
    criterion: 'Current Licensing Status',
    weight: 10,
    pass_threshold: 9,
    scoring_guide: '10=All licenses current, 5=Some expired/suspended, 1=Major licensing issues',
    active: true
  }
];

/**
 * Opens a new due diligence case
 */
export async function openCase(params: {
  advisor_name: string;
  crd?: string;
  iard?: string;
  created_by: string;
}): Promise<string> {
  // Create content-free hash for advisor identity
  const advisorHash = await inputs_hash({
    crd: params.crd || '',
    iard: params.iard || '',
    name_length: params.advisor_name.length
  });

  const { data, error } = await supabase
    .from('diligence_cases' as any)
    .insert({
      advisor_name: params.advisor_name,
      crd: params.crd || '',
      iard: params.iard || '',
      status: 'open',
      score: 0,
      created_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record case opening
  await recordReceipt({
    type: 'DueDiligence-RDS',
    ts: new Date().toISOString(),
    case_id: (data as any).id,
    advisor_hash: advisorHash,
    action: 'case_opened',
    policy_version: 'v1.0'
  });

  return (data as any).id;
}

/**
 * Fetches BrokerCheck data (placeholder implementation)
 */
export async function fetchBrokerCheck(crdNumber: string): Promise<BackgroundCheckResult> {
  // Placeholder - would integrate with actual BrokerCheck API
  const mockFindings = Math.floor(Math.random() * 5);
  const riskFlags = mockFindings > 2 ? ['customer_complaints', 'regulatory_events'] : [];

  const result: BackgroundCheckResult = {
    source: 'brokercheck',
    data_hash: await inputs_hash({
      crd: crdNumber,
      findings_count: mockFindings,
      timestamp: new Date().toISOString()
    }),
    findings_count: mockFindings,
    risk_flags: riskFlags,
    last_updated: new Date().toISOString()
  };

  return result;
}

/**
 * Fetches IAPD data (placeholder implementation)
 */
export async function fetchIAPD(iardNumber: string): Promise<BackgroundCheckResult> {
  // Placeholder - would integrate with actual IAPD API
  const mockFindings = Math.floor(Math.random() * 3);
  const riskFlags = mockFindings > 1 ? ['disclosure_events'] : [];

  const result: BackgroundCheckResult = {
    source: 'iapd',
    data_hash: await inputs_hash({
      iard: iardNumber,
      findings_count: mockFindings,
      timestamp: new Date().toISOString()
    }),
    findings_count: mockFindings,
    risk_flags: riskFlags,
    last_updated: new Date().toISOString()
  };

  return result;
}

/**
 * Scores a case against the rubric
 */
export async function scoreCase(
  caseId: string,
  scores: Array<{ criteria_id: string; score: number; evidence_vault_id?: string; notes?: string }>,
  scoredBy: string
): Promise<{ total_score: number; weighted_score: number; risk_level: 'low' | 'medium' | 'high' }> {
  const rubric = DEFAULT_RUBRIC;
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Store individual scores
  const caseScores: CaseScore[] = [];
  
  for (const score of scores) {
    const criteria = rubric.find(r => r.id === score.criteria_id);
    if (!criteria) continue;

    const evidenceHash = score.evidence_vault_id 
      ? await inputs_hash({ vault_id: score.evidence_vault_id })
      : '';
    
    const notesHash = score.notes 
      ? await inputs_hash({ notes_length: score.notes.length, timestamp: new Date().toISOString() })
      : '';

    const caseScore: CaseScore = {
      case_id: caseId,
      criteria_id: score.criteria_id,
      score: score.score,
      evidence_hash: evidenceHash,
      notes_hash: notesHash,
      scored_by: scoredBy,
      scored_at: new Date().toISOString()
    };

    caseScores.push(caseScore);
    totalWeightedScore += score.score * criteria.weight;
    totalWeight += criteria.weight;
  }

  // Insert scores
  const { error: scoresError } = await supabase
    .from('diligence_case_scores' as any)
    .insert(caseScores);

  if (scoresError) throw scoresError;

  // Calculate final scores
  const weightedScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const riskLevel: 'low' | 'medium' | 'high' = 
    weightedScore >= 8 ? 'low' : 
    weightedScore >= 6 ? 'medium' : 'high';

  // Update case
  const { error: updateError } = await supabase
    .from('diligence_cases' as any)
    .update({
      score: weightedScore,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', caseId);

  if (updateError) throw updateError;

  // Record scoring completion
  await recordReceipt({
    type: 'DueDiligence-RDS',
    ts: new Date().toISOString(),
    case_id: caseId,
    action: 'case_scored',
    risk_score: weightedScore,
    risk_level: riskLevel,
    policy_version: 'v1.0'
  });

  return {
    total_score: weightedScore,
    weighted_score: weightedScore,
    risk_level: riskLevel
  };
}

/**
 * Publishes rubric as rules export
 */
export async function publishRubric(rubricId: string, publishedBy: string): Promise<void> {
  const rubricHash = await inputs_hash({
    rubric_id: rubricId,
    criteria_count: DEFAULT_RUBRIC.length,
    total_weight: DEFAULT_RUBRIC.reduce((sum, r) => sum + r.weight, 0),
    timestamp: new Date().toISOString()
  });

  await recordReceipt({
    type: 'Rules-Export-RDS',
    ts: new Date().toISOString(),
    rubric_id: rubricId,
    rules_hash: rubricHash,
    published_by: publishedBy,
    policy_version: 'v1.0'
  });
}

/**
 * Gets case summary
 */
export async function getCaseSummary(caseId: string): Promise<{
  case: DiligenceCase;
  scores: CaseScore[];
  background_checks: BackgroundCheckResult[];
  risk_assessment: string;
}> {
  const { data: caseData, error: caseError } = await supabase
    .from('diligence_cases' as any)
    .select('*')
    .eq('id', caseId)
    .single();

  if (caseError) throw caseError;

  const { data: scores, error: scoresError } = await supabase
    .from('diligence_case_scores' as any)
    .select('*')
    .eq('case_id', caseId);

  if (scoresError) throw scoresError;

  // Mock background checks - would fetch from actual storage
  const backgroundChecks: BackgroundCheckResult[] = [];

  const riskAssessment = 
    (caseData as any).score >= 8 ? 'Low Risk - Meets all compliance standards' :
    (caseData as any).score >= 6 ? 'Medium Risk - Some concerns require monitoring' :
    'High Risk - Significant issues require escalation';

  return {
    case: {
      ...(caseData as any),
      advisor_name_hash: '', 
      risk_score: (caseData as any).score || 0,
      created_by: 'system'
    } as DiligenceCase,
    scores: (scores || []) as unknown as CaseScore[],
    background_checks: backgroundChecks,
    risk_assessment: riskAssessment
  };
}

/**
 * Lists open cases for admin
 */
export async function listCases(status?: string): Promise<DiligenceCase[]> {
  let query = supabase
    .from('diligence_cases' as any)
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((item: any) => ({
    ...item,
    advisor_name_hash: '', 
    risk_score: item.score || 0,
    created_by: 'system'
  })) as DiligenceCase[];
}

/**
 * Gets rubric criteria
 */
export function getRubric(): RubricCriteria[] {
  return DEFAULT_RUBRIC.filter(r => r.active);
}