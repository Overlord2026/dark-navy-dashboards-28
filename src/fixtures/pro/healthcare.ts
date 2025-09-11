// Healthcare-specific fixtures for demo and testing
import { recordReceipt } from '@/features/receipts/record';
import { recordConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import * as Canonical from '@/lib/canonical';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { MeetingModel } from '@/features/pro/meetings/MeetingModel';
import { CampaignModel } from '@/features/pro/campaigns/CampaignModel';

export async function seedHealthcareLead() {
  const lead = LeadModel.create({
    name: 'David Chen',
    email: 'david.chen@email.com',
    phone: '555-0321',
    persona: 'healthcare',
    tags: ['longevity', 'wellness-coaching'],
    utm_source: 'webinar',
    utm_medium: 'education',
    utm_campaign: 'longevity-optimization',
    status: 'qualified',
    consent_given: true
  });

  // Record consent with HIPAA scope
  const consent = recordConsentRDS({
    persona: 'healthcare',
    scope: { contact: true, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 30, // Shorter for healthcare
    purpose: 'wellness_services_coordination',
    result: 'approve'
  });

  console.log('✅ Healthcare lead seeded:', lead.id, 'with HIPAA consent:', consent.inputs_hash);
  return { lead, consent };
}

export async function seedHealthcareMeetingImport() {
  // Healthcare uses hash-only storage for HIPAA protection
  const healthContent = `
Meeting: Longevity Wellness Consultation
Date: December 15, 2024
Participants: Dr. Sarah Kim, Client David Chen

[HIPAA PROTECTED - HASH ONLY STORAGE]
Summary: Wellness optimization consultation with lifestyle review
Action Items: Develop personalized wellness plan
Risk Factors: Identified areas for health optimization
`;

  const inputs_hash = await Canonical.hash({ content: healthContent, source: 'manual', hipaa_protected: true });
  
  const meeting = MeetingModel.create({
    persona: 'healthcare',
    title: 'Longevity Wellness Consultation',
    source: 'plain',
    summary: 'Longevity wellness consultation - HIPAA protected content stored securely',
    bullets: [
      'Current wellness status reviewed',
      'Longevity optimization goals discussed',
      'Lifestyle factors assessment completed',
      'Personalized recommendations developed'
    ],
    action_items: [
      'Develop detailed wellness optimization plan',
      'Schedule follow-up progress review',
      'Coordinate with healthcare providers as needed'
    ],
    risks: [
      'Identified lifestyle factors requiring attention',
      'Coordination with primary care needed'
    ],
    participants: ['Dr. Sarah Kim', 'David Chen'],
    inputs_hash,
    vault_grants: [],
    meeting_date: '2024-12-15'
    // hipaa_protected: true // Special flag for healthcare content
  });

  // Record decision with HIPAA minimum necessary principle
  const decision = recordDecisionRDS({
    action: 'meeting_import',
    persona: 'healthcare',
    inputs_hash,
    reasons: ['meeting_summary', 'hipaa_minimum_necessary', 'wellness_plan'],
    result: 'approve',
    metadata: { hipaa_protected: true, minimum_necessary: true }
  });

  console.log('✅ Healthcare meeting imported:', meeting.id, 'with HIPAA protection');
  return { meeting, decision };
}

export async function seedHealthcareCampaign() {
  const campaign = CampaignModel.create({
    persona: 'healthcare',
    name: 'Longevity Intro - David Chen',
    template_id: 'healthcare_longevity_intro_3touch',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    target_audience: ['david.chen@email.com'],
    metrics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  });

  // Record communication decision (education only for healthcare)
  const commDecision = recordDecisionRDS({
    action: 'communication_send',
    persona: 'healthcare',
    inputs_hash: await Canonical.hash({ template_id: campaign.template_id, recipients: ['david.chen@email.com'] }),
    reasons: ['education_only', 'consent_valid', 'hipaa_compliant'],
    result: 'approve',
    metadata: {
      channel: 'email',
      template_id: campaign.template_id,
      recipient_count: 1,
      education_only: true
    }
  });

  console.log('✅ Healthcare campaign created:', campaign.id, '(education only)');
  return { campaign, commDecision };
}

export async function loadHealthcareFixtures() {
  const { lead, consent } = await seedHealthcareLead();
  const { meeting, decision } = await seedHealthcareMeetingImport();
  const { campaign, commDecision } = await seedHealthcareCampaign();

  return {
    lead,
    meeting,
    campaign,
    receipts: [consent, decision, commDecision]
  };
}