export async function makeRoadmapStoryPdf(input: {
  scenarioName: string;
  successProb: number;
  bands: any;
  diffs?: string[];
  guardrailNote?: string;
  disclosures?: string;
}): Promise<Uint8Array> {
  // Create a minimal PDF for demo purposes
  // In production, this would use a proper PDF library like jsPDF or Puppeteer
  
  const content = `
Retirement Roadmap Story Report
==============================

Scenario: ${input.scenarioName}
Success Probability: ${(input.successProb * 100).toFixed(1)}%

${input.guardrailNote ? `Guardrails: ${input.guardrailNote}` : ''}

${input.diffs?.length ? `Changes from previous: ${input.diffs.join(', ')}` : ''}

${input.disclosures || 'This is a projection for educational purposes only.'}
`;

  return new TextEncoder().encode(content);
}