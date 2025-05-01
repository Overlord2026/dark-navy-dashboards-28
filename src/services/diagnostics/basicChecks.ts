
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";

export interface DiagnosticResult {
  id: string;
  name: string;
  status: DiagnosticTestStatus;
  message: string;
  details?: any;
}

export function runBasicDiagnostics(): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  // Check browser compatibility
  const browserCheckResult: DiagnosticResult = {
    id: uuidv4(),
    name: "Browser Compatibility",
    status: DiagnosticTestStatus.SUCCESS,
    message: "Current browser is fully supported",
    details: {
      userAgent: navigator.userAgent,
      features: {
        localStorage: typeof localStorage !== "undefined",
        sessionStorage: typeof sessionStorage !== "undefined",
        webWorkers: typeof Worker !== "undefined",
      },
    },
  };

  results.push(browserCheckResult);

  // Check network connectivity
  const networkCheckResult: DiagnosticResult = {
    id: uuidv4(),
    name: "Network Connectivity",
    status: navigator.onLine ? DiagnosticTestStatus.SUCCESS : DiagnosticTestStatus.ERROR,
    message: navigator.onLine
      ? "Network connection is available"
      : "No network connection detected",
    details: {
      online: navigator.onLine,
      connectionType: "unknown", // Would require more advanced detection
    },
  };

  results.push(networkCheckResult);

  return results;
}
