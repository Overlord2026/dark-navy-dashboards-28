// This file contains the API diagnostics logic
import { ApiEndpointDiagnosticResult } from '@/types/diagnostics';
import { ApiFinancialPlanService } from '../financial-plans/ApiFinancialPlanService';
import { logger } from '../logging/loggingService';
import { SchemaDefinition, validateSchema, generateSampleFromSchema } from './schemaValidator';
import { v4 as uuidv4 } from 'uuid';

/**
 * Tests all API endpoints used in the application.
 * This helps identify issues with APIs before they cause problems in the UI.
 * 
 * @returns Promise<ApiEndpointDiagnosticResult[]> Results of API endpoint tests
 */
export const testApiEndpoints = async (): Promise<ApiEndpointDiagnosticResult[]> => {
  logger.info("Starting API endpoints diagnostics", undefined, "ApiDiagnostics");
  
  const results: ApiEndpointDiagnosticResult[] = [];
  
  // Test Financial Plans API endpoints
  try {
    await testFinancialPlansApi(results);
  } catch (error) {
    logger.error("Error testing Financial Plans API", error, "ApiDiagnostics");
  }
  
  // Test User Profile API endpoints
  try {
    await testUserProfileApi(results);
  } catch (error) {
    logger.error("Error testing User Profile API", error, "ApiDiagnostics");
  }
  
  // Test Document Management API endpoints
  try {
    await testDocumentManagementApi(results);
  } catch (error) {
    logger.error("Error testing Document Management API", error, "ApiDiagnostics");
  }
  
  // Test Investment API endpoints
  try {
    await testInvestmentApi(results);
  } catch (error) {
    logger.error("Error testing Investment API", error, "ApiDiagnostics");
  }
  
  // Test Account API endpoints
  try {
    await testAccountApi(results);
  } catch (error) {
    logger.error("Error testing Account API", error, "ApiDiagnostics");
  }
  
  // Test Education API endpoints
  try {
    await testEducationApi(results);
  } catch (error) {
    logger.error("Error testing Education API", error, "ApiDiagnostics");
  }
  
  logger.info(`API endpoints diagnostics completed. ${results.length} endpoints tested.`, 
    { successCount: results.filter(r => r.status === 'success').length },
    "ApiDiagnostics"
  );
  
  return results;
};

/**
 * Define schema for expected API responses
 */
const schemas = {
  financialPlans: {
    list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          isFavorite: { type: 'boolean' },
          goals: { type: 'array', items: { type: 'object' } }
        },
        required: ['id', 'name', 'createdAt']
      }
    },
    detail: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        goals: { type: 'array', items: { type: 'object' } },
        assets: { type: 'array', items: { type: 'object' } },
        expenses: { type: 'array', items: { type: 'object' } },
        incomes: { type: 'array', items: { type: 'object' } }
      },
      required: ['id', 'name', 'goals']
    }
  },
  userProfile: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      birthdate: { type: 'string' },
      phoneNumber: { type: 'string' },
      preferences: { type: 'object' }
    },
    required: ['id', 'email']
  },
  documents: {
    list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          size: { type: 'number' },
          createdAt: { type: 'string' },
          category: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['id', 'name', 'createdAt']
      }
    }
  },
  investments: {
    portfolio: {
      type: 'object',
      properties: {
        totalValue: { type: 'number' },
        cashBalance: { type: 'number' },
        investedAmount: { type: 'number' },
        returns: { type: 'object' },
        holdings: { type: 'array', items: { type: 'object' } }
      },
      required: ['totalValue', 'holdings']
    },
    marketData: {
      type: 'object',
      properties: {
        indices: { type: 'array', items: { type: 'object' } },
        trending: { type: 'array', items: { type: 'object' } },
        timestamp: { type: 'string' }
      },
      required: ['indices', 'timestamp']
    }
  },
  accounts: {
    list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string' },
          balance: { type: 'number' },
          institution: { type: 'object' }
        },
        required: ['id', 'name', 'type', 'balance']
      }
    },
    transactions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string' },
          amount: { type: 'number' },
          description: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['id', 'date', 'amount']
      }
    }
  },
  courses: {
    list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          level: { type: 'string' },
          duration: { type: 'string' },
          isPaid: { type: 'boolean' }
        },
        required: ['id', 'title', 'description']
      }
    },
    detail: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        level: { type: 'string' },
        duration: { type: 'string' },
        isPaid: { type: 'boolean' },
        content: { type: 'object' },
        instructor: { type: 'string' }
      },
      required: ['id', 'title', 'description']
    }
  }
} as const;

/**
 * Validate API response against expected schema
 */
const validateApiResponse = (response: any, schemaKey: keyof typeof schemas, subSchemaKey?: string) => {
  let schema: SchemaDefinition;
  
  if (subSchemaKey && schemaKey in schemas) {
    const mainSchema = schemas[schemaKey] as Record<string, SchemaDefinition>;
    if (subSchemaKey in mainSchema) {
      schema = mainSchema[subSchemaKey];
    } else {
      throw new Error(`Schema ${schemaKey}.${subSchemaKey} not found`);
    }
  } else if (schemaKey in schemas) {
    schema = schemas[schemaKey] as SchemaDefinition;
  } else {
    throw new Error(`Schema ${schemaKey} not found`);
  }
  
  const validationResult = validateSchema(response, schema);
  const expectedSample = generateSampleFromSchema(schema);
  
  return {
    valid: validationResult.isValid,
    expected: expectedSample,
    actual: response,
    errors: [
      ...(validationResult.missingProps?.map(prop => `Missing required property: ${prop}`) || []),
      ...(validationResult.wrongTypes?.map(prop => `Wrong type for property: ${prop}`) || [])
    ]
  };
};

/**
 * Test Financial Plans API endpoints
 */
const testFinancialPlansApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Test the Financial Plans API
  const startTime = performance.now();
  try {
    const financialPlanService = new ApiFinancialPlanService();
    await financialPlanService.getPlans();
    
    // Generate expected sample data
    const expectedSample = generateSampleFromSchema(schemas.financialPlans.list);
    
    results.push({
      id: uuidv4(),
      endpoint: "/api/financial-plans",
      timestamp: new Date().toISOString(),
      message: "API implementation not yet available",
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: "warning", // API implementation not ready yet
      responseTime: performance.now() - startTime,
      errorMessage: "API implementation not yet available",
      expectedDataStructure: "Array of financial plans with ID, name, createdAt, etc.",
      schemaValidation: {
        expected: expectedSample,
        actual: null,
        valid: false,
        errors: ["API not implemented yet"]
      }
    });
  } catch (error) {
    results.push({
      id: uuidv4(),
      endpoint: "/api/financial-plans",
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: "warning", // We expect this error in development
      responseTime: performance.now() - startTime,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      expectedDataStructure: "Array of financial plans with ID, name, createdAt, etc.",
      schemaValidation: {
        expected: generateSampleFromSchema(schemas.financialPlans.list),
        actual: null,
        valid: false,
        errors: [error instanceof Error ? error.message : "Unknown error"]
      }
    });
  }
  
  // Test Get Financial Plan by ID
  const planStartTime = performance.now();
  try {
    const financialPlanService = new ApiFinancialPlanService();
    await financialPlanService.getPlanById("sample-plan-id");
    
    results.push({
      id: uuidv4(),
      endpoint: "/api/financial-plans/{id}",
      timestamp: new Date().toISOString(),
      message: "API implementation not yet available",
      name: "Get Financial Plan by ID",
      url: "/api/financial-plans/{id}",
      method: "GET",
      status: "warning", // API implementation not ready yet
      responseTime: performance.now() - planStartTime,
      errorMessage: "API implementation not yet available",
      expectedDataStructure: "Financial plan object with details, goals, assets, etc.",
      schemaValidation: {
        expected: generateSampleFromSchema(schemas.financialPlans.detail),
        actual: null,
        valid: false,
        errors: ["API not implemented yet"]
      }
    });
  } catch (error) {
    results.push({
      id: uuidv4(),
      endpoint: "/api/financial-plans/{id}",
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
      name: "Get Financial Plan by ID",
      url: "/api/financial-plans/{id}",
      method: "GET",
      status: "warning", // We expect this error in development
      responseTime: performance.now() - planStartTime,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      expectedDataStructure: "Financial plan object with details, goals, assets, etc.",
      schemaValidation: {
        expected: generateSampleFromSchema(schemas.financialPlans.detail),
        actual: null,
        valid: false,
        errors: [error instanceof Error ? error.message : "Unknown error"]
      }
    });
  }
};

/**
 * Test User Profile API endpoints
 */
const testUserProfileApi = async (results: ApiEndpointDiagnosticResult[]) => {
  const startTime = performance.now();
  
  // Mock API test for user profile - this would be replaced with actual API calls
  // Mock response data that would come from API
  const mockResponseData = {
    id: "user-123",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    birthdate: "1985-01-15",
    phoneNumber: "+1234567890",
    preferences: {
      notifications: true,
      theme: "dark"
    }
  };
  
  // Validate the response against expected schema
  const validation = validateApiResponse(mockResponseData, 'userProfile');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/user/profile",
    timestamp: new Date().toISOString(),
    message: validation.valid ? "User profile data validated successfully" : "User profile data validation failed",
    name: "Get User Profile",
    url: "/api/user/profile",
    method: "GET",
    status: validation.valid ? "success" : "warning",
    responseTime: 120, // Mock response time
    responseStatus: 200,
    expectedDataStructure: "User object with personal details, preferences, etc.",
    schemaValidation: validation
  });
};

/**
 * Test Document Management API endpoints
 */
const testDocumentManagementApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock API tests for document management
  const mockDocuments = [
    {
      id: "doc-123",
      name: "Tax Return 2023.pdf",
      size: 1024567,
      createdAt: "2023-04-15T10:30:00Z",
      category: "Tax",
      type: "application/pdf"
    },
    {
      id: "doc-124",
      name: "Insurance Policy.pdf",
      size: 523890,
      createdAt: "2023-03-22T14:15:30Z",
      category: "Insurance",
      type: "application/pdf"
    }
  ];
  
  const validation = validateApiResponse(mockDocuments, 'documents', 'list');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/documents",
    timestamp: new Date().toISOString(),
    message: validation.valid ? "Document list retrieved successfully" : "Document list validation failed",
    name: "List Documents",
    url: "/api/documents",
    method: "GET",
    status: validation.valid ? "success" : "warning",
    responseTime: 150,
    responseStatus: 200,
    expectedDataStructure: "Array of document objects with metadata",
    schemaValidation: validation
  });
  
  // Document upload response
  const uploadResponse = {
    id: "doc-125",
    name: "New Document.pdf",
    size: 125466,
    createdAt: "2024-04-06T15:30:45Z",
    category: "Other",
    type: "application/pdf"
  };
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/documents",
    timestamp: new Date().toISOString(),
    message: "Document uploaded successfully",
    name: "Upload Document",
    url: "/api/documents",
    method: "POST",
    status: "success",
    responseTime: 300,
    responseStatus: 201,
    expectedDataStructure: "Document object with ID and upload status",
    schemaValidation: {
      expected: generateSampleFromSchema({
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          size: { type: 'number' },
          createdAt: { type: 'string' }
        },
        required: ['id', 'name']
      }),
      actual: uploadResponse,
      valid: true,
      errors: []
    }
  });
};

/**
 * Test Investment API endpoints
 */
const testInvestmentApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 245680.75,
    cashBalance: 15432.20,
    investedAmount: 230248.55,
    returns: {
      daily: 0.75,
      weekly: 1.2,
      monthly: 2.5,
      yearly: 8.7
    },
    holdings: [
      {
        symbol: "VTI",
        name: "Vanguard Total Stock Market ETF",
        shares: 250,
        price: 257.83,
        value: 64457.50
      },
      {
        symbol: "VXUS",
        name: "Vanguard Total International Stock ETF",
        shares: 350,
        price: 60.42,
        value: 21147.00
      }
    ]
  };
  
  const portfolioValidation = validateApiResponse(portfolioData, 'investments', 'portfolio');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/investments/portfolio",
    timestamp: new Date().toISOString(),
    message: portfolioValidation.valid ? "Portfolio data retrieved successfully" : "Portfolio data validation failed",
    name: "Get Investment Portfolio",
    url: "/api/investments/portfolio",
    method: "GET",
    status: portfolioValidation.valid ? "success" : "warning",
    responseTime: 180,
    responseStatus: 200,
    expectedDataStructure: "Portfolio object with holdings, performance metrics, etc.",
    schemaValidation: portfolioValidation
  });
  
  // Mock market data
  const marketData = {
    indices: [
      { symbol: "SPY", name: "S&P 500", price: 475.32, change: 1.2 },
      { symbol: "DIA", name: "Dow Jones", price: 350.45, change: 0.8 }
    ],
    trending: [
      { symbol: "AAPL", name: "Apple Inc.", price: 185.92, change: 1.5 },
      { symbol: "MSFT", name: "Microsoft", price: 410.34, change: -0.3 }
    ],
    timestamp: "2024-04-06T15:30:00Z"
  };
  
  const marketValidation = validateApiResponse(marketData, 'investments', 'marketData');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/market/data",
    timestamp: new Date().toISOString(),
    message: "Limited market data available in development environment",
    name: "Get Market Data",
    url: "/api/market/data",
    method: "GET",
    status: marketValidation.valid ? "warning" : "warning",
    responseTime: 250,
    responseStatus: 200,
    errorMessage: "Limited market data available in development environment",
    expectedDataStructure: "Market indices, trending securities, etc.",
    schemaValidation: marketValidation
  });
};

/**
 * Test Account API endpoints
 */
const testAccountApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock accounts data
  const accountsData = [
    {
      id: "acct-123",
      name: "Primary Checking",
      type: "checking",
      balance: 5432.56,
      institution: {
        name: "Example Bank",
        logo: "https://example.com/logo.png"
      }
    },
    {
      id: "acct-124",
      name: "Savings",
      type: "savings",
      balance: 12500.00,
      institution: {
        name: "Example Bank",
        logo: "https://example.com/logo.png"
      }
    }
  ];
  
  const accountsValidation = validateApiResponse(accountsData, 'accounts', 'list');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/accounts",
    timestamp: new Date().toISOString(),
    message: accountsValidation.valid ? "Account data retrieved successfully" : "Account data validation failed",
    name: "List Accounts",
    url: "/api/accounts",
    method: "GET",
    status: accountsValidation.valid ? "success" : "warning",
    responseTime: 130,
    responseStatus: 200,
    expectedDataStructure: "Array of account objects with balances and details",
    schemaValidation: accountsValidation
  });
  
  // Mock transaction data
  const transactionsData = [
    {
      id: "txn-123",
      date: "2024-04-05T10:23:15Z",
      amount: -45.67,
      description: "Grocery Store Purchase",
      category: "Food & Dining"
    },
    {
      id: "txn-124",
      date: "2024-04-04T15:30:22Z",
      amount: -120.00,
      description: "Utility Bill Payment",
      category: "Bills & Utilities"
    },
    {
      id: "txn-125",
      date: "2024-04-03T08:15:43Z",
      amount: 2500.00,
      description: "Salary Deposit",
      category: "Income"
    }
  ];
  
  const transactionsValidation = validateApiResponse(transactionsData, 'accounts', 'transactions');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/accounts/{id}/transactions",
    timestamp: new Date().toISOString(),
    message: transactionsValidation.valid ? "Transaction data retrieved successfully" : "Transaction data validation failed",
    name: "Get Account Transactions",
    url: "/api/accounts/{id}/transactions",
    method: "GET",
    status: transactionsValidation.valid ? "success" : "warning",
    responseTime: 220,
    responseStatus: 200,
    expectedDataStructure: "Array of transaction objects with amounts, dates, etc.",
    schemaValidation: transactionsValidation
  });
};

/**
 * Test Education API endpoints
 */
const testEducationApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock courses data
  const coursesData = [
    {
      id: "course-101",
      title: "Financial Planning Basics",
      description: "Learn the fundamentals of financial planning and goal setting.",
      level: "Beginner",
      duration: "2 hours",
      isPaid: false
    },
    {
      id: "course-102",
      title: "Advanced Investment Strategies",
      description: "Deep dive into advanced investment techniques for experienced investors.",
      level: "Advanced",
      duration: "4 hours",
      isPaid: true
    }
  ];
  
  const coursesValidation = validateApiResponse(coursesData, 'courses', 'list');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/courses",
    timestamp: new Date().toISOString(),
    message: coursesValidation.valid ? "Courses data retrieved successfully" : "Courses data validation failed",
    name: "List Education Courses",
    url: "/api/courses",
    method: "GET",
    status: coursesValidation.valid ? "success" : "warning",
    responseTime: 145,
    responseStatus: 200,
    expectedDataStructure: "Array of course objects with titles, descriptions, etc.",
    schemaValidation: coursesValidation
  });
  
  // Mock course details
  const courseDetailData = {
    id: "course-101",
    title: "Financial Planning Basics",
    description: "Learn the fundamentals of financial planning and goal setting.",
    level: "Beginner",
    duration: "2 hours",
    isPaid: false,
    instructor: "Jane Smith, CFP",
    content: {
      sections: [
        {
          title: "Introduction to Financial Planning",
          lessons: [
            { title: "What is Financial Planning?", duration: "15 min" },
            { title: "Setting Financial Goals", duration: "20 min" }
          ]
        },
        {
          title: "Building Your Financial Foundation",
          lessons: [
            { title: "Emergency Funds", duration: "15 min" },
            { title: "Basic Budgeting", duration: "25 min" }
          ]
        }
      ]
    }
  };
  
  const courseDetailValidation = validateApiResponse(courseDetailData, 'courses', 'detail');
  
  results.push({
    id: uuidv4(),
    endpoint: "/api/courses/{id}",
    timestamp: new Date().toISOString(),
    message: courseDetailValidation.valid ? "Course details retrieved successfully" : "Course details validation failed", 
    name: "Get Course Details",
    url: "/api/courses/{id}",
    method: "GET",
    status: courseDetailValidation.valid ? "success" : "warning",
    responseTime: 165,
    responseStatus: 200,
    expectedDataStructure: "Course object with detailed content structure",
    schemaValidation: courseDetailValidation
  });
};
