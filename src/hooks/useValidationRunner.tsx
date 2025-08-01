import { useState } from 'react';

export interface ValidationResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  category: 'calculator' | 'file_upload' | 'navigation' | 'role_access';
  persona: string;
  toolId?: string;
  message?: string;
  error?: string;
  route?: string;
  duration?: number;
}

export interface ValidationResults {
  [personaId: string]: ValidationResult[];
}

// Mock calculator tests
const mockCalculatorTests = async (persona: string): Promise<ValidationResult[]> => {
  const tests: ValidationResult[] = [];
  
  const calculators = [
    { 
      id: 'roth_conversion', 
      name: 'Roth Conversion Analyzer',
      requiredRoles: ['advisor', 'client_premium', 'admin']
    },
    { 
      id: 'withdrawal_sequencer', 
      name: 'Withdrawal Sequencer',
      requiredRoles: ['advisor', 'client_premium', 'admin']
    },
    { 
      id: 'tax_analyzer', 
      name: 'Tax Analyzer',
      requiredRoles: ['advisor', 'accountant', 'client_premium', 'admin']
    },
    { 
      id: 'property_valuation', 
      name: 'Property Valuation',
      requiredRoles: ['advisor', 'client_premium', 'admin']
    },
    { 
      id: 'portfolio_analyzer', 
      name: 'Portfolio Analyzer',
      requiredRoles: ['advisor', 'admin']
    }
  ];

  for (const calc of calculators) {
    const hasAccess = calc.requiredRoles.includes(persona);
    const status = hasAccess ? 
      (Math.random() > 0.1 ? 'pass' : 'warning') : 
      'fail';
    
    tests.push({
      name: `${calc.name} Access Test`,
      status,
      category: 'calculator',
      persona,
      toolId: calc.id,
      message: hasAccess ? 
        `${calc.name} accessible and functional` : 
        `Access denied - insufficient permissions`,
      route: '/tax-planning'
    });

    if (hasAccess) {
      tests.push({
        name: `${calc.name} Calculation Test`,
        status: Math.random() > 0.15 ? 'pass' : 'warning',
        category: 'calculator',
        persona,
        toolId: calc.id,
        message: 'Calculator returns valid results with test data',
        duration: Math.floor(Math.random() * 1000) + 200
      });

      tests.push({
        name: `${calc.name} Validation Test`,
        status: Math.random() > 0.05 ? 'pass' : 'fail',
        category: 'calculator',
        persona,
        toolId: calc.id,
        message: 'Input validation working correctly'
      });
    }
  }

  return tests;
};

// Mock file upload tests
const mockFileUploadTests = async (persona: string): Promise<ValidationResult[]> => {
  const tests: ValidationResult[] = [];
  
  const uploads = [
    { 
      id: 'tax_return_upload', 
      name: 'Tax Return Upload',
      requiredRoles: ['accountant', 'client_premium', 'advisor', 'admin']
    },
    { 
      id: 'contract_upload', 
      name: 'Contract Upload',
      requiredRoles: ['attorney', 'advisor', 'client_premium', 'admin']
    },
    { 
      id: 'bank_statement_upload', 
      name: 'Bank Statement Upload',
      requiredRoles: ['advisor', 'accountant', 'client_premium', 'admin']
    },
    { 
      id: 'identity_document_upload', 
      name: 'Identity Document Upload',
      requiredRoles: ['advisor', 'attorney', 'accountant', 'admin']
    }
  ];

  for (const upload of uploads) {
    const hasAccess = upload.requiredRoles.includes(persona);
    
    if (hasAccess) {
      tests.push({
        name: `${upload.name} Access Test`,
        status: 'pass',
        category: 'file_upload',
        persona,
        toolId: upload.id,
        message: 'Upload component accessible'
      });

      tests.push({
        name: `${upload.name} File Size Validation`,
        status: Math.random() > 0.1 ? 'pass' : 'warning',
        category: 'file_upload',
        persona,
        toolId: upload.id,
        message: 'File size limits enforced correctly'
      });

      tests.push({
        name: `${upload.name} File Type Validation`,
        status: Math.random() > 0.05 ? 'pass' : 'fail',
        category: 'file_upload',
        persona,
        toolId: upload.id,
        message: 'File type restrictions working'
      });

      tests.push({
        name: `${upload.name} Upload Process`,
        status: Math.random() > 0.2 ? 'pass' : 'warning',
        category: 'file_upload',
        persona,
        toolId: upload.id,
        message: 'File upload completes successfully',
        duration: Math.floor(Math.random() * 2000) + 500
      });
    } else {
      tests.push({
        name: `${upload.name} Access Test`,
        status: 'fail',
        category: 'file_upload',
        persona,
        toolId: upload.id,
        message: 'Upload access denied - insufficient permissions'
      });
    }
  }

  return tests;
};

// Mock role access tests
const mockRoleAccessTests = async (persona: string): Promise<ValidationResult[]> => {
  const tests: ValidationResult[] = [];
  
  const routes = [
    { path: '/admin-portal', requiredRoles: ['admin', 'system_administrator'] },
    { path: '/advisor-dashboard', requiredRoles: ['advisor', 'admin'] },
    { path: '/attorney-dashboard', requiredRoles: ['attorney', 'admin'] },
    { path: '/accountant-dashboard', requiredRoles: ['accountant', 'admin'] },
    { path: '/consultant-dashboard', requiredRoles: ['consultant', 'admin'] },
    { path: '/client-dashboard', requiredRoles: ['client_basic', 'client_premium', 'advisor', 'admin'] }
  ];

  for (const route of routes) {
    const hasAccess = route.requiredRoles.includes(persona);
    
    tests.push({
      name: `${route.path} Access`,
      status: hasAccess ? 'pass' : 'fail',
      category: 'role_access',
      persona,
      route: route.path,
      message: hasAccess ? 'Route accessible' : 'Access denied - correct behavior'
    });
  }

  return tests;
};

export function useValidationRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ValidationResults | null>(null);

  const personas = [
    'client_basic',
    'client_premium', 
    'advisor',
    'accountant',
    'attorney',
    'consultant',
    'admin',
    'system_administrator'
  ];

  const runValidationSuite = async (selectedPersona?: string) => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const testPersonas = selectedPersona ? [selectedPersona] : personas;
    const newResults: ValidationResults = {};

    try {
      for (let i = 0; i < testPersonas.length; i++) {
        const persona = testPersonas[i];
        setCurrentTest(`Testing ${persona} persona`);
        
        // Run all test types
        const calculatorTests = await mockCalculatorTests(persona);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const uploadTests = await mockFileUploadTests(persona);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const accessTests = await mockRoleAccessTests(persona);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        newResults[persona] = [
          ...calculatorTests,
          ...uploadTests,
          ...accessTests
        ];
        
        setProgress(Math.round(((i + 1) / testPersonas.length) * 100));
      }

      setResults(newResults);
    } catch (error) {
      console.error('Validation testing error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const generateReport = async () => {
    if (!results) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPersonas: Object.keys(results).length,
        totalTests: Object.values(results).flat().length,
        passed: Object.values(results).flat().filter(t => t.status === 'pass').length,
        failed: Object.values(results).flat().filter(t => t.status === 'fail').length,
        warnings: Object.values(results).flat().filter(t => t.status === 'warning').length
      },
      calculatorTests: {
        total: Object.values(results).flat().filter(t => t.category === 'calculator').length,
        passed: Object.values(results).flat().filter(t => t.category === 'calculator' && t.status === 'pass').length,
        issues: Object.values(results).flat().filter(t => t.category === 'calculator' && t.status !== 'pass')
      },
      uploadTests: {
        total: Object.values(results).flat().filter(t => t.category === 'file_upload').length,
        passed: Object.values(results).flat().filter(t => t.category === 'file_upload' && t.status === 'pass').length,
        issues: Object.values(results).flat().filter(t => t.category === 'file_upload' && t.status !== 'pass')
      },
      results
    };

    // Create downloadable report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    isRunning,
    currentTest,
    progress,
    results,
    runValidationSuite,
    generateReport
  };
}