import * as Canonical from '@/lib/canonical';
import { recordReceipt } from '@/features/receipts/record';

export type AttorneyInfo = {
  name: string;
  barNo: string;
  state: string;
  email?: string;
};

export type ReviewLetterData = {
  clientName: string;
  state: string;
  attorneyName: string;
  barNumber: string;
  reviewDate: string;
  letterBody: string;
  recommendations: string[];
  signatureRequired: boolean;
};

export async function buildReviewLetter({
  clientId,
  state,
  attorney,
  packetPdfId
}: {
  clientId: string;
  state: string;
  attorney: AttorneyInfo;
  packetPdfId: string;
}): Promise<{ bytes: Uint8Array; sha256: string }> {
  console.log(`[Sign Letter] Building review letter for ${clientId}`);
  
  // TODO: Integrate with actual PDF letter renderer
  // This would include attorney letterhead, review summary, recommendations
  
  const letterData: ReviewLetterData = {
    clientName: `Client ${clientId}`,
    state,
    attorneyName: attorney.name,
    barNumber: attorney.barNo,
    reviewDate: new Date().toLocaleDateString(),
    letterBody: `I have completed my review of the estate planning documents for the above-referenced client. The documents appear to comply with ${state} state law requirements for execution and validity.`,
    recommendations: [
      'Ensure proper execution order and witness requirements',
      'Complete notarization of all required documents',
      'Maintain original documents in secure location',
      'Review beneficiary designations annually'
    ],
    signatureRequired: true
  };
  
  // Generate letter content
  const content = `
ATTORNEY REVIEW LETTER

TO: ${letterData.clientName}
RE: Estate Planning Document Review
DATE: ${letterData.reviewDate}

${letterData.letterBody}

RECOMMENDATIONS:
${letterData.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

This letter serves as my professional opinion regarding the reviewed documents referenced in packet ${packetPdfId}.

_________________________________
${letterData.attorneyName}
Attorney at Law
Bar No. ${letterData.barNumber}
State of ${state}

Date: ${letterData.reviewDate}
  `.trim();
  
  const bytes = new TextEncoder().encode(content);
  const sha256 = await Canonical.hash(bytes);
  
  console.log(`[Sign Letter] Generated letter: ${bytes.length} bytes, hash: ${sha256.slice(0, 16)}...`);
  
  return { bytes, sha256 };
}

export async function applyAttorneyESign(
  letterBytes: Uint8Array,
  attorney: AttorneyInfo
): Promise<{ bytes: Uint8Array; sha256: string }> {
  console.log(`[Sign Letter] Applying e-signature for ${attorney.name}`);
  
  // TODO: Integrate with e-signature service (DocuSign, Adobe Sign, etc.)
  // For demo purposes, append signature block
  
  const originalContent = new TextDecoder().decode(letterBytes);
  const timestamp = new Date().toISOString();
  
  const signedContent = originalContent + `

ELECTRONIC SIGNATURE APPLIED:
Signed by: ${attorney.name}
Bar Number: ${attorney.barNo}
Timestamp: ${timestamp}
IP Address: [REDACTED]
Signature Hash: ${await Canonical.hash(attorney.name + timestamp)}
`;
  
  const bytes = new TextEncoder().encode(signedContent);
  const sha256 = await Canonical.hash(bytes);
  
  // Record the signing event
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.sign',
    reasons: [`attorney:${attorney.name}`, sha256.slice(0, 16)],
    created_at: new Date().toISOString()
  } as any);
  
  console.log(`[Sign Letter] Applied e-signature: ${bytes.length} bytes, hash: ${sha256.slice(0, 16)}...`);
  
  return { bytes, sha256 };
}