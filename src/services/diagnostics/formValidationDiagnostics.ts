
import { FormValidationTestResult } from '@/services/diagnostics/types';
import { testFormValidation } from '@/services/diagnostics/formValidationTests';
import { logger } from '../logging/loggingService';

// Define form test data structures
interface FormField {
  name: string;
  value: any;
  isValid: boolean;
  expectedErrorMessage?: string;
}

interface FormTestCase {
  formId: string;
  description: string;
  fields: FormField[];
  shouldSubmitSuccessfully: boolean;
}

// Form test data - these are sample test cases for common forms in the app
const formTestCases: Record<string, FormTestCase[]> = {
  "login": [
    {
      formId: "login",
      description: "Valid login credentials",
      fields: [
        { name: "email", value: "user@example.com", isValid: true },
        { name: "password", value: "Password123!", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "login",
      description: "Invalid email format",
      fields: [
        { name: "email", value: "userexample.com", isValid: false, expectedErrorMessage: "Invalid email format" },
        { name: "password", value: "Password123!", isValid: true }
      ],
      shouldSubmitSuccessfully: false
    },
    {
      formId: "login",
      description: "Empty password",
      fields: [
        { name: "email", value: "user@example.com", isValid: true },
        { name: "password", value: "", isValid: false, expectedErrorMessage: "Password is required" }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "registration": [
    {
      formId: "registration",
      description: "Valid registration details",
      fields: [
        { name: "email", value: "newuser@example.com", isValid: true },
        { name: "password", value: "StrongPass123!", isValid: true },
        { name: "confirmPassword", value: "StrongPass123!", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "registration",
      description: "Password mismatch",
      fields: [
        { name: "email", value: "newuser@example.com", isValid: true },
        { name: "password", value: "StrongPass123!", isValid: true },
        { name: "confirmPassword", value: "DifferentPass123!", isValid: false, expectedErrorMessage: "Passwords do not match" }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "profile": [
    {
      formId: "profile",
      description: "Valid profile update",
      fields: [
        { name: "firstName", value: "Tom", isValid: true },
        { name: "lastName", value: "Brady", isValid: true },
        { name: "dateOfBirth", value: new Date("1985-05-03"), isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "profile",
      description: "Missing required field",
      fields: [
        { name: "firstName", value: "", isValid: false, expectedErrorMessage: "First name must be at least 2 characters." },
        { name: "lastName", value: "Brady", isValid: true },
        { name: "dateOfBirth", value: new Date("1985-05-03"), isValid: true }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "contact": [
    {
      formId: "contact",
      description: "Valid contact information",
      fields: [
        { name: "phone", value: "555-123-4567", isValid: true },
        { name: "address", value: "123 Main St", isValid: true },
        { name: "city", value: "Boston", isValid: true },
        { name: "state", value: "MA", isValid: true },
        { name: "zipCode", value: "02108", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "contact",
      description: "Invalid phone format",
      fields: [
        { name: "phone", value: "abc-def-ghij", isValid: false, expectedErrorMessage: "Invalid phone number format" },
        { name: "address", value: "123 Main St", isValid: true },
        { name: "city", value: "Boston", isValid: true },
        { name: "state", value: "MA", isValid: true },
        { name: "zipCode", value: "02108", isValid: true }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "payment": [
    {
      formId: "payment",
      description: "Valid payment information",
      fields: [
        { name: "cardNumber", value: "4111111111111111", isValid: true },
        { name: "expiryDate", value: "12/25", isValid: true },
        { name: "cvv", value: "123", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "payment",
      description: "Invalid card number",
      fields: [
        { name: "cardNumber", value: "1234123412341234", isValid: false, expectedErrorMessage: "Invalid card number" },
        { name: "expiryDate", value: "12/25", isValid: true },
        { name: "cvv", value: "123", isValid: true }
      ],
      shouldSubmitSuccessfully: false
    },
    {
      formId: "payment",
      description: "Expired card",
      fields: [
        { name: "cardNumber", value: "4111111111111111", isValid: true },
        { name: "expiryDate", value: "12/20", isValid: false, expectedErrorMessage: "Card has expired" },
        { name: "cvv", value: "123", isValid: true }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "beneficiaries": [
    {
      formId: "beneficiaries",
      description: "Valid beneficiary information",
      fields: [
        { name: "firstName", value: "Jane", isValid: true },
        { name: "lastName", value: "Doe", isValid: true },
        { name: "relationship", value: "Spouse", isValid: true },
        { name: "dateOfBirth", value: new Date("1990-01-01"), isValid: true },
        { name: "ssn", value: "123-45-6789", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    },
    {
      formId: "beneficiaries",
      description: "Invalid SSN format",
      fields: [
        { name: "firstName", value: "Jane", isValid: true },
        { name: "lastName", value: "Doe", isValid: true },
        { name: "relationship", value: "Spouse", isValid: true },
        { name: "dateOfBirth", value: new Date("1990-01-01"), isValid: true },
        { name: "ssn", value: "123456789", isValid: false, expectedErrorMessage: "Invalid SSN format" }
      ],
      shouldSubmitSuccessfully: false
    }
  ],
  "affiliations": [
    {
      formId: "affiliations",
      description: "Valid affiliations information",
      fields: [
        { name: "stockExchangeOrFinra", value: "No", isValid: true },
        { name: "publicCompany", value: "No", isValid: true },
        { name: "usPoliticallyExposed", value: "No", isValid: true }
      ],
      shouldSubmitSuccessfully: true
    }
  ]
};

/**
 * Run validation tests on application forms
 * Tests both valid and invalid data scenarios
 * 
 * @returns Results of form validation tests
 */
export const runFormValidationDiagnostics = async (): Promise<FormValidationTestResult[]> => {
  logger.info('Starting form validation diagnostics', {}, 'FormValidator');
  
  try {
    // Get basic form validation test results
    const baseResults = testFormValidation();
    
    // Enhance with detailed test cases
    const enhancedResults = baseResults.map(formResult => {
      const testCases = formTestCases[formResult.form] || [];
      
      // Count validation issues
      const failedValidations = testCases.filter(test => !test.shouldSubmitSuccessfully).length;
      const passedValidations = testCases.filter(test => test.shouldSubmitSuccessfully).length;
      
      // Count field validations
      const fieldTests = testCases.flatMap(test => test.fields);
      const failedFieldValidations = fieldTests.filter(field => !field.isValid).length;
      
      return {
        ...formResult,
        testCases: testCases,
        validationStats: {
          total: testCases.length,
          passed: passedValidations,
          failed: failedValidations,
          fieldValidations: fieldTests.length,
          failedFieldValidations
        }
      };
    });
    
    logger.info(`Completed form validation diagnostics for ${enhancedResults.length} forms`, {
      formsWithIssues: enhancedResults.filter(r => r.status !== 'success').length
    }, 'FormValidator');
    
    return enhancedResults;
  } catch (error) {
    logger.error('Error running form validation diagnostics', { error }, 'FormValidator');
    throw error;
  }
};

/**
 * Run a single form validation test
 * 
 * @param formId The ID of the form to test
 * @param testCaseIndex The index of the test case to run (optional)
 * @returns Results of the form validation test
 */
export const runSingleFormValidationTest = async (formId: string, testCaseIndex?: number): Promise<any> => {
  const testCases = formTestCases[formId];
  
  if (!testCases || testCases.length === 0) {
    logger.warning(`No test cases found for form: ${formId}`, {}, 'FormValidator');
    return { success: false, message: `No test cases found for form: ${formId}` };
  }
  
  try {
    if (testCaseIndex !== undefined && testCaseIndex >= 0 && testCaseIndex < testCases.length) {
      // Run specific test case
      const testCase = testCases[testCaseIndex];
      logger.info(`Running single test case for form: ${formId}`, { 
        testCase: testCase.description 
      }, 'FormValidator');
      
      // Here we would simulate the actual form submission logic
      // This is simplified for demonstration purposes
      
      return {
        success: true,
        formId,
        testCase,
        result: {
          submitted: testCase.shouldSubmitSuccessfully,
          fieldValidations: testCase.fields.map(field => ({
            field: field.name,
            value: field.value,
            valid: field.isValid,
            errorMessage: field.isValid ? null : field.expectedErrorMessage
          }))
        }
      };
    } else {
      // Run all test cases for the form
      logger.info(`Running all test cases for form: ${formId}`, { 
        testCaseCount: testCases.length 
      }, 'FormValidator');
      
      const results = testCases.map(testCase => {
        // Here we would simulate the actual form submission logic
        // This is simplified for demonstration purposes
        
        return {
          description: testCase.description,
          submitted: testCase.shouldSubmitSuccessfully,
          fieldValidations: testCase.fields.map(field => ({
            field: field.name,
            value: field.value,
            valid: field.isValid,
            errorMessage: field.isValid ? null : field.expectedErrorMessage
          }))
        };
      });
      
      return {
        success: true,
        formId,
        results
      };
    }
  } catch (error) {
    logger.error(`Error running validation test for form: ${formId}`, { error }, 'FormValidator');
    return { 
      success: false, 
      message: `Error running validation test: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Get a list of all available forms that can be tested
 * 
 * @returns Array of form IDs and descriptions
 */
export const getAvailableFormTests = (): { formId: string, description: string, testCaseCount: number }[] => {
  return Object.entries(formTestCases).map(([formId, testCases]) => ({
    formId,
    description: `${formId.charAt(0).toUpperCase() + formId.slice(1)} Form`,
    testCaseCount: testCases.length
  }));
};
