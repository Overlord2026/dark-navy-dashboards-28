// CPA-specific fixtures for demo and testing
import { recordReceipt } from '@/features/receipts/record';
import { recordConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import * as Canonical from '@/lib/canonical';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { MeetingModel } from '@/features/pro/meetings/MeetingModel';
import { CampaignModel } from '@/features/pro/campaigns/CampaignModel';

export async function seedCPALead() {
  const lead = LeadModel.create({
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@email.com',
    phone: '555-0123',
    persona: 'cpa',
    tags: ['tax-planning', 'small-business'],
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'tax-season-2025',
    status: 'qualified',
    consent_given: true
  });

  // Record consent
  const consent = recordConsentRDS({
    persona: 'cpa',
    scope: { contact: true, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 90,
    purpose: 'tax_services_outreach',
    result: 'approve'
  });

  console.log('✅ CPA lead seeded:', lead.id, 'with consent:', consent.inputs_hash);
  return { lead, consent };
}

export async function seedCPAMeetingImport() {
  const sampleTranscript = `
Meeting: Q4 Tax Planning Session
Date: December 15, 2024
Participants: CPA Sarah Chen, Client Jennifer Martinez

Summary:
- Reviewed 2024 income and deductions
- Discussed retirement contribution strategies
- Identified opportunities for tax-loss harvesting
- Client owns small business - consider S-Corp election

Action Items:
- Gather Q4 business expense receipts
- Review retirement account balances
- Schedule follow-up for January tax prep

Risk Factors:
- Missing documentation for business expenses
- Potential estimated tax underpayment for Q4
`;

  const inputs_hash = await Canonical.hash({ transcript: sampleTranscript, source: 'manual' });
  
  const meeting = MeetingModel.create({
    persona: 'cpa',
    title: 'Q4 Tax Planning Session',
    source: 'plain',
    summary: 'Q4 tax planning session with discussion of retirement strategies and business expense optimization',
    bullets: [
      'Reviewed 2024 income and deductions',
      'Discussed retirement contribution strategies', 
      'Identified tax-loss harvesting opportunities',
      'S-Corp election consideration for business'
    ],
    action_items: [
      'Gather Q4 business expense receipts',
      'Review retirement account balances',
      'Schedule January tax prep meeting'
    ],
    risks: [
      'Missing business expense documentation',
      'Potential Q4 estimated tax underpayment'
    ],
    participants: ['CPA Sarah Chen', 'Jennifer Martinez'],
    inputs_hash,
    vault_grants: [],
    meeting_date: '2024-12-15'
  });

  // Record decision
  const decision = recordDecisionRDS({
    action: 'meeting_import',
    persona: 'cpa',
    inputs_hash,
    reasons: ['meeting_summary', 'action_items', 'risk_flag'],
    result: 'approve'
  });

  console.log('✅ CPA meeting imported:', meeting.id, 'with decision:', decision.inputs_hash);
  return { meeting, decision };
}

export async function seedCPACampaign() {
  const campaign = CampaignModel.create({
    persona: 'cpa',
    name: 'Tax Season Warmup - Jennifer Martinez',
    template_id: 'cpa_tax_season_warmup_3touch',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    target_audience: ['jennifer.martinez@email.com'],
    metrics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  });

  // Record communication decision
  const commDecision = recordDecisionRDS({
    action: 'communication_send',
    persona: 'cpa',
    inputs_hash: await Canonical.hash({ template_id: campaign.template_id, recipients: ['jennifer.martinez@email.com'] }),
    reasons: ['template_approved', 'consent_valid'],
    result: 'approve',
    metadata: {
      channel: 'email',
      template_id: campaign.template_id,
      recipient_count: 1
    }
  });

  console.log('✅ CPA campaign created:', campaign.id, 'with comm decision:', commDecision.inputs_hash);
  return { campaign, commDecision };
}

export async function loadCPAFixtures() {
  const { lead, consent } = await seedCPALead();
  const { meeting, decision } = await seedCPAMeetingImport();
  const { campaign, commDecision } = await seedCPACampaign();

  return {
    lead,
    meeting,
    campaign,
    receipts: [consent, decision, commDecision]
  };
}