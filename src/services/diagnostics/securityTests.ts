
import { SecurityTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testSecurity = async (): Promise<SecurityTestResult[]> => {
  // In a real implementation, this would run actual security tests
  // For this demo, we'll return mock security test results
  
  return [
    {
      id: uuidv4(),
      name: "Authentication Timeout",
      status: "success", 
      severity: "high",
      message: "Authentication timeout settings are properly configured",
      remediation: "Current settings are appropriate",
      details: {
        timeoutMinutes: 30,
        inactivityLogout: true,
        multipleSessionsAllowed: false
      },
      category: "authentication"
    },
    {
      id: uuidv4(),
      name: "Password Policies",
      status: "success",
      severity: "high",
      message: "Password policies are enforced correctly",
      remediation: "Continue to enforce strong password requirements",
      details: {
        minLength: 12,
        requiresSpecialChars: true,
        requiresNumbers: true,
        requiresMixedCase: true
      },
      category: "authentication"
    },
    {
      id: uuidv4(),
      name: "CSRF Protection",
      status: "success",
      severity: "critical",
      message: "CSRF protection is implemented correctly",
      remediation: "No action required",
      details: {
        tokenValidation: true,
        sameOriginPolicy: true
      },
      category: "web-security"
    },
    {
      id: uuidv4(),
      name: "XSS Prevention",
      status: "warning",
      severity: "high",
      message: "Some user inputs are not properly sanitized",
      remediation: "Implement additional sanitization in user profile fields",
      details: {
        contentSecurityPolicy: true,
        outputEncoding: "partial",
        vulnerableRoutes: ["/profile/edit", "/settings"]
      },
      category: "web-security"
    },
    {
      id: uuidv4(),
      name: "API Rate Limiting",
      status: "success",
      severity: "medium",
      message: "Rate limiting is properly configured",
      remediation: "No action required",
      details: {
        maxRequestsPerMinute: 100,
        ipBasedThrottling: true
      },
      category: "api-security"
    },
    {
      id: uuidv4(),
      name: "SQL Injection Prevention",
      status: "success",
      severity: "critical",
      message: "Parameterized queries are used throughout the application",
      remediation: "No action required",
      details: {
        preparedStatements: true,
        ormUsed: true
      },
      category: "data-security"
    },
    {
      id: uuidv4(),
      name: "Session Management",
      status: "success",
      severity: "high",
      message: "Session management is secure",
      remediation: "No action required",
      details: {
        secureFlag: true,
        httpOnlyFlag: true,
        sameSitePolicy: "strict"
      },
      category: "authentication"
    },
    {
      id: uuidv4(),
      name: "Content Security Policy",
      status: "warning",
      severity: "medium",
      message: "CSP headers not enforced on all pages",
      remediation: "Add CSP headers to the /documents and /dashboard routes",
      details: {
        implemented: true,
        missingOnRoutes: ["/documents", "/dashboard"]
      },
      category: "web-security"
    },
    {
      id: uuidv4(),
      name: "Sensitive Data Exposure",
      status: "error",
      severity: "critical",
      message: "API response includes sensitive data",
      remediation: "Filter out sensitive fields from API responses",
      details: {
        affectedEndpoints: ["/api/user/profile", "/api/accounts/details"],
        exposedDataTypes: ["ssn-last-4", "full-account-number"]
      },
      category: "data-security"
    },
    {
      id: uuidv4(),
      name: "HTTPS Implementation",
      status: "success",
      severity: "critical",
      message: "HTTPS is properly enforced across the application",
      remediation: "No action required",
      details: {
        hsts: true,
        tlsVersion: "1.3",
        strongCiphers: true
      },
      category: "network-security"
    },
    {
      id: uuidv4(),
      name: "File Upload Security",
      status: "warning",
      severity: "high",
      message: "File type validation could be bypassed",
      remediation: "Implement server-side MIME type checking",
      details: {
        sizeLimit: "enforced",
        typeValidation: "client-side-only"
      },
      category: "upload-security"
    },
    {
      id: uuidv4(),
      name: "Access Control",
      status: "error",
      severity: "high",
      message: "Horizontal privilege escalation possible in document sharing",
      remediation: "Implement proper permission checks on document API endpoints",
      details: {
        vulnerableEndpoints: ["/api/documents/{id}/share", "/api/documents/{id}/access"]
      },
      category: "authorization"
    },
    {
      id: uuidv4(),
      name: "Dependency Security",
      status: "warning",
      severity: "medium",
      message: "Several dependencies have known vulnerabilities",
      remediation: "Update outdated packages with npm audit fix",
      details: {
        vulnerablePackages: ["lodash (4.17.15)", "axios (0.19.2)"],
        criticalVulnerabilities: 0,
        highVulnerabilities: 2,
        moderateVulnerabilities: 5
      },
      category: "dependency-security"
    },
    {
      id: uuidv4(),
      name: "Error Handling",
      status: "warning",
      severity: "medium",
      message: "Verbose errors exposed to end users",
      remediation: "Implement generic error messages for production",
      details: {
        sensitiveErrorsDetected: 3,
        stackTracesExposed: true
      },
      category: "general"
    },
    {
      id: uuidv4(),
      name: "Logging & Monitoring",
      status: "success",
      severity: "medium",
      message: "Proper logging and monitoring in place",
      remediation: "No action required",
      details: {
        securityEventsLogged: true,
        alertingConfigured: true,
        logRetention: "90 days"
      },
      category: "operational-security"
    }
  ];
};
