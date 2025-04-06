import { ApiEndpointDiagnosticResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';
import { ApiFinancialPlanService } from "@/services/financial-plans/ApiFinancialPlanService";

// Add UUID to API diagnostics function
export const addUuidToApiDiagnostics = (result: Partial<ApiEndpointDiagnosticResult>): ApiEndpointDiagnosticResult => {
  return {
    id: uuidv4(),
    ...result
  } as ApiEndpointDiagnosticResult;
};

// Function to validate the schema of the API response
const validateApiResponseSchema = (expectedSchema: any, actualData: any): { valid: boolean; expected: any; actual: any; errors: string[] } => {
  const errors: string[] = [];
  let valid = true;

  // Basic validation - check if the keys in expectedSchema exist in actualData
  for (const key in expectedSchema) {
    if (!(key in actualData)) {
      valid = false;
      errors.push(`Missing property: ${key}`);
    }
  }

  return { valid, expected: expectedSchema, actual: actualData, errors };
};

// Mock API diagnostics
export const testApiEndpoints = async (): Promise<ApiEndpointDiagnosticResult[]> => {
  // Simulated async call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const financialPlanService = new ApiFinancialPlanService();
  
  const results: ApiEndpointDiagnosticResult[] = [];
  
  // Test Case 1: Successful API Call
  results.push(addUuidToApiDiagnostics({
    name: "Get User Profile",
    url: "/api/users/profile",
    method: "GET",
    status: "success",
    responseTime: 120,
    responseStatus: 200,
    expectedDataStructure: "UserProfile",
    schemaValidation: {
      valid: true,
      expected: { id: 'string', name: 'string', email: 'string' },
      actual: { id: '123', name: 'John Doe', email: 'john@example.com' },
      errors: []
    }
  }));
  
  // Test Case 2: Successful API Call
  results.push(addUuidToApiDiagnostics({
    name: "Search Products",
    url: "/api/products/search",
    method: "GET",
    status: "success",
    responseTime: 350,
    responseStatus: 200,
    expectedDataStructure: "ProductList",
    schemaValidation: {
      valid: true,
      expected: { items: 'array', total: 'number', page: 'number' },
      actual: { items: [], total: 0, page: 1 },
      errors: []
    }
  }));
  
  // Test Case 3: API Endpoint Not Available
  results.push(addUuidToApiDiagnostics({
    name: "Get Latest News",
    url: "/api/news/latest",
    method: "GET",
    status: "warning",
    responseTime: 0,
    errorMessage: "Endpoint not implemented",
    expectedDataStructure: "NewsArticle",
    schemaValidation: {
      expected: { title: 'string', content: 'string', date: 'string' },
      actual: null,
      valid: false,
      errors: ["Endpoint not implemented"]
    }
  }));
  
  // Test Case 4: API Returns Error
  results.push(addUuidToApiDiagnostics({
    name: "Submit Contact Form",
    url: "/api/contact/submit",
    method: "POST",
    status: "warning",
    responseTime: 500,
    errorMessage: "Internal server error",
    expectedDataStructure: "SubmissionResult",
    schemaValidation: {
      expected: { success: 'boolean', message: 'string' },
      actual: null,
      valid: false,
      errors: ["Internal server error"]
    }
  }));
  
  // Test Case 5: Slow API Response
  results.push(addUuidToApiDiagnostics({
    name: "Generate Report",
    url: "/api/reports/generate",
    method: "GET",
    status: "warning",
    responseTime: 2500,
    errorMessage: "Response time exceeds threshold",
    expectedDataStructure: "ReportData",
    schemaValidation: {
      expected: { reportId: 'string', data: 'object' },
      actual: null,
      valid: false,
      errors: ["Response time exceeds threshold"]
    }
  }));
  
  // Test Case 6: API with Authentication Required
  results.push(addUuidToApiDiagnostics({
    name: "Get User Settings",
    url: "/api/settings/user",
    method: "GET",
    status: "warning",
    responseTime: 400,
    errorMessage: "Unauthorized access",
    expectedDataStructure: "UserSettings",
    schemaValidation: {
      expected: { theme: 'string', notificationsEnabled: 'boolean' },
      actual: null,
      valid: false,
      errors: ["Unauthorized access"]
    }
  }));
  
  try {
    // Test Case 7: Financial Plans API - Success
    const financialPlans = await financialPlanService.getPlans();
    const schemaValidation = validateApiResponseSchema({ plans: 'array' }, financialPlans);
    
    results.push(addUuidToApiDiagnostics({
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: schemaValidation.valid ? "success" : "warning",
      responseTime: 300,
      responseStatus: 200,
      expectedDataStructure: "FinancialPlansList",
      schemaValidation: schemaValidation
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "API implementation not yet available",
      expectedDataStructure: "FinancialPlansList",
      schemaValidation: {
        valid: false,
        expected: { plans: 'array' },
        actual: null,
        errors: [error.message || "API implementation not yet available"]
      }
    }));
  }
  
  try {
    // Test Case 8: Financial Plan By ID - Success
    const planId = '123';
    const financialPlan = await financialPlanService.getPlanById(planId);
    
    const schemaValidation = validateApiResponseSchema({ id: 'string', name: 'string', assets: 'array' }, financialPlan);
    
    let status: "success" | "warning" = "success";
    if (!schemaValidation.valid) {
      status = "warning";
    }
    
    results.push(addUuidToApiDiagnostics({
      name: "Get Financial Plan By ID",
      url: `/api/financial-plans/${planId}`,
      method: "GET",
      status: status,
      responseTime: 250,
      responseStatus: 200,
      expectedDataStructure: "FinancialPlan",
      schemaValidation: {
        valid: schemaValidation.valid,
        expected: { id: 'string', name: 'string', assets: 'array' },
        actual: financialPlan,
        errors: schemaValidation.errors
      }
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Get Financial Plan By ID",
      url: "/api/financial-plans/{id}",
      method: "GET",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "API implementation not yet available",
      expectedDataStructure: "FinancialPlan",
      schemaValidation: {
        valid: false,
        expected: { id: 'string', name: 'string', assets: 'array' },
        actual: null,
        errors: [error.message || "API implementation not yet available"]
      }
    }));
  }
  
  // Mock function to simulate creating a document
  const createDocument = async (documentData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate success response
    return {
      id: uuidv4(),
      ...documentData,
      type: 'pdf'
    };
  };
  
  // Test Case 9: Create Document - Success
  try {
    const newDocumentData = {
      name: "Sample Document",
      size: 1024,
      category: "general"
    };
    
    const createdDocument = await createDocument(newDocumentData);
    
    const schemaValidation = validateApiResponseSchema({
      id: 'string',
      name: 'string',
      size: 'number',
      category: 'string',
      type: 'string'
    }, createdDocument);
    
    results.push(addUuidToApiDiagnostics({
      name: "Create Document",
      url: "/api/documents/create",
      method: "POST",
      status: "success",
      responseTime: 300,
      responseStatus: 201,
      expectedDataStructure: "Document",
      schemaValidation: {
        valid: schemaValidation.valid,
        expected: { id: 'string', name: 'string', size: 'number', category: 'string', type: 'string' },
        actual: createdDocument,
        errors: schemaValidation.errors
      }
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Create Document",
      url: "/api/documents/create",
      method: "POST",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "Failed to create document",
      expectedDataStructure: "Document",
      schemaValidation: {
        valid: false,
        expected: { id: 'string', name: 'string', size: 'number', category: 'string', type: 'string' },
        actual: null,
        errors: [error.message || "Failed to create document"]
      }
    }));
  }
  
  // Mock function to simulate getting user profile
  const getUserProfile = async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate success response
    return {
      id: userId,
      name: "Test User",
      email: "test@example.com",
      role: "admin"
    };
  };
  
  // Test Case 10: Get User Profile - Success
  try {
    const userId = "user123";
    const userProfile = await getUserProfile(userId);
    
    const schemaValidation = validateApiResponseSchema({
      id: 'string',
      name: 'string',
      email: 'string',
      role: 'string'
    }, userProfile);
    
    let status: "success" | "warning" = "success";
    if (!schemaValidation.valid) {
      status = "warning";
    }
    
    results.push(addUuidToApiDiagnostics({
      name: "Get User Profile",
      url: `/api/users/${userId}`,
      method: "GET",
      status: status,
      responseTime: 200,
      responseStatus: 200,
      expectedDataStructure: "UserProfile",
      schemaValidation: {
        valid: schemaValidation.valid,
        expected: { id: 'string', name: 'string', email: 'string', role: 'string' },
        actual: userProfile,
        errors: schemaValidation.errors
      }
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Get User Profile",
      url: "/api/users/{id}",
      method: "GET",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "Failed to get user profile",
      expectedDataStructure: "UserProfile",
      schemaValidation: {
        valid: false,
        expected: { id: 'string', name: 'string', email: 'string', role: 'string' },
        actual: null,
        errors: [error.message || "Failed to get user profile"]
      }
    }));
  }
  
  // Mock function to simulate updating settings
  const updateSettings = async (settingsData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate success response
    return {
      ...settingsData,
      updatedAt: new Date().toISOString()
    };
  };
  
  // Test Case 11: Update Settings - Success
  try {
    const settingsData = {
      theme: "dark",
      notificationsEnabled: true
    };
    
    const updatedSettings = await updateSettings(settingsData);
    
    const schemaValidation = validateApiResponseSchema({
      theme: 'string',
      notificationsEnabled: 'boolean',
      updatedAt: 'string'
    }, updatedSettings);
    
    let status: "success" | "warning" = "success";
    if (!schemaValidation.valid) {
      status = "warning";
    }
    
    results.push(addUuidToApiDiagnostics({
      name: "Update Settings",
      url: "/api/settings/update",
      method: "GET",
      status: status,
      responseTime: 400,
      responseStatus: 200,
      expectedDataStructure: "Settings",
      schemaValidation: {
        valid: schemaValidation.valid,
        expected: { theme: 'string', notificationsEnabled: 'boolean', updatedAt: 'string' },
        actual: updatedSettings,
        errors: schemaValidation.errors
      }
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Update Settings",
      url: "/api/settings/update",
      method: "GET",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "Failed to update settings",
      expectedDataStructure: "Settings",
      schemaValidation: {
        valid: false,
        expected: { theme: 'string', notificationsEnabled: 'boolean', updatedAt: 'string' },
        actual: null,
        errors: [error.message || "Failed to update settings"]
      }
    }));
  }
  
  // Mock function to simulate deleting a document
  const deleteDocument = async (documentId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Simulate success response
    return {
      success: true,
      message: `Document ${documentId} deleted successfully`
    };
  };
  
  // Test Case 12: Delete Document - Success
  try {
    const documentId = "doc123";
    const deletionResult = await deleteDocument(documentId);
    
    const schemaValidation = validateApiResponseSchema({
      success: 'boolean',
      message: 'string'
    }, deletionResult);
    
    let status: "success" | "warning" = "success";
    if (!schemaValidation.valid) {
      status = "warning";
    }
    
    results.push(addUuidToApiDiagnostics({
      name: "Delete Document",
      url: `/api/documents/${documentId}`,
      method: "GET",
      status: status,
      responseTime: 250,
      responseStatus: 200,
      expectedDataStructure: "DeletionResult",
      schemaValidation: {
        valid: schemaValidation.valid,
        expected: { success: 'boolean', message: 'string' },
        actual: deletionResult,
        errors: schemaValidation.errors
      }
    }));
  } catch (error: any) {
    results.push(addUuidToApiDiagnostics({
      name: "Delete Document",
      url: "/api/documents/{id}",
      method: "GET",
      status: "warning",
      responseTime: 0,
      responseStatus: 500,
      errorMessage: error.message || "Failed to delete document",
      expectedDataStructure: "DeletionResult",
      schemaValidation: {
        valid: false,
        expected: { success: 'boolean', message: 'string' },
        actual: null,
        errors: [error.message || "Failed to delete document"]
      }
    }));
  }
  
  return results;
};
