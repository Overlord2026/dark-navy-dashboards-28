
import { FormValidationTestResult } from '@/types/diagnostics';

export const runFormValidationTests = async (): Promise<FormValidationTestResult[]> => {
  // This would typically connect to your form validation service
  // and run actual tests against your forms
  
  // For now, we'll return mock data with string timestamps
  return [
    {
      id: "login-form-test",
      name: "Login Form",
      status: "success",
      message: "All validation rules working correctly",
      timestamp: new Date().toISOString(), // Convert to string
      formId: "login-form",
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
    status: "success",
    message: "Form submission validated successfully",
    timestamp: new Date().toISOString(), // Convert to string
    formId: formName,
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
