// Realtor-specific fixtures for demo and testing
import { recordReceipt } from '@/features/receipts/record';
import { recordConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import * as Canonical from '@/lib/canonical';
import { LeadModel } from '@/features/pro/lead/LeadModel';
import { MeetingModel } from '@/features/pro/meetings/MeetingModel';
import { CampaignModel } from '@/features/pro/campaigns/CampaignModel';

export async function seedRealtorLead() {
  const lead = LeadModel.create({
    name: 'Amanda Foster',
    email: 'amanda.foster@email.com',
    phone: '555-0654',
    persona: 'realtor',
    tags: ['first-time-buyer', 'suburban'],
    utm_source: 'zillow',
    utm_medium: 'listing',
    utm_campaign: 'first-time-buyers-2025',
    status: 'qualified',
    consent_given: true
  });

  // Record consent for real estate services
  const consent = recordConsentRDS({
    persona: 'realtor',
    scope: { contact: true, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 90,
    purpose: 'real_estate_services',
    result: 'approve'
  });

  console.log('✅ Realtor lead seeded:', lead.id, 'with consent:', consent.inputs_hash);
  return { lead, consent };
}

export async function seedRealtorMeetingImport() {
  const meetingContent = `
Meeting: First-Time Buyer Consultation
Date: December 15, 2024
Participants: Realtor Mark Johnson, Clients Amanda & Tom Foster

Summary:
- Discussed home buying timeline and budget
- Reviewed pre-approval documentation
- Explored neighborhood preferences and priorities
- Scheduled property showings for next weekend

Action Items:
- Send neighborhood market analysis report
- Schedule showings for 3 properties
- Connect with preferred mortgage lender
- Prepare showing checklist

Risk Factors:
- Budget may be tight for desired neighborhoods
- Limited inventory in preferred price range
`;

  const inputs_hash = await Canonical.hash({ transcript: meetingContent, source: 'manual' });
  
  const meeting = MeetingModel.create({
    persona: 'realtor',
    title: 'First-Time Buyer Consultation',
    source: 'plain',
    summary: 'First-time buyer consultation with timeline and neighborhood planning',
    bullets: [
      'Home buying timeline and budget reviewed',
      'Pre-approval documentation validated',
      'Neighborhood preferences discussed',
      'Property showing strategy developed'
    ],
    action_items: [
      'Prepare neighborhood market analysis',
      'Schedule weekend property showings',
      'Facilitate lender connection',
      'Create personalized showing checklist'
    ],
    risks: [
      'Budget constraints for preferred areas',
      'Limited inventory challenge'
    ],
    participants: ['Realtor Mark Johnson', 'Amanda Foster', 'Tom Foster'],
    inputs_hash,
    vault_grants: [],
    meeting_date: '2024-12-15'
  });

  // Record decision
  const decision = recordDecisionRDS({
    action: 'meeting_import',
    persona: 'realtor',
    inputs_hash,
    reasons: ['meeting_summary', 'action_items', 'showing_scheduled'],
    result: 'approve'
  });

  console.log('✅ Realtor meeting imported:', meeting.id);
  return { meeting, decision };
}

export async function seedRealtorCampaign() {
  const campaign = CampaignModel.create({
    persona: 'realtor',
    name: 'Neighborhood Report - Amanda Foster',
    template_id: 'realtor_neighborhood_report_3touch',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    target_audience: ['amanda.foster@email.com'],
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
    persona: 'realtor',
    inputs_hash: await Canonical.hash({ template_id: campaign.template_id, recipients: ['amanda.foster@email.com'] }),
    reasons: ['template_approved', 'consent_valid', 'market_update'],
    result: 'approve',
    metadata: {
      channel: 'email',
      template_id: campaign.template_id,
      recipient_count: 1
    }
  });

  console.log('✅ Realtor campaign created:', campaign.id);
  return { campaign, commDecision };
}

export async function loadRealtorFixtures() {
  const { lead, consent } = await seedRealtorLead();
  const { meeting, decision } = await seedRealtorMeetingImport();
  const { campaign, commDecision } = await seedRealtorCampaign();

  return {
    lead,
    meeting,
    campaign,
    receipts: [consent, decision, commDecision]
  };
}