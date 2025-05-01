
import { DiagnosticTestStatus } from './common';

export interface FormField {
  name: string;
  type: string;
  status?: DiagnosticTestStatus;
  errors?: string[];
  validations?: string[];
  message?: string;
}

export interface FormValidationTestResult {
  formId: string;
  name: string;
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
