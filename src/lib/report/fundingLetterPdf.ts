export async function renderFundingLetterPdf(
  tokens: Record<string,string>
): Promise<Uint8Array> {
  const template = getFundingLetterTemplate(tokens.letterType || 'TOD');
  
  // Replace tokens with actual values
  let content = template;
  Object.entries(tokens).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  // Convert to PDF
  const pdfContent = await generatePdf(content, {
    title: 'Account Funding Letter',
    letterhead: true
  });
  
  return new Uint8Array(pdfContent);
}

function getFundingLetterTemplate(letterType: string): string {
  const templates = {
    'TOD': `
      {{date}}
      
      {{institution_name}}
      {{institution_address}}
      
      Re: Transfer on Death Designation
          Account Number: {{account_number}}
          Account Holder: {{account_holder_name}}
      
      Dear Sir or Madam:
      
      I am writing to request the necessary forms to add a Transfer on Death (TOD) designation to the above-referenced account.
      
      Account Details:
      - Account Holder: {{account_holder_name}}
      - Account Type: {{account_type}}
      - Social Security Number: {{ssn}}
      
      Requested TOD Beneficiary Information:
      - Primary Beneficiary: {{primary_beneficiary}}
      - Relationship: {{relationship}}
      - Contingent Beneficiary: {{contingent_beneficiary}} (if applicable)
      
      Please send the appropriate forms to complete this designation, along with any additional documentation requirements.
      
      If you have any questions, please contact me at {{phone_number}} or {{email_address}}.
      
      Thank you for your assistance.
      
      Sincerely,
      
      {{account_holder_name}}
      {{signature_line}}
    `,
    'POD': `
      {{date}}
      
      {{institution_name}}
      {{institution_address}}
      
      Re: Payable on Death Designation
          Account Number: {{account_number}}
          Account Holder: {{account_holder_name}}
      
      Dear Sir or Madam:
      
      I am writing to request the necessary forms to add a Payable on Death (POD) designation to the above-referenced account.
      
      Account Details:
      - Account Holder: {{account_holder_name}}
      - Account Type: {{account_type}}
      - Social Security Number: {{ssn}}
      
      Requested POD Beneficiary Information:
      - Primary Beneficiary: {{primary_beneficiary}}
      - Relationship: {{relationship}}
      - Contingent Beneficiary: {{contingent_beneficiary}} (if applicable)
      
      Please send the appropriate forms to complete this designation, along with any additional documentation requirements.
      
      If you have any questions, please contact me at {{phone_number}} or {{email_address}}.
      
      Thank you for your assistance.
      
      Sincerely,
      
      {{account_holder_name}}
      {{signature_line}}
    `,
    '401k': `
      {{date}}
      
      {{plan_administrator}}
      {{plan_address}}
      
      Re: Beneficiary Designation Change
          Plan: {{plan_name}}
          Participant: {{participant_name}}
          Employee ID: {{employee_id}}
      
      Dear Plan Administrator:
      
      I am writing to request a beneficiary designation change form for my retirement plan account.
      
      Current Information:
      - Participant Name: {{participant_name}}
      - Employee ID: {{employee_id}}
      - Date of Birth: {{date_of_birth}}
      
      New Beneficiary Designation:
      - Primary Beneficiary: {{primary_beneficiary}}
      - Percentage: {{primary_percentage}}%
      - Relationship: {{relationship}}
      - Contingent Beneficiary: {{contingent_beneficiary}}
      - Percentage: {{contingent_percentage}}%
      
      Please send the appropriate forms and let me know if additional documentation is required.
      
      Thank you for your assistance.
      
      Sincerely,
      
      {{participant_name}}
      {{signature_line}}
    `
  };
  
  return templates[letterType] || templates['TOD'];
}

async function generatePdf(content: string, options: any): Promise<ArrayBuffer> {
  // Placeholder PDF generation - in real implementation would use jsPDF or similar
  const encoder = new TextEncoder();
  return encoder.encode(content).buffer;
}