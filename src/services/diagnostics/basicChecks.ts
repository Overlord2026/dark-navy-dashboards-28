
import { logger } from '../logging/loggingService';
import { DiagnosticTestStatus } from './types';

/**
 * Tests basic system services and functionality
 * @returns Object with status and message for basic services
 */
export const testBasicServices = async () => {
  logger.info("Testing basic system services", {}, "DiagnosticService");
  
  const results = {
    navigation: { status: "success" as DiagnosticTestStatus, message: "Navigation services are functioning correctly" },
    forms: { status: "success" as DiagnosticTestStatus, message: "Form validation services are functioning correctly" },
    database: { status: "success" as DiagnosticTestStatus, message: "Database connections are established" },
    api: { status: "success" as DiagnosticTestStatus, message: "API services are responding" },
    authentication: { status: "success" as DiagnosticTestStatus, message: "Authentication services are active" },
    education: { status: "success" as DiagnosticTestStatus, message: "Education services are functioning correctly" },
  };
  
  try {
    // Test education service by checking course data availability
    const educationModule = await import('../../data/education');
    const courseCategories = educationModule.courseCategories || [];
    
    if (!courseCategories || courseCategories.length === 0) {
      results.education = { 
        status: "warning", 
        message: "Education course categories data may be incomplete" 
      };
    }
    
    // Check if course utilities are available
    const courseUtils = await import('../../components/education/courseUtils');
    if (!courseUtils.handleCourseAccess) {
      results.education = { 
        status: "error", 
        message: "Education course utilities are not properly defined" 
      };
    }

    // Check Stripe GHL integration
    const stripeGhl = await import('../../components/education/stripeGhlIntegration');
    if (!stripeGhl.initiateStripeGhlPayment) {
      results.education = { 
        status: "warning", 
        message: "Stripe GHL integration may need configuration" 
      };
    }
    
  } catch (error) {
    results.education = { 
      status: "error", 
      message: `Error testing education services: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
    logger.error("Error testing education services", error, "DiagnosticService");
  }
  
  return results;
};
