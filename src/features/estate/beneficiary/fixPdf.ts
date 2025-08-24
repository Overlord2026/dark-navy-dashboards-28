interface FixLetterParams {
  clientId: string;
  accountId: string;
  intent: string;
  current: string;
}

export async function buildFixLetterPdf(params: FixLetterParams): Promise<Uint8Array> {
  // Mock PDF generation for beneficiary fix letter
  const content = `
    BENEFICIARY DESIGNATION CHANGE REQUEST
    
    Account: ${params.accountId}
    Current Beneficiary: ${params.current}
    Requested Beneficiary: ${params.intent}
    
    Client ID: ${params.clientId}
    Date: ${new Date().toLocaleDateString()}
    
    Please complete this form and submit to your financial institution
    to update the beneficiary designation as indicated above.
  `;
  
  // Convert to bytes (mock implementation)
  const encoder = new TextEncoder();
  return encoder.encode(content);
}