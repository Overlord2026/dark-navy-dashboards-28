// Simple stub for policy evaluation
export async function evaluateAction(action: any, context: any) {
  // Mock policy evaluation - always allow with conditions
  return {
    decision: "ALLOW_WITH_CONDITIONS",
    bundles: [
      { id: "policy_001", name: "Transfer Policy" },
      { id: "policy_002", name: "Amount Limit Policy" }
    ]
  };
}