
import { SecurityTestResult } from "./types";

export async function runSecurityTests(): Promise<SecurityTestResult[]> {
  // This would typically connect to a security scanning service
  // For now, we'll return mock data
  
  // Simulate a delay for the tests to run
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return [
    {
      id: "sec-001",
      name: "Cross-site Scripting (XSS) Protection",
      status: "success",
      severity: "critical",
      message: "No XSS vulnerabilities detected",
      category: "web-security"
    },
    {
      id: "sec-002",
      name: "Content Security Policy",
      status: "warning",
      severity: "high",
      message: "CSP header is present but missing some directives",
      remediation: "Add missing CSP directives for media-src and object-src",
      category: "web-security"
    },
    {
      id: "sec-003",
      name: "Secure Cookie Configuration",
      status: "success",
      severity: "medium",
      message: "All cookies are using secure configuration",
      category: "data-security"
    },
    {
      id: "sec-004",
      name: "HTTPS Implementation",
      status: "success",
      severity: "critical",
      message: "HTTPS is properly configured with modern protocols",
      category: "infrastructure-security"
    },
    {
      id: "sec-005",
      name: "Authentication Controls",
      status: "success",
      severity: "high",
      message: "Authentication mechanisms are secure",
      category: "access-control"
    }
  ];
}
