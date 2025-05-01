
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";
import { SecurityTestResult } from "@/types/diagnostics";

export function runSecurityTests(): SecurityTestResult[] {
  const results: SecurityTestResult[] = [];
  
  // Mock security tests
  const securityTests = [
    { 
      testName: "HTTPS Enforcement", 
      category: "Transport Security",
      status: "pass", 
      message: "Application correctly enforces HTTPS",
      severity: "high"
    },
    { 
      testName: "Content Security Policy", 
      category: "Headers & Policies",
      status: "pass", 
      message: "CSP headers are properly configured",
      severity: "medium"
    },
    { 
      testName: "Authentication Timeout", 
      category: "Authentication",
      status: "warn", 
      message: "Session timeout is longer than recommended",
      severity: "medium"
    },
    { 
      testName: "Password Policy", 
      category: "Authentication",
      status: "pass", 
      message: "Password policy meets security standards",
      severity: "high"
    },
    { 
      testName: "API Rate Limiting", 
      category: "API Security",
      status: "pass", 
      message: "Rate limiting properly implemented",
      severity: "medium"
    },
  ];
  
  securityTests.forEach(test => {
    results.push({
      id: uuidv4(),
      testName: test.testName,
      category: test.category,
      status: test.status as "pass" | "fail" | "warn",
      message: test.message,
      severity: test.severity as "low" | "medium" | "high" | "critical",
      details: { 
        timestamp: new Date().toISOString(),
        environment: "production"
      }
    });
  });

  return results;
}
