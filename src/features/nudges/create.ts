export async function createGuardrailNudge(
  householdId: string, 
  scenarioId: string, 
  successProb: number
) {
  // Create in-app nudge/task for Family & Advisor: "Guardrails warning for <scenario>"
  // optional: if TEMPLATE_ALLOWLIST permits, send email -> recordReceipt(Comms-RDS {channel:'email', template_id:'guardrail_warn'})
  
  const nudge = {
    id: `nudge-${Date.now()}`,
    householdId,
    scenarioId,
    type: 'guardrail_warning',
    title: `Guardrails Warning`,
    message: `Scenario success probability (${(successProb * 100).toFixed(1)}%) is outside recommended range`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  // Store nudge (using localStorage for demo)
  const nudges = JSON.parse(localStorage.getItem('family_nudges') || '[]');
  nudges.push(nudge);
  localStorage.setItem('family_nudges', JSON.stringify(nudges));
  
  return nudge;
}

export async function getNudgesForHousehold(householdId: string) {
  const nudges = JSON.parse(localStorage.getItem('family_nudges') || '[]');
  return nudges.filter((n: any) => n.householdId === householdId);
}