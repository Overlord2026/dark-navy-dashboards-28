
import { FormValidationTestResult } from './types';

export const testFormValidation = (): FormValidationTestResult[] => {
  // Sample validation tests for different forms
  return [
    {
      form: "login", // Added the required form property
      formName: "Login Form",
      location: "/login",
      status: "warning",
      message: "Form validation has minor issues with error display",
      fields: [
        {
          fieldName: "email",
          fieldType: "email",
          status: "success",
          message: "Email validation works correctly"
        },
        {
          fieldName: "password",
          fieldType: "password",
          status: "warning",
          message: "Password strength indicator not showing for some password patterns"
        }
      ]
    },
    {
      form: "registration", // Added the required form property
      formName: "Registration Form",
      location: "/register",
      status: "success",
      message: "All validation rules work as expected",
      fields: [
        {
          fieldName: "email",
          fieldType: "email",
          status: "success",
          message: "Email validation works correctly"
        },
        {
          fieldName: "password",
          fieldType: "password",
          status: "success",
          message: "Password validation works correctly"
        },
        {
          fieldName: "confirmPassword",
          fieldType: "password",
          status: "success",
          message: "Password matching validation works correctly"
        }
      ]
    },
    {
      form: "contact", // Added the required form property
      formName: "Contact Form",
      location: "/contact",
      status: "success",
      message: "All validation rules work as expected"
    },
    {
      form: "payment", // Added the required form property
      formName: "Payment Form",
      location: "/checkout/payment",
      status: "error",
      message: "Critical validation issues found",
      fields: [
        {
          fieldName: "cardNumber",
          fieldType: "number",
          status: "error",
          message: "Card number validation fails to detect invalid card numbers"
        },
        {
          fieldName: "cvv",
          fieldType: "number",
          status: "success",
          message: "CVV validation works correctly"
        },
        {
          fieldName: "expiryDate",
          fieldType: "date",
          status: "error",
          message: "Allows selection of past dates"
        }
      ]
    },
    {
      form: "profile", // Added the required form property
      formName: "Profile Update Form",
      location: "/profile",
      status: "warning",
      message: "Form has some validation inconsistencies",
      fields: [
        {
          fieldName: "phoneNumber",
          fieldType: "tel",
          status: "warning",
          message: "Phone number validation accepts some invalid formats"
        },
        {
          fieldName: "address",
          fieldType: "text",
          status: "success",
          message: "Address validation works correctly"
        }
      ]
    }
  ];
};
