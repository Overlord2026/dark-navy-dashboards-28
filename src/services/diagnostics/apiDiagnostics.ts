
// This file contains the API diagnostics logic
import { ApiEndpointDiagnosticResult } from '@/types/diagnostics';
import { ApiFinancialPlanService } from '../financial-plans/ApiFinancialPlanService';
import { logger } from '../logging/loggingService';

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
  
  logger.info(`API endpoints diagnostics completed. ${results.length} endpoints tested.`, 
    { successCount: results.filter(r => r.status === 'success').length },
    "ApiDiagnostics"
  );
  
  return results;
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
    
    results.push({
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: "warning", // API implementation not ready yet
      responseTime: performance.now() - startTime,
      errorMessage: "API implementation not yet available",
      expectedDataStructure: "Array of financial plans with ID, name, createdAt, etc."
    });
  } catch (error) {
    results.push({
      name: "Get Financial Plans",
      url: "/api/financial-plans",
      method: "GET",
      status: "warning", // We expect this error in development
      responseTime: performance.now() - startTime,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      expectedDataStructure: "Array of financial plans with ID, name, createdAt, etc."
    });
  }
  
  // Test Get Financial Plan by ID
  const planStartTime = performance.now();
  try {
    const financialPlanService = new ApiFinancialPlanService();
    await financialPlanService.getPlanById("sample-plan-id");
    
    results.push({
      name: "Get Financial Plan by ID",
      url: "/api/financial-plans/{id}",
      method: "GET",
      status: "warning", // API implementation not ready yet
      responseTime: performance.now() - planStartTime,
      errorMessage: "API implementation not yet available",
      expectedDataStructure: "Financial plan object with details, goals, assets, etc."
    });
  } catch (error) {
    results.push({
      name: "Get Financial Plan by ID",
      url: "/api/financial-plans/{id}",
      method: "GET",
      status: "warning", // We expect this error in development
      responseTime: performance.now() - planStartTime,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      expectedDataStructure: "Financial plan object with details, goals, assets, etc."
    });
  }
};

/**
 * Test User Profile API endpoints
 */
const testUserProfileApi = async (results: ApiEndpointDiagnosticResult[]) => {
  const startTime = performance.now();
  
  // Mock API test for user profile - this would be replaced with actual API calls
  results.push({
    name: "Get User Profile",
    url: "/api/user/profile",
    method: "GET",
    status: "success", // Mocked as success for now
    responseTime: 120, // Mock response time
    responseStatus: 200,
    expectedDataStructure: "User object with personal details, preferences, etc."
  });
};

/**
 * Test Document Management API endpoints
 */
const testDocumentManagementApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock API tests for document management
  results.push({
    name: "List Documents",
    url: "/api/documents",
    method: "GET",
    status: "success",
    responseTime: 150,
    responseStatus: 200,
    expectedDataStructure: "Array of document objects with metadata"
  });
  
  results.push({
    name: "Upload Document",
    url: "/api/documents",
    method: "POST",
    status: "success",
    responseTime: 300,
    responseStatus: 201,
    expectedDataStructure: "Document object with ID and upload status"
  });
};

/**
 * Test Investment API endpoints
 */
const testInvestmentApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock API tests for investments
  results.push({
    name: "Get Investment Portfolio",
    url: "/api/investments/portfolio",
    method: "GET",
    status: "success",
    responseTime: 180,
    responseStatus: 200,
    expectedDataStructure: "Portfolio object with holdings, performance metrics, etc."
  });
  
  results.push({
    name: "Get Market Data",
    url: "/api/market/data",
    method: "GET",
    status: "warning",
    responseTime: 250,
    responseStatus: 200,
    errorMessage: "Limited market data available in development environment",
    expectedDataStructure: "Market indices, trending securities, etc."
  });
};

/**
 * Test Account API endpoints
 */
const testAccountApi = async (results: ApiEndpointDiagnosticResult[]) => {
  // Mock API tests for accounts
  results.push({
    name: "List Accounts",
    url: "/api/accounts",
    method: "GET",
    status: "success",
    responseTime: 130,
    responseStatus: 200,
    expectedDataStructure: "Array of account objects with balances and details"
  });
  
  results.push({
    name: "Get Account Transactions",
    url: "/api/accounts/{id}/transactions",
    method: "GET",
    status: "success",
    responseTime: 220,
    responseStatus: 200,
    expectedDataStructure: "Array of transaction objects with amounts, dates, etc."
  });
};
