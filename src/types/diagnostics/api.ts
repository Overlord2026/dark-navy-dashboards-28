
import { DiagnosticTestStatus } from './common';

export interface ApiEndpointDiagnosticResult {
  id?: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: DiagnosticTestStatus;
  responseTime: number;
  responseStatus?: number;
  errorMessage?: string;
  warningMessage?: string;
  expectedDataStructure: string;
  schemaValidation: {
    valid: boolean;
    expected: any;
    actual: any;
    errors: string[];
  };
}
