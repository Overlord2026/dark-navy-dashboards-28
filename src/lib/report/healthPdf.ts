// Healthcare PDF generator 
export async function generateHealthcarePdf(
  docType: string,
  tokens: Record<string, string>,
  rules: any
): Promise<Uint8Array> {
  // Mock PDF generation
  const content = `${docType} Document for ${tokens.patient_name}`;
  return new TextEncoder().encode(content);
}

export async function renderHealthcarePdf(
  form: string,
  tokens: Record<string, string>,
  rule: any
): Promise<Uint8Array> {
  return generateHealthcarePdf(form, tokens, rule);
}