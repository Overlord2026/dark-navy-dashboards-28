import * as React from "react";

export function checkReactHealth() {
  console.log("=== React Health Check ===");
  console.log("React version:", React.version);
  console.log("React object:", React);
  console.log("useState:", React.useState);
  console.log("useEffect:", React.useEffect);
  
  // Check for multiple React instances
  const reactInstances = [];
  if (window.React) reactInstances.push("window.React");
  if ((globalThis as any).React) reactInstances.push("globalThis.React");
  
  console.log("React instances found:", reactInstances);
  console.log("React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:", 
    (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
  
  return {
    version: React.version,
    hasInternals: !!(React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    multipleInstances: reactInstances.length > 1,
    instances: reactInstances
  };
}