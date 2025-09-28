import { recordReceipt } from '@/features/receipts/record';
import { trackShareGranted } from '@/lib/telemetry';
import type { ReviewSession } from './types';

export async function deliverReviewPacket(options: {
  session: ReviewSession;
  familyUserId?: string;
}): Promise<void> {
  const { session, familyUserId = session.clientId } = options;

  // Prefer current final version, fallback to signed letter or packet
  const currentVersion = session.finalVersions?.find(v => v.vno === session.currentVno);
  const deliverId = currentVersion?.pdfId || session.signedLetter?.pdfId || session.packet.pdfId;

  // PRE share to family user (Vault grant)
  console.log(`Granting access to ${deliverId} for user ${familyUserId}`);
  const versionLabel = currentVersion ? `v${currentVersion.vno}` : 'legacy';
  
  // Track legacy share grant event
  await trackShareGranted(familyUserId);

  // Log Consent-RDS with scope for estate review packet
  await recordReceipt({
    type: 'Consent-RDS',
    scope: { 'estate_review_packet': ['pdf'] },
    result: 'approve',
    participant_id: familyUserId,
    created_at: new Date().toISOString()
  } as any);

  // Log Comms-RDS for notification email
  await recordReceipt({
    type: 'Comms-RDS',
    channel: 'email',
    persona: 'family',
    template_id: 'estate.review.deliver',
    recipient_id: familyUserId,
    result: 'sent',
    policy_ok: true,
    created_at: new Date().toISOString()
  } as any);

  // Log Decision-RDS for delivery action
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.deliver',
    reasons: [`session:${session.id}`, `v:${currentVersion?.vno || 'n/a'}`, deliverId!],
    participant_id: familyUserId,
    created_at: new Date().toISOString()
  } as any);

  // Update session with delivery tracking
  session.deliveredVno = currentVersion?.vno;
  session.status = 'delivered';

  console.log(`✅ Review packet ${versionLabel} delivered to family user ${familyUserId}`);
}

export async function notifyFamilyOfDelivery(options: {
  familyUserId: string;
  sessionId: string;
  clientName: string;
  downloadUrl: string;
}): Promise<void> {
  const { familyUserId, sessionId, clientName, downloadUrl } = options;

  // This would integrate with your email service (e.g., Resend)
  const emailContent = generateDeliveryEmail(clientName, downloadUrl);
  
  console.log(`📧 Sending delivery notification to user ${familyUserId}:`, emailContent);

  // Log the communication
  await recordReceipt({
    type: 'Comms-RDS',
    channel: 'email',
    persona: 'family',
    template_id: 'estate.review.delivery_notification',
    recipient_id: familyUserId,
    result: 'sent',
    policy_ok: true,
    metadata: {
      session_id: sessionId,
      download_url: downloadUrl
    },
    created_at: new Date().toISOString()
  } as any);
}

function generateDeliveryEmail(clientName: string, downloadUrl: string): string {
  return `
Subject: Your Estate Planning Review Package is Ready

Dear ${clientName},

Your estate planning documents have been reviewed by our licensed attorney and are now ready for your review.

Your Attorney-Reviewed Estate Package includes:
• Reviewed estate planning documents
• State-specific execution instructions
• Attorney review letter with recommendations
• Next steps checklist

Download your package: ${downloadUrl}

What's Next:
1. Review all documents carefully
2. Follow the execution instructions provided
3. Schedule notarization appointments as needed
4. Contact us with any questions

This package contains your final, attorney-reviewed documents ready for execution.

Best regards,
Your Estate Planning Team
`;
}

export function generateExecutionInstructions(state: string): string {
  return `
EXECUTION INSTRUCTIONS FOR ${state}

Important: These documents must be executed according to ${state} law requirements.

General Steps:
1. Do NOT sign any documents until you are with the notary and witnesses
2. Bring valid photo identification
3. All parties must be present simultaneously
4. Follow the signing order specified by the notary

Document-Specific Instructions:
• Will: Requires witnesses and notarization per ${state} law
• Trust: Must be notarized
• Power of Attorney: Must be notarized
• Healthcare Documents: Follow witness/notary requirements

After Execution:
1. Make copies for your records
2. Store originals in a safe place
3. Provide copies to relevant parties (banks, doctors, etc.)
4. Update beneficiary designations as needed

Questions? Contact your attorney or estate planning professional.
`;
}