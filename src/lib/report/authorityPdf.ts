export async function makeAuthorityGrantPdf(grant: {
  role: string;
  subject: string;
  minViewUrl: string;
}): Promise<Uint8Array> {
  // Create a minimal PDF for authority grants
  const content = `
Authority Grant Document
=======================

Role: ${grant.role}
Subject: ${grant.subject}
Verification URL: ${grant.minViewUrl}

This document grants the specified authority for financial and legal matters.
Generated: ${new Date().toISOString()}
`;

  return new TextEncoder().encode(content);
}