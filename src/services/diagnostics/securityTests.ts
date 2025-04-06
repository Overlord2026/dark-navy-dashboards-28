
import { SecurityTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

// Original function name for backward compatibility
export const testSecurity = (): SecurityTestResult[] => {
  // Sample security tests
  return [
    {
      id: uuidv4(),
      name: "Session Timeout",
      status: "success",
      severity: "medium",
      message: "Session timeout is properly configured",
      category: "Authentication" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Password Policy",
      status: "success",
      severity: "high",
      message: "Password policy meets security standards",
      category: "Authentication" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "SQL Injection Protection",
      status: "success",
      severity: "critical",
      message: "All inputs are properly sanitized",
      category: "Input Validation" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Cross-Site Scripting (XSS) Protection",
      status: "warning",
      severity: "high",
      message: "Some outputs need additional encoding",
      category: "Output Encoding" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "HTTPS Configuration",
      status: "success",
      severity: "critical",
      message: "HTTPS is properly configured with modern TLS",
      category: "Transport Security" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "CSRF Protection",
      status: "success",
      severity: "high",
      message: "CSRF tokens are implemented correctly",
      category: "Request Forgery" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "File Upload Validation",
      status: "warning",
      severity: "medium",
      message: "Additional file type validation needed",
      category: "Input Validation" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "API Rate Limiting",
      status: "success",
      severity: "medium",
      message: "API rate limiting is properly configured",
      category: "API Security" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Error Handling",
      status: "warning",
      severity: "low",
      message: "Some error messages may reveal too much information",
      category: "Information Disclosure" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Dependency Scanning",
      status: "success",
      severity: "high",
      message: "All dependencies are up to date with no known vulnerabilities",
      category: "Dependencies" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Content Security Policy",
      status: "warning",
      severity: "medium",
      message: "CSP needs further restrictions",
      category: "Browser Security" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Authentication Controls",
      status: "success",
      severity: "critical",
      message: "Multi-factor authentication is properly implemented",
      category: "Authentication" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Authorization Controls",
      status: "success",
      severity: "critical",
      message: "Role-based access control is properly implemented",
      category: "Authorization" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Logging and Monitoring",
      status: "success",
      severity: "medium",
      message: "Security events are properly logged and monitored",
      category: "Monitoring" // Added for backward compatibility
    },
    {
      id: uuidv4(),
      name: "Data Encryption",
      status: "success",
      severity: "high",
      message: "Sensitive data is properly encrypted at rest",
      category: "Data Protection" // Added for backward compatibility
    }
  ];
};

// Add the required function that's being imported elsewhere
export const runSecurityTests = async (): Promise<SecurityTestResult[]> => {
  // Simply wrap testSecurity in a Promise to make it async
  return Promise.resolve(testSecurity());
};
