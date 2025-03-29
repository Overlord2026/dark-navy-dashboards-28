
import { FormValidationTestResult } from './types';

export const testFormValidation = (): FormValidationTestResult[] => {
  // In a real app, this would run actual form validation tests
  return [
    {
      formName: "Advisor Feedback Form",
      location: "/advisor-feedback",
      status: "warning",
      message: "Form allows submission with empty ratings",
      fields: [
        {
          fieldName: "ratings",
          fieldType: "star-rating",
          status: "warning",
          message: "Star ratings can be empty on submission"
        },
        {
          fieldName: "comments",
          fieldType: "textarea",
          status: "success",
          message: "Text areas properly validate and trim input"
        }
      ]
    },
    {
      formName: "Contact Information Form",
      location: "/customer-profile",
      status: "success",
      message: "All fields validate correctly",
      fields: [
        {
          fieldName: "email",
          fieldType: "email",
          status: "success",
          message: "Email validation working correctly"
        },
        {
          fieldName: "phone",
          fieldType: "tel",
          status: "success",
          message: "Phone number validation working correctly"
        }
      ]
    },
    {
      formName: "Property Form",
      location: "/properties",
      status: "success",
      message: "Form validates all required fields"
    },
    {
      formName: "Loan Application Form",
      location: "/lending",
      status: "error",
      message: "Form submission fails with valid data",
      fields: [
        {
          fieldName: "loanAmount",
          fieldType: "number",
          status: "success",
          message: "Numeric validation working correctly"
        },
        {
          fieldName: "purpose",
          fieldType: "select",
          status: "error",
          message: "Select field not saving value on submission"
        },
        {
          fieldName: "startDate",
          fieldType: "date",
          status: "error",
          message: "Date picker not selecting correct date format"
        }
      ]
    },
    {
      formName: "Document Upload Form",
      location: "/documents",
      status: "warning",
      message: "File validation partially working",
      fields: [
        {
          fieldName: "fileUpload",
          fieldType: "file",
          status: "warning",
          message: "Accepts improper file types despite validation"
        },
        {
          fieldName: "documentType",
          fieldType: "select",
          status: "success",
          message: "Document type selection works correctly"
        }
      ]
    }
  ];
};
