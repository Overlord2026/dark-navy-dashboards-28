
import { FormValidationTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testFormValidation = (): FormValidationTestResult[] => {
  // Sample validation tests for different forms
  return [
    {
      id: uuidv4(),
      form: "login", // Backward compatibility
      formName: "Login Form",
      location: "/login",
      status: "warning",
      message: "Form validation has minor issues with error display",
      timestamp: Date.now(),
      fields: [
        {
          name: "email",
          fieldName: "email", // Backward compatibility
          type: "email",
          fieldType: "email", // Backward compatibility
          status: "success",
          message: "Email validation works correctly"
        },
        {
          name: "password",
          fieldName: "password", // Backward compatibility
          type: "password",
          fieldType: "password", // Backward compatibility
          status: "warning",
          message: "Password strength indicator not showing for some password patterns"
        }
      ]
    },
    {
      id: uuidv4(),
      form: "registration", // Backward compatibility
      formName: "Registration Form",
      location: "/register",
      status: "success",
      message: "All validation rules work as expected",
      timestamp: Date.now(),
      fields: [
        {
          name: "email",
          fieldName: "email", // Backward compatibility
          type: "email",
          fieldType: "email", // Backward compatibility
          status: "success",
          message: "Email validation works correctly"
        },
        {
          name: "password",
          fieldName: "password", // Backward compatibility
          type: "password",
          fieldType: "password", // Backward compatibility
          status: "success",
          message: "Password validation works correctly"
        },
        {
          name: "confirmPassword",
          fieldName: "confirmPassword", // Backward compatibility
          type: "password",
          fieldType: "password", // Backward compatibility
          status: "success",
          message: "Password matching validation works correctly"
        }
      ]
    },
    {
      id: uuidv4(),
      form: "contact", // Backward compatibility
      formName: "Contact Form",
      location: "/contact",
      status: "success",
      message: "All validation rules work as expected",
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      form: "payment", // Backward compatibility
      formName: "Payment Form",
      location: "/checkout/payment",
      status: "error",
      message: "Critical validation issues found",
      timestamp: Date.now(),
      fields: [
        {
          name: "cardNumber",
          fieldName: "cardNumber", // Backward compatibility
          type: "number",
          fieldType: "number", // Backward compatibility
          status: "error",
          message: "Card number validation fails to detect invalid card numbers"
        },
        {
          name: "cvv",
          fieldName: "cvv", // Backward compatibility
          type: "number",
          fieldType: "number", // Backward compatibility
          status: "success",
          message: "CVV validation works correctly"
        },
        {
          name: "expiryDate",
          fieldName: "expiryDate", // Backward compatibility
          type: "date",
          fieldType: "date", // Backward compatibility
          status: "error",
          message: "Allows selection of past dates"
        }
      ]
    },
    {
      id: uuidv4(),
      form: "profile", // Backward compatibility
      formName: "Profile Update Form",
      location: "/profile",
      status: "warning",
      message: "Form has some validation inconsistencies",
      timestamp: Date.now(),
      fields: [
        {
          name: "phoneNumber",
          fieldName: "phoneNumber", // Backward compatibility
          type: "tel",
          fieldType: "tel", // Backward compatibility
          status: "warning",
          message: "Phone number validation accepts some invalid formats"
        },
        {
          name: "address",
          fieldName: "address", // Backward compatibility
          type: "text",
          fieldType: "text", // Backward compatibility
          status: "success",
          message: "Address validation works correctly"
        }
      ]
    }
  ];
};
