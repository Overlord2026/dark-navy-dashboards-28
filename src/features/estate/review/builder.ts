import { hash } from '@/lib/canonical';
import { recordReceipt } from '@/features/receipts/record';
import { getEstateRule } from '@/features/estate/states/estateRules';
import { getDeedRules } from '@/features/estate/deeds/stateDeedRules';
import { getHealthRule } from '@/features/estate/states/healthRules';
import type { ReviewPacketData, ReviewChecklistItem, AttorneyInfo, ReviewLetterData } from './types';

export async function buildReviewPacket(
  clientId: string, 
  state: string, 
  docIds: string[]
): Promise<{ bytes: Uint8Array; sha256: string }> {
  // Get state execution rules
  const estateRule = getEstateRule(state);
  const deedRule = getDeedRules(state);
  const healthRule = getHealthRule(state);

  // Generate checklist based on state rules
  const checklist = generateStateChecklist(state, estateRule, deedRule, healthRule);

  const packetData: ReviewPacketData = {
    clientName: `Client ${clientId}`, // In real implementation, fetch from client data
    state,
    docIds,
    createdAt: new Date().toISOString(),
    disclaimerText: "This review packet contains preliminary documents that are NOT LEGAL ADVICE until reviewed and signed by a licensed attorney.",
    checklist
  };

  // Build PDF content (simplified - in real implementation use pdf-lib or similar)
  const pdfContent = buildPDFContent(packetData, estateRule, deedRule, healthRule);
  const pdfBytes = new TextEncoder().encode(pdfContent); // Simplified - would be actual PDF bytes

  const sha256Value = await hash({ clientId, state, docIds, ts: Date.now() });
  
  return { bytes: pdfBytes, sha256: sha256Value };
}

function generateStateChecklist(
  state: string,
  estateRule: any,
  deedRule: any,
  healthRule: any
): ReviewChecklistItem[] {
  const checklist: ReviewChecklistItem[] = [];

  // Will execution requirements
  checklist.push({
    id: 'will-witnesses',
    title: `Will Witnesses (${estateRule.will.witnesses} required)`,
    description: `Ensure ${estateRule.will.witnesses} witnesses sign the will`,
    completed: false,
    required: true,
    category: 'witnesses'
  });

  if (estateRule.will.notary) {
    checklist.push({
      id: 'will-notary',
      title: 'Will Notarization',
      description: 'Will must be notarized',
      completed: false,
      required: true,
      category: 'notarization'
    });
  }

  if (estateRule.will.selfProving) {
    checklist.push({
      id: 'will-self-proving',
      title: 'Self-Proving Affidavit',
      description: 'Attach self-proving affidavit to will',
      completed: false,
      required: false,
      category: 'execution'
    });
  }

  // RLT requirements
  if (estateRule.rlt.notary) {
    checklist.push({
      id: 'rlt-notary',
      title: 'Trust Notarization',
      description: 'Revocable Living Trust must be notarized',
      completed: false,
      required: true,
      category: 'notarization'
    });
  }

  // POA requirements
  if (estateRule.poa.notary) {
    checklist.push({
      id: 'poa-notary',
      title: 'Power of Attorney Notarization',
      description: 'Power of Attorney must be notarized',
      completed: false,
      required: true,
      category: 'notarization'
    });
  }

  // Healthcare document requirements
  if (healthRule) {
    checklist.push({
      id: 'healthcare-witnesses',
      title: `Healthcare Document Witnesses (${healthRule.witnesses} required)`,
      description: `Ensure ${healthRule.witnesses} witnesses sign healthcare documents`,
      completed: false,
      required: healthRule.witnesses > 0,
      category: 'witnesses'
    });

    if (healthRule.notaryRequired) {
      checklist.push({
        id: 'healthcare-notary',
        title: 'Healthcare Document Notarization',
        description: 'Healthcare documents must be notarized',
        completed: false,
        required: true,
        category: 'notarization'
      });
    }
  }

  // Deed requirements (if applicable)
  if (deedRule && deedRule.notary) {
    checklist.push({
      id: 'deed-notary',
      title: 'Deed Notarization',
      description: 'Real estate deeds must be notarized',
      completed: false,
      required: true,
      category: 'notarization'
    });
  }

  if (deedRule && deedRule.witnesses > 0) {
    checklist.push({
      id: 'deed-witnesses',
      title: `Deed Witnesses (${deedRule.witnesses} required)`,
      description: `Ensure ${deedRule.witnesses} witnesses sign real estate deeds`,
      completed: false,
      required: true,
      category: 'witnesses'
    });
  }

  return checklist;
}

function buildPDFContent(
  packetData: ReviewPacketData,
  estateRule: any,
  deedRule: any,
  healthRule: any
): string {
  // Simplified PDF content generation
  let content = `
ATTORNEY REVIEW PACKET
Generated: ${new Date().toLocaleDateString()}

CLIENT: ${packetData.clientName}
STATE: ${packetData.state}

${packetData.disclaimerText}

STATE EXECUTION SUMMARY:
=======================

Will Requirements:
- Witnesses: ${estateRule.will.witnesses}
- Notary: ${estateRule.will.notary ? 'Required' : 'Not Required'}
- Self-Proving: ${estateRule.will.selfProving ? 'Available' : 'Not Available'}

Trust Requirements:
- Notary: ${estateRule.rlt.notary ? 'Required' : 'Not Required'}

Power of Attorney Requirements:
- Notary: ${estateRule.poa.notary ? 'Required' : 'Not Required'}

EXECUTION CHECKLIST:
===================

`;

  packetData.checklist.forEach((item, index) => {
    content += `${index + 1}. [${item.completed ? 'X' : ' '}] ${item.title}
   ${item.description}
   ${item.required ? '(REQUIRED)' : '(OPTIONAL)'}

`;
  });

  content += `
DOCUMENT PREVIEWS:
=================

Document IDs included in this review:
${packetData.docIds.map(id => `- ${id}`).join('\n')}

[Document previews would be embedded here]

ATTORNEY SIGNATURE REQUIRED BELOW
_________________________________

This packet has been reviewed by:

Attorney: ___________________________
Bar Number: _________________________
Date: _______________________________
Signature: __________________________

`;

  return content;
}

export async function buildReviewLetter(options: {
  clientId: string;
  state: string;
  attorney: AttorneyInfo;
  packetPdfId: string;
}): Promise<{ bytes: Uint8Array; sha256: string }> {
  const letterData: ReviewLetterData = {
    clientName: `Client ${options.clientId}`,
    state: options.state,
    attorneyName: options.attorney.name,
    barNumber: options.attorney.barNo,
    reviewDate: new Date().toLocaleDateString(),
    letterBody: generateLetterBody(options.state),
    recommendations: generateRecommendations(options.state),
    signatureRequired: true
  };

  const letterContent = buildLetterContent(letterData);
  const letterBytes = new TextEncoder().encode(letterContent);
  
  const sha256Value = await hash({ 
    clientId: options.clientId, 
    state: options.state, 
    attorney: options.attorney.name, 
    ts: Date.now() 
  });

  return { bytes: letterBytes, sha256: sha256Value };
}

function generateLetterBody(state: string): string {
  return `I have reviewed the estate planning documents prepared for execution in ${state}. Based on my review of the applicable state laws and the client's circumstances, I provide the following analysis and recommendations.`;
}

function generateRecommendations(state: string): string[] {
  const estateRule = getEstateRule(state);
  const recommendations: string[] = [];

  recommendations.push(`Ensure all execution requirements for ${state} are met`);
  
  if (estateRule.will.witnesses > 0) {
    recommendations.push(`Arrange for ${estateRule.will.witnesses} qualified witnesses for will execution`);
  }

  if (estateRule.will.notary) {
    recommendations.push('Schedule notarization appointment for will');
  }

  if (estateRule.will.selfProving) {
    recommendations.push('Consider executing self-proving affidavit to simplify probate process');
  }

  if (estateRule.communityProperty) {
    recommendations.push('Review community property implications with client');
  }

  recommendations.push('Verify all documents are properly funded and coordinated');
  recommendations.push('Provide execution instructions to client');

  return recommendations;
}

function buildLetterContent(letterData: ReviewLetterData): string {
  return `
ATTORNEY REVIEW LETTER

Date: ${letterData.reviewDate}

Re: Estate Planning Document Review - ${letterData.clientName}
State: ${letterData.state}

Dear ${letterData.clientName},

${letterData.letterBody}

RECOMMENDATIONS:
${letterData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

This review is based on current ${letterData.state} law and the information provided. Please contact our office if you have any questions or if circumstances change.

Very truly yours,

${letterData.signatureRequired ? '\n\n_________________________________' : ''}
${letterData.attorneyName}
Bar Number: ${letterData.barNumber}
Licensed to practice in ${letterData.state}

Date: ${letterData.reviewDate}
`;
}

export async function applyAttorneyESign(
  letterBytes: Uint8Array, 
  attorney: AttorneyInfo
): Promise<{ bytes: Uint8Array; sha256: string }> {
  // Simplified e-signature application
  const originalContent = new TextDecoder().decode(letterBytes);
  const signedContent = originalContent.replace(
    '_________________________________',
    `${attorney.name} (electronically signed)`
  );
  
  const signedBytes = new TextEncoder().encode(signedContent);
  const sha256Value = await hash({ 
    attorney: attorney.name, 
    signedAt: new Date().toISOString() 
  });

  return { bytes: signedBytes, sha256: sha256Value };
}