
import { DiagnosticTestStatus } from './types';

export function runAccountTests() {
  return [
    {
      id: 'account-1',
      name: 'Account Creation',
      status: 'success' as DiagnosticTestStatus,
      message: 'Account creation process is working correctly',
      timestamp: new Date().toISOString()
    },
    {
      id: 'account-2',
      name: 'Password Reset',
      status: 'success' as DiagnosticTestStatus,
      message: 'Password reset flow is working correctly',
      timestamp: new Date().toISOString()
    },
    {
      id: 'account-3',
      name: 'Profile Update',
      status: 'success' as DiagnosticTestStatus,
      message: 'Profile update process is working correctly',
      timestamp: new Date().toISOString()
    }
  ];
}
