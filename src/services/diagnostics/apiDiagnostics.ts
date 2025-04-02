import { ApiIntegrationTestResult } from './types';
import { getFinancialPlanService, ServiceImplementation } from '../financial-plans/FinancialPlanServiceFactory';
import { ApiFinancialPlanService } from '../financial-plans/ApiFinancialPlanService';
import { logger } from '../logging/loggingService';

/**
 * Interface for API endpoint diagnostic results
 */
export interface ApiEndpointDiagnostic {
  name: string;
  url: string;
  method: string;
  status: 'success' | 'warning' | 'error';
  responseTime: number;
  responseStatus?: number;
  responseSize?: number;
  errorMessage?: string;
  expectedDataStructure: string;
  actualDataStructure?: string;
  structureMatch?: boolean;
  authStatus?: 'valid' | 'invalid' | 'expired' | 'missing';
}

/**
 * Test all API endpoints in the application
 * 
 * This function attempts to make real API calls to each endpoint
 * used in the application and verifies that the responses match
 * what the front-end expects.
 */
export const testApiEndpoints = async (): Promise<ApiEndpointDiagnostic[]> => {
  logger.info("Running API endpoint diagnostics", undefined, "ApiDiagnostics");
  
  const results: ApiEndpointDiagnostic[] = [];
  
  // Test Financial Planning API endpoints
  try {
    await testFinancialPlanningEndpoints(results);
  } catch (error) {
    logger.error("Error testing financial planning endpoints", error, "ApiDiagnostics");
  }
  
  // Here you would add tests for other API categories:
  // - Authentication APIs
  // - User Profile APIs
  // - Document APIs
  // - etc.
  
  return results;
};

/**
 * Test financial planning API endpoints
 * 
 * This function tests all endpoints related to financial planning.
 * It temporarily switches the service implementation to API mode
 * to force real API calls instead of using local storage.
 */
const testFinancialPlanningEndpoints = async (results: ApiEndpointDiagnostic[]): Promise<void> => {
  // Keep track of original implementation to restore it later
  let originalImplementation: ServiceImplementation = 'LOCAL';
  
  try {
    // Get the API service implementation
    const apiService = new ApiFinancialPlanService();
    
    // Test the getPlans endpoint
    await testApiEndpoint({
      name: "Get Financial Plans",
      url: "https://api.example.com/financial-plans/plans", // This will be replaced with actual URL
      method: "GET",
      expectedDataStructure: "Array<FinancialPlan>",
      testFunction: async () => {
        try {
          const startTime = performance.now();
          let response = null;
          
          try {
            response = await apiService.getPlans();
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            return {
              status: 'success',
              responseTime,
              actualDataStructure: Array.isArray(response) ? "Array<FinancialPlan>" : typeof response,
              structureMatch: Array.isArray(response)
            };
          } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            // Check if it's an "API implementation not yet available" error
            if (error instanceof Error && error.message.includes("API implementation not yet available")) {
              return {
                status: 'warning',
                responseTime,
                errorMessage: "API implementation not yet available - this is expected during development",
              };
            }
            
            return {
              status: 'error',
              responseTime,
              errorMessage: error instanceof Error ? error.message : String(error),
            };
          }
        } catch (error) {
          return {
            status: 'error',
            responseTime: 0,
            errorMessage: error instanceof Error ? error.message : String(error),
          };
        }
      }
    }, results);
    
    // Test the getPlanById endpoint
    await testApiEndpoint({
      name: "Get Financial Plan by ID",
      url: "https://api.example.com/financial-plans/plans/{id}", // This will be replaced with actual URL
      method: "GET",
      expectedDataStructure: "FinancialPlan | null",
      testFunction: async () => {
        try {
          const startTime = performance.now();
          let response = null;
          
          try {
            // Use a test ID that will likely not exist but is valid format
            response = await apiService.getPlanById("test-plan-id-12345");
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            return {
              status: 'success',
              responseTime,
              actualDataStructure: response === null ? "null" : "FinancialPlan",
              structureMatch: response === null || (typeof response === 'object')
            };
          } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            // Check if it's an "API implementation not yet available" error
            if (error instanceof Error && error.message.includes("API implementation not yet available")) {
              return {
                status: 'warning',
                responseTime,
                errorMessage: "API implementation not yet available - this is expected during development",
              };
            }
            
            return {
              status: 'error',
              responseTime,
              errorMessage: error instanceof Error ? error.message : String(error),
            };
          }
        } catch (error) {
          return {
            status: 'error',
            responseTime: 0,
            errorMessage: error instanceof Error ? error.message : String(error),
          };
        }
      }
    }, results);
    
    // Additional financial planning endpoints would be tested here
    
  } catch (error) {
    logger.error("Error in financial planning API diagnostics", error, "ApiDiagnostics");
  }
};

/**
 * Test a single API endpoint
 */
interface ApiEndpointTestOptions {
  name: string;
  url: string;
  method: string;
  expectedDataStructure: string;
  testFunction: () => Promise<{
    status: 'success' | 'warning' | 'error';
    responseTime: number;
    responseStatus?: number;
    actualDataStructure?: string;
    structureMatch?: boolean;
    errorMessage?: string;
    authStatus?: 'valid' | 'invalid' | 'expired' | 'missing';
  }>;
}

/**
 * Test a single API endpoint and add the result to the results array
 */
const testApiEndpoint = async (
  options: ApiEndpointTestOptions,
  results: ApiEndpointDiagnostic[]
): Promise<void> => {
  try {
    logger.info(`Testing API endpoint: ${options.name}`, { url: options.url }, "ApiDiagnostics");
    
    const testResult = await options.testFunction();
    
    results.push({
      name: options.name,
      url: options.url,
      method: options.method,
      expectedDataStructure: options.expectedDataStructure,
      ...testResult
    });
    
    logger.info(
      `API endpoint test completed: ${options.name}`,
      { status: testResult.status },
      "ApiDiagnostics"
    );
  } catch (error) {
    logger.error(
      `Error testing API endpoint: ${options.name}`,
      error,
      "ApiDiagnostics"
    );
    
    results.push({
      name: options.name,
      url: options.url,
      method: options.method,
      status: 'error',
      responseTime: 0,
      expectedDataStructure: options.expectedDataStructure,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
};
