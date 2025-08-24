// Attorney-specific fixtures for demo and testing
import { recordReceipt } from '@/features/receipts/record';
import { recordConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import { hash } from '@/lib/canonical';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { MeetingModel } from '@/features/pro/meetings/MeetingModel';
import { CampaignModel } from '@/features/pro/campaigns/CampaignModel';

export async function seedAttorneyLead() {
  const lead = LeadModel.create({
    name: 'Robert Thompson',
    email: 'robert.thompson@email.com',
    phone: '555-0456',
    persona: 'attorney',
    tags: ['estate-planning', 'trust'],
    utm: { source: 'referral', medium: 'attorney-network', campaign: 'estate-planning' },
    status: 'consultation_scheduled'
  });

  // Record consent with attorney-client privilege notice
  const consent = recordConsentRDS({
    persona: 'attorney',
    scope: { contact: true, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 90,
    purpose: 'legal_services_consultation',
    result: 'approve'
  });

  console.log('✅ Attorney lead seeded:', lead.id, 'with consent:', consent.inputs_hash);
  return { lead, consent };
}

export async function seedAttorneyMeetingImport() {
  // Attorney meetings use hash-only storage for privilege protection
  const privilegedContent = `
Meeting: Estate Planning Consultation
Date: December 15, 2024
Participants: Attorney Michael Davis, Client Robert Thompson

[PRIVILEGED CONTENT - HASH ONLY STORAGE]
Summary: Estate planning discussion with trust structure review
Action Items: Draft will and trust documents
Risk Factors: Complex family situation requiring careful beneficiary planning
`;

  const inputs_hash = await hash({ content: privilegedContent, source: 'manual', privilege: true });
  
  const meeting = MeetingModel.create({
    persona: 'attorney',
    source: 'manual',
    summary: 'Estate planning consultation - privileged content stored securely',
    bullets: [
      'Estate planning objectives reviewed',
      'Trust structure options discussed',
      'Beneficiary planning considerations',
      'Tax implications addressed'
    ],
    actions: [
      'Draft initial will document',
      'Prepare trust structure proposal',
      'Schedule follow-up review meeting'
    ],
    risks: [
      'Complex family dynamics requiring careful planning',
      'Tax implications need specialist review'
    ],
    participants: ['Attorney Michael Davis', 'Robert Thompson'],
    inputs_hash,
    privileged: true // Special flag for attorney content
  });

  // Record decision with privilege protection
  const decision = recordDecisionRDS({
    action: 'meeting_import',
    persona: 'attorney',
    inputs_hash,
    reasons: ['meeting_summary', 'privileged_content', 'action_items'],
    result: 'approve',
    metadata: { privilege_protected: true }
  });

  console.log('✅ Attorney meeting imported:', meeting.id, 'with privileged protection');
  return { meeting, decision };
}

export async function seedAttorneyCampaign() {
  const campaign = CampaignModel.create({
    persona: 'attorney',
    name: 'Will/Trust Review - Robert Thompson',
    template_id: 'attorney_will_trust_review_3touch',
    recipients: ['robert.thompson@email.com'],
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'scheduled'
  });

  // Record communication decision
  const commDecision = recordDecisionRDS({
    action: 'communication_send',
    persona: 'attorney',
    inputs_hash: await hash({ template_id: campaign.template_id, recipients: campaign.recipients }),
    reasons: ['template_approved', 'consent_valid', 'no_solicitation_rules_checked'],
    result: 'approve',
    metadata: {
      channel: 'email',
      template_id: campaign.template_id,
      recipient_count: campaign.recipients.length
    }
  });

  console.log('✅ Attorney campaign created:', campaign.id);
  return { campaign, commDecision };
}

export async function loadAttorneyFixtures() {
  const { lead, consent } = await seedAttorneyLead();
  const { meeting, decision } = await seedAttorneyMeetingImport();
  const { campaign, commDecision } = await seedAttorneyCampaign();

  return {
    lead,
    meeting,
    campaign,
    receipts: [consent, decision, commDecision]
  };
}