
import { FormValidationTestResult } from '@/types/diagnostics';

export const runFormValidationDiagnostics = async (): Promise<FormValidationTestResult[]> => {
  // This would typically connect to your form validation service
  // and run actual tests against your forms
  
  // For now, we'll return mock data
  return [
    {
      id: "login-form-test",
      name: "Login Form",
      formId: "login-form",
      formName: "login-form",
      status: "success",
      message: "All validation rules working correctly",
      timestamp: Date.now(),
      fields: [
        {
          id: "email-field",
          name: "email",
          type: "email",
          validations: ["required", "email"],
          value: "test@example.com",
          status: "success",
          message: "Valid email format"
        },
        {
          id: "password-field",
          name: "password",
          type: "password",
          validations: ["required", "min:8"],
          value: "********",
          status: "success",
          message: "Password meets requirements"
        }
      ]
    },
    // Add more form tests as needed
  ];
};

export const validateFormSubmission = (formName: string, formData: Record<string, any>): FormValidationTestResult => {
  // In a real application, this would validate the form data
  // against your validation rules
  
  // For now, return a mock result
  return {
    id: `${formName}-submission`,
    name: formName,
    formName: formName,
    status: "success",
    message: "Form submission validated successfully",
    timestamp: Date.now(),
    fields: Object.entries(formData).map(([key, value]) => ({
      id: `${key}-field`,
      name: key,
      type: typeof value === "string" ? "text" : "checkbox" as any,
      validations: ["required"],
      value: String(value),
      status: "success",
      message: "Field validated"
    }))
  };
};

// Add the missing exports
export const runSingleFormValidationTest = async (formId: string, testIndex?: number): Promise<FormValidationTestResult> => {
  const results = await runFormValidationDiagnostics();
  if (testIndex !== undefined && testIndex >= 0 && testIndex < results.length) {
    return results[testIndex];
  }
  const foundResult = results.find(result => result.id === formId);
  return foundResult || {
    id: formId,
    name: "Unknown Form",
    status: "error",
    message: "Form test not found",
    timestamp: Date.now(),
    fields: []
  };
};

export const getAvailableFormTests = async (): Promise<string[]> => {
  const results = await runFormValidationDiagnostics();
  return results.map(result => result.id);
};
