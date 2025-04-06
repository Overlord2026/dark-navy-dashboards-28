
import { SecurityTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testSecurity = (): SecurityTestResult[] => {
  // Sample security tests
  return [
    {
      id: uuidv4(),
      name: "Authentication Bypass Check",
      status: "success",
      severity: "critical",
      message: "No authentication bypass vulnerabilities detected",
      category: "authentication", // Added for backward compatibility
      remediation: "Continue monitoring authentication flow for potential vulnerabilities"
    },
    {
      id: uuidv4(),
      name: "SQL Injection Protection",
      status: "success",
      severity: "critical",
      message: "SQL injection protections are properly implemented",
      category: "injection", // Added for backward compatibility
      remediation: "Continue using parameterized queries and ORM for database operations"
    },
    {
      id: uuidv4(),
      name: "CSRF Token Validation",
      status: "warning",
      severity: "high",
      message: "CSRF token validation missing on 2 API endpoints",
      category: "csrf", // Added for backward compatibility
      remediation: "Add CSRF token validation to the identified endpoints",
      details: {
        affectedEndpoints: ["/api/user/preferences", "/api/billing/update"],
        recommendations: ["Add server-side CSRF token validation", "Use the csrfProtect middleware"]
      }
    },
    {
      id: uuidv4(),
      name: "Content Security Policy",
      status: "warning",
      severity: "medium",
      message: "CSP allowing unsafe-inline for scripts",
      category: "headers", // Added for backward compatibility
      remediation: "Remove unsafe-inline from script-src directive and implement nonces",
      details: {
        currentPolicy: "script-src 'self' 'unsafe-inline' https://trusted-cdn.com;",
        recommendedPolicy: "script-src 'self' https://trusted-cdn.com;"
      }
    },
    {
      id: uuidv4(),
      name: "Secure Cookie Flags",
      status: "success",
      severity: "high",
      message: "Secure and HttpOnly flags set on all cookies",
      category: "cookies", // Added for backward compatibility
      remediation: "Continue using secure cookie configuration"
    },
    {
      id: uuidv4(),
      name: "Password Policy",
      status: "success",
      severity: "medium",
      message: "Strong password policy enforced",
      category: "authentication", // Added for backward compatibility
      remediation: "Continue enforcing strong password requirements"
    },
    {
      id: uuidv4(),
      name: "Session Timeout",
      status: "success",
      severity: "medium",
      message: "Session timeout properly configured",
      category: "session", // Added for backward compatibility
      remediation: "Continue with current session management approach"
    },
    {
      id: uuidv4(),
      name: "XSS Protection",
      status: "warning",
      severity: "high",
      message: "Potential XSS vulnerability in comment submission form",
      category: "xss", // Added for backward compatibility
      remediation: "Implement HTML sanitization for user-submitted content",
      details: {
        affectedComponents: ["CommentForm"],
        recommendations: ["Use DOMPurify to sanitize user inputs", "Add X-XSS-Protection header"]
      }
    },
    {
      id: uuidv4(),
      name: "File Upload Security",
      status: "warning",
      severity: "high",
      message: "File type validation can be bypassed",
      category: "upload", // Added for backward compatibility
      remediation: "Implement server-side file type validation using file signatures",
      details: {
        issue: "Client-side MIME type checks can be bypassed",
        recommendations: ["Add server-side file signature validation", "Limit file size"]
      }
    },
    {
      id: uuidv4(),
      name: "Rate Limiting",
      status: "success",
      severity: "medium",
      message: "Rate limiting properly implemented for sensitive endpoints",
      category: "api", // Added for backward compatibility
      remediation: "Continue monitoring for abuse patterns"
    },
    {
      id: uuidv4(),
      name: "Dependency Analysis",
      status: "error",
      severity: "critical",
      message: "3 dependencies have known vulnerabilities",
      category: "dependencies", // Added for backward compatibility
      remediation: "Update affected dependencies to latest versions",
      details: {
        vulnerableDependencies: [
          { name: "package-a", version: "1.2.3", severity: "high" },
          { name: "package-b", version: "2.3.4", severity: "critical" },
          { name: "package-c", version: "0.1.2", severity: "medium" }
        ]
      }
    },
    {
      id: uuidv4(),
      name: "API Endpoint Authorization",
      status: "warning",
      severity: "high",
      message: "Inconsistent authorization checks on API endpoints",
      category: "authorization", // Added for backward compatibility
      remediation: "Implement consistent authorization middleware for all API endpoints",
      details: {
        affectedEndpoints: ["/api/reports", "/api/admin-functions"],
        recommendations: ["Use authz middleware", "Implement role-based access controls"]
      }
    },
    {
      id: uuidv4(),
      name: "Logging & Monitoring",
      status: "success",
      severity: "medium",
      message: "Security events are properly logged and monitored",
      category: "monitoring", // Added for backward compatibility
      remediation: "Continue with current logging and monitoring approach"
    },
    {
      id: uuidv4(),
      name: "HTTPS Configuration",
      status: "success",
      severity: "high",
      message: "HTTPS properly configured with TLS 1.2+",
      category: "encryption", // Added for backward compatibility
      remediation: "Continue enforcing HTTPS across all connections"
    },
    {
      id: uuidv4(),
      name: "JWT Implementation",
      status: "success",
      severity: "high",
      message: "JWT implementation using secure algorithms and expiration",
      category: "authentication", // Added for backward compatibility
      remediation: "Continue using secure JWT practices"
    }
  ];
};
