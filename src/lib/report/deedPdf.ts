import type { RecordingRule } from '@/features/estate/deeds/stateDeedRules';

export async function renderDeedPdf(
  kind: 'Warranty'|'SpecialWarranty'|'Quitclaim'|'TOD'|'TODD'|'LadyBird', 
  tokens: Record<string,string>, 
  rules: RecordingRule
): Promise<Uint8Array> {
  // Template selection based on deed type
  const template = getDeedTemplate(kind);
  
  // Replace tokens with actual values
  let content = template;
  Object.entries(tokens).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  // Add state-specific notary and witness blocks
  content = addNotaryBlock(content, rules);
  content = addWitnessBlock(content, rules);
  
  // Convert to PDF (placeholder implementation)
  const pdfContent = await generatePdf(content, {
    title: `${kind} Deed`,
    margins: { top: 72, bottom: 72, left: 72, right: 72 }, // 1 inch margins
    ...rules.marginRules && { customMargins: rules.marginRules }
  });
  
  return new Uint8Array(pdfContent);
}

function getDeedTemplate(kind: string): string {
  const templates = {
    'Warranty': `
      WARRANTY DEED
      
      State of {{state_code}}
      County of {{county}}
      
      For valuable consideration, {{grantor_name}}, Grantor, hereby grants, bargains, sells and conveys to {{grantee_name}}, Grantee, the following described real property:
      
      {{legal_description}}
      
      Subject to: {{subject_to_clause}}
      
      Grantor warrants title to said property and will defend the same against all lawful claims.
      
      {{grantor_signature_block}}
      {{notary_block}}
      {{witness_block}}
    `,
    'Quitclaim': `
      QUITCLAIM DEED
      
      State of {{state_code}}
      County of {{county}}
      
      For valuable consideration, {{grantor_name}}, Grantor, hereby quitclaims to {{grantee_name}}, Grantee, all right, title and interest in the following described real property:
      
      {{legal_description}}
      
      {{grantor_signature_block}}
      {{notary_block}}
      {{witness_block}}
    `,
    'TOD': `
      TRANSFER ON DEATH DEED
      
      State of {{state_code}}
      County of {{county}}
      
      {{grantor_name}}, as owner, hereby designates {{beneficiary_name}} as transfer-on-death beneficiary of the following described real property:
      
      {{legal_description}}
      
      This designation shall take effect upon the death of the owner.
      
      {{grantor_signature_block}}
      {{notary_block}}
    `,
    'LadyBird': `
      ENHANCED LIFE ESTATE DEED (LADY BIRD DEED)
      
      State of {{state_code}}
      County of {{county}}
      
      {{grantor_name}}, Grantor, hereby conveys to {{grantor_name}}, a life estate with enhanced powers, and upon death to {{remainder_beneficiary}}, as remainder beneficiary, the following described real property:
      
      {{legal_description}}
      
      Grantor reserves the right to sell, mortgage, lease or otherwise dispose of the property during lifetime without consent of remainder beneficiary.
      
      {{grantor_signature_block}}
      {{notary_block}}
      {{witness_block}}
    `
  };
  
  return templates[kind] || templates['Warranty'];
}

function addNotaryBlock(content: string, rules: RecordingRule): string {
  if (!rules.notary) return content;
  
  const notaryBlock = `
    State of {{state_code}}
    County of {{county}}
    
    On this _____ day of _______, 20___, before me personally appeared {{grantor_name}}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity.
    
    _________________________________
    Notary Public
    
    My commission expires: ___________
  `;
  
  return content.replace('{{notary_block}}', notaryBlock);
}

function addWitnessBlock(content: string, rules: RecordingRule): string {
  if (rules.witnesses === 0) {
    return content.replace('{{witness_block}}', '');
  }
  
  let witnessBlock = '\nWITNESSES:\n';
  for (let i = 1; i <= rules.witnesses; i++) {
    witnessBlock += `
      Witness ${i}: _________________________  Date: __________
      Print Name: _________________________
      Address: ____________________________
                ____________________________
    `;
  }
  
  return content.replace('{{witness_block}}', witnessBlock);
}

async function generatePdf(content: string, options: any): Promise<ArrayBuffer> {
  // Placeholder PDF generation - in real implementation would use jsPDF or similar
  const encoder = new TextEncoder();
  return encoder.encode(content).buffer;
}