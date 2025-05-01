
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";
import { FormField, FormValidationTestResult } from "@/types/diagnostics";

export function runFormValidationTests(): FormValidationTestResult[] {
  // Mock implementation of form validation tests
  const results: FormValidationTestResult[] = [];

  // Test for a profile update form
  const profileFormFields: FormField[] = [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true, validations: ["email"] },
    { name: "phone", type: "tel", validations: ["phone"] },
  ];

  results.push({
    id: uuidv4(),
    formId: "profile-form",
    formName: "Profile Update Form",
    testName: "Required Fields Validation",
    status: DiagnosticTestStatus.SUCCESS,
    message: "All required fields are properly validated",
    timestamp: new Date().toISOString(),
    validationDetails: {
      invalidFields: [],
    },
    fields: profileFormFields.map(field => ({
      name: field.name,
      type: field.type,
      status: DiagnosticTestStatus.SUCCESS,
      validations: field.validations
    })),
  });

  // Test for a payment form with an issue
  const paymentFormFields: FormField[] = [
    { name: "cardNumber", type: "text", required: true, validations: ["creditCard"] },
    { name: "expiryDate", type: "text", required: true, validations: ["expiry"] },
    { name: "cvv", type: "text", required: true, validations: ["cvv"] },
    { name: "name", type: "text", required: true },
  ];

  results.push({
    id: uuidv4(),
    formId: "payment-form",
    formName: "Payment Form",
    testName: "Payment Card Validation",
    status: DiagnosticTestStatus.WARNING,
    message: "Credit card validation could be improved",
    timestamp: new Date().toISOString(),
    validationDetails: {
      invalidFields: ["cardNumber"],
      unexpectedErrors: ["Card number validation doesn't account for all card types"],
    },
    fields: paymentFormFields.map(field => ({
      name: field.name,
      type: field.type,
      status: field.name === "cardNumber" ? DiagnosticTestStatus.WARNING : DiagnosticTestStatus.SUCCESS,
      validations: field.validations,
      errors: field.name === "cardNumber" ? ["Incomplete validation rules"] : undefined
    })),
  });

  return results;
}
