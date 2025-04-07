
import { DiagnosticTestStatus } from './common';

export interface FormField {
  id?: string;
  name: string;
  fieldName?: string;
  type: "text" | "email" | "password" | "number" | "date" | "select" | "checkbox" | "radio";
  validations?: string[];
  value?: string;
  status?: DiagnosticTestStatus;
  message?: string;
  fieldType?: string;
  errors?: string[];
  valid?: boolean;
}

export interface FormValidationTestResult {
  id: string;
  name: string;
  form?: string;
  formId?: string;
  formName?: string;
  location?: string;
  status: DiagnosticTestStatus;
  fields: FormField[];
  message?: string;
  timestamp: number;
  success?: boolean;
}
