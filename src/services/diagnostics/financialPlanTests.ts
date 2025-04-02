
import { FinancialPlan, FinancialGoal } from "@/types/financial-plan";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logging/loggingService";
import { getFinancialPlanService } from "@/services/financial-plans/FinancialPlanServiceFactory";

export interface FinancialPlanTestResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

/**
 * Tests the financial plan operations (create, update, delete)
 * This is useful for development and ensuring that the data
 * operations work as expected regardless of implementation.
 */
export const testFinancialPlanOperations = async (): Promise<FinancialPlanTestResult[]> => {
  const results: FinancialPlanTestResult[] = [];
  const service = getFinancialPlanService();
  
  try {
    logger.info("Starting financial plan operations tests", undefined, "FinancialPlanTests");
    
    // Test retrieving plans
    try {
      const plans = await service.getPlans();
      results.push({
        test: "Retrieve plans",
        status: 'success',
        message: `Successfully retrieved ${plans.length} plans`
      });
    } catch (error) {
      results.push({
        test: "Retrieve plans",
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test CRUD operations on a temporary plan object
    // Create a test plan
    let testPlan: FinancialPlan;
    try {
      testPlan = await service.createPlan({
        name: "Test Plan",
        owner: "Test User",
        isDraft: false,
        isActive: false,
        isFavorite: false,
        successRate: 75,
        status: 'Active',
        goals: [],
        accounts: [],
        expenses: []
      });
      
      results.push({
        test: "Create plan",
        status: 'success',
        message: "Successfully created test plan"
      });
    } catch (error) {
      results.push({
        test: "Create plan",
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
      // Cannot continue without a plan
      return results;
    }
    
    // Test adding a goal
    const testGoal: FinancialGoal = {
      id: uuidv4(),
      title: "Test Goal",
      targetAmount: 10000,
      currentAmount: 5000,
      targetDate: new Date(2030, 0, 1),
      priority: "Medium"
    };
    
    try {
      const success = await service.updateGoal(testPlan.id, testGoal);
      if (success) {
        results.push({
          test: "Add goal to plan",
          status: 'success',
          message: "Successfully added goal to plan"
        });
      } else {
        results.push({
          test: "Add goal to plan",
          status: 'error',
          message: "Failed to add goal to plan"
        });
      }
    } catch (error) {
      results.push({
        test: "Add goal to plan",
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test updating a goal
    try {
      const updatedGoal = { ...testGoal, targetAmount: 15000 };
      const success = await service.updateGoal(testPlan.id, updatedGoal);
      
      if (success) {
        results.push({
          test: "Update goal in plan",
          status: 'success',
          message: "Successfully updated goal in plan"
        });
      } else {
        results.push({
          test: "Update goal in plan",
          status: 'error',
          message: "Failed to update goal"
        });
      }
    } catch (error) {
      results.push({
        test: "Update goal in plan",
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test deleting the plan (cleanup)
    try {
      const success = await service.deletePlan(testPlan.id);
      if (success) {
        results.push({
          test: "Delete plan",
          status: 'success',
          message: "Successfully deleted test plan"
        });
      } else {
        results.push({
          test: "Delete plan",
          status: 'warning',
          message: "Failed to delete test plan"
        });
      }
    } catch (error) {
      results.push({
        test: "Delete plan",
        status: 'warning',
        message: error instanceof Error ? error.message : String(error)
      });
    }
    
    logger.info("Financial plan operations tests completed", { 
      successCount: results.filter(r => r.status === 'success').length,
      warningCount: results.filter(r => r.status === 'warning').length,
      errorCount: results.filter(r => r.status === 'error').length
    }, "FinancialPlanTests");
    
    return results;
  } catch (error) {
    logger.error("Error running financial plan tests", error, "FinancialPlanTests");
    return [{
      test: "Financial plan operations",
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    }];
  }
};
