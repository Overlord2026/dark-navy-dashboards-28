
import { logger } from '../logging/loggingService';
import { DiagnosticResult } from './types';

export const testBasicServices = async (): Promise<Record<string, DiagnosticResult>> => {
  // Simulate actual tests to the services
  const databaseStatus: DiagnosticResult = {
    name: "Database Connection",
    description: "Tests connectivity to the main database",
    status: "success",
    message: "Database connection successful"
  };
  
  try {
    // Simulate a potential warning situation
    // In a real app, this would be an actual check
    const isCacheSlow = Math.random() > 0.7;
    const cacheStatus: DiagnosticResult = isCacheSlow 
      ? {
          name: "Cache Service",
          description: "Tests connectivity and performance of the cache service",
          status: "warning",
          message: "Cache service is responding slowly",
          details: "Response time above normal threshold: 1500ms"
        }
      : {
          name: "Cache Service",
          description: "Tests connectivity and performance of the cache service",
          status: "success",
          message: "Cache service is functioning normally"
        };
        
    // Authentication service test
    const authStatus: DiagnosticResult = {
      name: "Authentication Service",
      description: "Tests connectivity to the authentication service",
      status: "success",
      message: "Authentication service is available"
    };
    
    // File storage service test
    // Simulate a warning for file storage service
    const isStorageWarning = Math.random() > 0.7;
    const fileStorageStatus: DiagnosticResult = isStorageWarning
      ? {
          name: "File Storage Service",
          description: "Tests connectivity to the file storage service",
          status: "warning",
          message: "File storage service is nearing capacity",
          details: "Storage usage at 85%, consider increasing limit or cleaning unused files"
        }
      : {
          name: "File Storage Service",
          description: "Tests connectivity to the file storage service",
          status: "success",
          message: "File storage service is available"
        };
        
    // API Gateway test
    const apiGatewayStatus: DiagnosticResult = {
      name: "API Gateway",
      description: "Tests connectivity to the API gateway",
      status: "success",
      message: "API Gateway is functioning normally"
    };

    // Log the basic service check results
    logger.info("Basic service checks completed", { 
      databaseStatus: databaseStatus.status,
      cacheStatus: cacheStatus.status,
      authStatus: authStatus.status,
      fileStorageStatus: fileStorageStatus.status,
      apiGatewayStatus: apiGatewayStatus.status
    }, "DiagnosticService");
    
    // Return all test results
    return {
      databaseStatus,
      cacheStatus,
      authStatus,
      fileStorageStatus,
      apiGatewayStatus
    };
  } catch (error) {
    // Log the error
    logger.error("Error during basic service checks", error, "DiagnosticService");
    
    // Return error status for all services
    return {
      databaseStatus: {
        name: "Database Connection",
        description: "Tests connectivity to the main database",
        status: "error",
        message: "Failed to check database status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      cacheStatus: {
        name: "Cache Service",
        description: "Tests connectivity and performance of the cache service",
        status: "error",
        message: "Failed to check cache service status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      authStatus: {
        name: "Authentication Service",
        description: "Tests connectivity to the authentication service",
        status: "error",
        message: "Failed to check authentication service status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      fileStorageStatus: {
        name: "File Storage Service",
        description: "Tests connectivity to the file storage service",
        status: "error",
        message: "Failed to check file storage service status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      apiGatewayStatus: {
        name: "API Gateway",
        description: "Tests connectivity to the API gateway",
        status: "error",
        message: "Failed to check API gateway status",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
};
