
import { DiagnosticTestStatus } from './common';

export interface FormField {
  id?: string;
  name: string;
  type: string;
  status?: DiagnosticTestStatus;
  errors?: string[];
  validations?: string[];
  message?: string;
  valid?: boolean;
  value?: string;
}

export interface FormValidationTestResult {
  id?: string;
  formId: string;
  name?: string;
  formName?: string;
  form?: string;
  location?: string;
  status: DiagnosticTestStatus;
  success: boolean;
  message: string;
  timestamp: string;
  fields?: FormField[];
  validationDetails?: {
    invalidFields?: string[];
    unexpectedErrors?: string[];
    missingErrors?: string[];
  };
}
