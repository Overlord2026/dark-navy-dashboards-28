
import { SecurityTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export const runSecurityTests = async (): Promise<SecurityTestResult[]> => {
  // Simulate security test running
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sample security test results
  return [
    {
      id: uuidv4(),
      name: "Authentication Tokens",
      status: "success",
      message: "Token validation is correctly implemented",
      details: "JWT tokens are correctly validated with proper expiry checks",
      severity: "high",
      remediation: "No action needed",
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "SQL Injection Prevention",
      status: "success",
      message: "Parameterized queries are used throughout the application",
      details: "All database interactions use prepared statements",
      severity: "critical",
      remediation: "No action needed",
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "XSS Prevention",
      status: "warning",
      message: "Some user inputs are not properly sanitized",
      details: "The comment field in the feedback form may be vulnerable",
      severity: "medium",
      remediation: "Add content sanitization to the feedback form",
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "CSRF Protection",
      status: "success",
      message: "CSRF tokens are properly implemented",
      details: "All forms include CSRF tokens that are validated server-side",
      severity: "high",
      remediation: "No action needed",
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: "File Upload Validation",
      status: "error",
      message: "File upload validation is incomplete",
      details: "File type validation can be bypassed with certain file extensions",
      severity: "high",
      remediation: "Implement content-type validation in addition to extension checks",
      timestamp: Date.now()
    }
  ];
};
