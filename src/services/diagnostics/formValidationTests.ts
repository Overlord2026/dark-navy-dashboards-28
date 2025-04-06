
import { FormValidationTestResult } from '../types/diagnostics';

export const testFormValidation = (): FormValidationTestResult[] => {
  // Sample validation tests for different forms
  return [
    {
      id: "login-form-test",
      name: "Login Form",
      formName: "Login Form",
      location: "/login",
      status: "warning",
      message: "Form validation has minor issues with error display",
      fields: [
        {
          id: "email-field",
          name: "email",
          type: "email",
          validations: ["required", "email"],
          value: "",
          status: "success",
          message: "Email validation works correctly"
        },
        {
          id: "password-field",
          name: "password",
          type: "password",
          validations: ["required", "minLength:8"],
          value: "",
          status: "warning",
          message: "Password strength indicator not showing for some password patterns"
        }
      ]
    },
    {
      id: "registration-form-test",
      name: "Registration Form",
      formName: "Registration Form",
      location: "/register",
      status: "success",
      message: "All validation rules work as expected",
      fields: [
        {
          id: "email-field",
          name: "email",
          type: "email",
          validations: ["required", "email"],
          value: "",
          status: "success",
          message: "Email validation works correctly"
        },
        {
          id: "password-field",
          name: "password",
          type: "password",
          validations: ["required", "minLength:8", "hasNumber", "hasSpecial"],
          value: "",
          status: "success",
          message: "Password validation works correctly"
        },
        {
          id: "confirm-password-field",
          name: "confirmPassword",
          type: "password",
          validations: ["required", "matches:password"],
          value: "",
          status: "success",
          message: "Password matching validation works correctly"
        }
      ]
    },
    {
      id: "contact-form-test",
      name: "Contact Form",
      formName: "Contact Form",
      location: "/contact",
      status: "success",
      message: "All validation rules work as expected",
      fields: []
    },
    {
      id: "payment-form-test",
      name: "Payment Form",
      formName: "Payment Form",
      location: "/checkout/payment",
      status: "error",
      message: "Critical validation issues found",
      fields: [
        {
          id: "card-number-field",
          name: "cardNumber",
          type: "text",
          validations: ["required", "creditCard"],
          value: "",
          status: "error",
          message: "Card number validation fails to detect invalid card numbers"
        },
        {
          id: "cvv-field",
          name: "cvv",
          type: "text",
          validations: ["required", "length:3,4"],
          value: "",
          status: "success",
          message: "CVV validation works correctly"
        },
        {
          id: "expiry-date-field",
          name: "expiryDate",
          type: "date",
          validations: ["required", "future"],
          value: "",
          status: "error",
          message: "Allows selection of past dates"
        }
      ]
    },
    {
      id: "profile-form-test",
      name: "Profile Update Form",
      formName: "Profile Update Form",
      location: "/profile",
      status: "warning",
      message: "Form has some validation inconsistencies",
      fields: [
        {
          id: "phone-field",
          name: "phoneNumber",
          type: "text",
          validations: ["required", "phone"],
          value: "",
          status: "warning",
          message: "Phone number validation accepts some invalid formats"
        },
        {
          id: "address-field",
          name: "address",
          type: "text",
          validations: ["required"],
          value: "",
          status: "success",
          message: "Address validation works correctly"
        }
      ]
    }
  ];
};
