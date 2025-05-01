
import { FormValidationTestResult, FormField } from '@/types/diagnostics';

export const runFormValidationDiagnostics = async (): Promise<FormValidationTestResult[]> => {
  // This would typically connect to your form validation service
  // and run actual tests against your forms
  
  // Now, we'll return mock data with string timestamps
  return [
    {
      id: "login-form-test",
      name: "Login Form",
      formId: "login-form",
      formName: "login-form",
      status: "success",
      message: "All validation rules working correctly",
      timestamp: new Date().toISOString(), // Convert to string
      success: true,
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
    }
    // Add more form tests as needed
  ];
};

export const validateFormSubmission = (formName: string, formData: Record<string, any>): FormValidationTestResult => {
  // In a real application, this would validate the form data
  // against your validation rules
  
  // For now, return a mock result with string timestamp
  return {
    id: `${formName}-submission`,
    name: formName,
    formId: formName,
    formName: formName,
    status: "success",
    message: "Form submission validated successfully",
    timestamp: new Date().toISOString(), // Convert to string
    success: true,
    fields: Object.entries(formData).map(([key, value]) => ({
      id: `${key}-field`,
      name: key,
      type: typeof value === "string" ? "text" : "checkbox",
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
  const foundResult = results.find(result => result.formId === formId);
  return foundResult || {
    id: formId,
    name: "Unknown Form",
    status: "error",
    message: "Form test not found",
    timestamp: new Date().toISOString(), // Convert to string
    formId: formId,
    formName: "Unknown",
    success: false,
    fields: []
  };
};

export const getAvailableFormTests = async (): Promise<string[]> => {
  const results = await runFormValidationDiagnostics();
  return results.map(result => result.formId);
};
