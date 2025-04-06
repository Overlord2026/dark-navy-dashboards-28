
import { testAccounts, testTransactions } from './accountTests';
import { testNavigation } from './navigationTests';
import { testPerformance } from './performanceTests';
import { testAccess } from './accessTests';
import { DiagnosticTestSuite } from './types';

export const diagnosticSuites: DiagnosticTestSuite[] = [
  {
    id: 'accounts',
    name: 'Accounts',
    description: 'Tests account syncing, balance updates, and transaction history',
    runTests: testAccounts
  },
  {
    id: 'transactions',
    name: 'Transactions',
    description: 'Tests transaction records, categorization, and processing',
    runTests: testTransactions
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Tests navigation components and routing',
    runTests: testNavigation
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Tests application performance metrics',
    runTests: testPerformance
  },
  {
    id: 'access',
    name: 'Access Control',
    description: 'Tests user permissions and role-based access',
    runTests: testAccess
  }
];

export * from './types';
