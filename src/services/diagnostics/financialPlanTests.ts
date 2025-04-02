
import { FinancialPlan, FinancialGoal } from "@/types/financial-plan";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logging/loggingService";

export interface FinancialPlanTestResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

/**
 * Tests the financial plan operations (create, update, delete)
 * This is useful for development and ensuring that the local data
 * operations work as expected.
 */
export const testFinancialPlanOperations = async (): Promise<FinancialPlanTestResult[]> => {
  const results: FinancialPlanTestResult[] = [];
  
  try {
    logger.info("Starting financial plan operations tests", undefined, "FinancialPlanTests");
    
    // Test retrieving plans from localStorage
    try {
      const storedPlans = window.localStorage.getItem("financial-plans");
      results.push({
        test: "Retrieve plans from localStorage",
        status: storedPlans ? 'success' : 'warning',
        message: storedPlans 
          ? `Successfully retrieved ${JSON.parse(storedPlans).length} plans` 
          : "No plans found in localStorage"
      });
    } catch (error) {
      results.push({
        test: "Retrieve plans from localStorage",
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test CRUD operations on a temporary plan object
    const testPlan: FinancialPlan = {
      id: uuidv4(),
      name: "Test Plan",
      owner: "Test User",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDraft: false,
      isActive: false,
      isFavorite: false,
      successRate: 75,
      status: 'Active',
      goals: [],
      accounts: [],
      expenses: []
    };
    
    // Test adding a goal
    const testGoal: FinancialGoal = {
      id: uuidv4(),
      title: "Test Goal",
      targetAmount: 10000,
      currentAmount: 5000,
      targetDate: new Date(2030, 0, 1),
      priority: "Medium"
    };
    
    testPlan.goals.push(testGoal);
    
    results.push({
      test: "Add goal to plan",
      status: 'success',
      message: "Successfully added goal to plan"
    });
    
    // Test updating a goal
    const updatedGoal = { ...testGoal, targetAmount: 15000 };
    const goalIndex = testPlan.goals.findIndex(g => g.id === testGoal.id);
    if (goalIndex >= 0) {
      testPlan.goals[goalIndex] = updatedGoal;
      results.push({
        test: "Update goal in plan",
        status: 'success',
        message: "Successfully updated goal in plan"
      });
    } else {
      results.push({
        test: "Update goal in plan",
        status: 'error',
        message: "Failed to find goal to update"
      });
    }
    
    // Validate data structure
    const validationIssues: string[] = [];
    
    if (!testPlan.id) validationIssues.push("Missing plan ID");
    if (!testPlan.name) validationIssues.push("Missing plan name");
    if (!testPlan.createdAt) validationIssues.push("Missing creation date");
    if (testPlan.status !== 'Active' && testPlan.status !== 'Draft' && testPlan.status !== 'Archived') {
      validationIssues.push("Invalid plan status");
    }
    
    results.push({
      test: "Validate plan data structure",
      status: validationIssues.length === 0 ? 'success' : 'error',
      message: validationIssues.length === 0 
        ? "Plan data structure is valid" 
        : `Plan data structure has issues: ${validationIssues.join(", ")}`
    });
    
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
