// Insurance-specific fixtures for demo and testing
import { recordReceipt } from '@/features/receipts/record';
import { recordConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import { hash } from '@/lib/canonical';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { MeetingModel } from '@/features/pro/meetings/MeetingModel';
import { CampaignModel } from '@/features/pro/campaigns/CampaignModel';

export async function seedInsuranceLead() {
  const lead = LeadModel.create({
    name: 'Patricia Wilson',
    email: 'patricia.wilson@email.com',
    phone: '555-0789',
    persona: 'insurance',
    tags: ['life-insurance', 'retirement-planning'],
    utm: { source: 'seminar', medium: 'event', campaign: 'retirement-readiness-2025' },
    status: 'needs_analysis'
  });

  // Record consent with insurance licensing notice
  const consent = recordConsentRDS({
    persona: 'insurance',
    scope: { contact: true, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 90,
    purpose: 'insurance_needs_analysis',
    result: 'approve'
  });

  console.log('✅ Insurance lead seeded:', lead.id, 'with consent:', consent.inputs_hash);
  return { lead, consent };
}

export async function seedInsuranceMeetingImport() {
  const meetingContent = `
Meeting: Life Insurance Needs Analysis
Date: December 15, 2024
Participants: Agent Lisa Rodriguez, Client Patricia Wilson

Summary:
- Reviewed current coverage and retirement goals
- Analyzed life insurance needs for income replacement
- Discussed annuity options for guaranteed retirement income
- Explored 1035 exchange opportunities

Action Items:
- Prepare life insurance illustration
- Review annuity product options
- Schedule suitability review meeting

Risk Factors:
- Current coverage insufficient for income replacement needs
- Retirement income gap identified
`;

  const inputs_hash = await hash({ transcript: meetingContent, source: 'manual' });
  
  const meeting = MeetingModel.create({
    persona: 'insurance',
    source: 'manual',
    summary: 'Life insurance needs analysis with retirement income planning discussion',
    bullets: [
      'Current coverage and goals reviewed',
      'Life insurance needs analysis completed',
      'Annuity options for guaranteed income discussed',
      '1035 exchange opportunities explored'
    ],
    actions: [
      'Prepare detailed life insurance illustration',
      'Review specific annuity product options',
      'Schedule comprehensive suitability review'
    ],
    risks: [
      'Insufficient current life insurance coverage',
      'Retirement income gap requires addressing'
    ],
    participants: ['Agent Lisa Rodriguez', 'Patricia Wilson'],
    inputs_hash
  });

  // Record decision with suitability check
  const decision = recordDecisionRDS({
    action: 'meeting_import',
    persona: 'insurance',
    inputs_hash,
    reasons: ['meeting_summary', 'suitability_review', 'needs_analysis'],
    result: 'approve',
    metadata: { suitability_required: true }
  });

  console.log('✅ Insurance meeting imported:', meeting.id, 'with suitability tracking');
  return { meeting, decision };
}

export async function seedInsuranceCampaign() {
  const campaign = CampaignModel.create({
    persona: 'insurance',
    name: 'Life Needs Analysis - Patricia Wilson',
    template_id: 'insurance_life_needs_3touch',
    recipients: ['patricia.wilson@email.com'],
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'scheduled'
  });

  // Record communication decision with state licensing check
  const commDecision = recordDecisionRDS({
    action: 'communication_send',
    persona: 'insurance',
    inputs_hash: await hash({ template_id: campaign.template_id, recipients: campaign.recipients }),
    reasons: ['template_approved', 'consent_valid', 'state_licensed', 'compliance_reviewed'],
    result: 'approve',
    metadata: {
      channel: 'email',
      template_id: campaign.template_id,
      recipient_count: campaign.recipients.length,
      state_licensing_verified: true
    }
  });

  console.log('✅ Insurance campaign created:', campaign.id);
  return { campaign, commDecision };
}

export async function loadInsuranceFixtures() {
  const { lead, consent } = await seedInsuranceLead();
  const { meeting, decision } = await seedInsuranceMeetingImport();
  const { campaign, commDecision } = await seedInsuranceCampaign();

  return {
    lead,
    meeting,
    campaign,
    receipts: [consent, decision, commDecision]
  };
}