export type ToolKey = 'goals' | 'budget' | 'cashflow' | 'transactions';

export const TOOL_ROUTES: Record<ToolKey, string> = {
  goals: '/tools/goals',
  budget: '/tools/budget', 
  cashflow: '/tools/cashflow',
  transactions: '/tools/transactions',
};

// Mapping of existing component routes to standardized tool routes
export const EXISTING_COMPONENT_ROUTES: Record<ToolKey, string> = {
  goals: '/goals', // GoalsPage.tsx - full-featured goals management
  budget: '/budgets', // BudgetsPage.tsx - comprehensive budget management
  cashflow: '/cashflow', // CashFlowPage.tsx - advanced cash flow tracking
  transactions: '/transactions', // TransactionsPage.tsx - transaction categorization
};

/**
 * Get the actual route for a tool based on existing components
 * Prefers existing routes over standardized tool routes
 */
export function getToolRoute(toolKey: ToolKey): string {
  return EXISTING_COMPONENT_ROUTES[toolKey] || TOOL_ROUTES[toolKey];
}

/**
 * Tool metadata for UI display and navigation
 */
export const TOOL_METADATA = {
  goals: {
    title: 'Goals',
    description: 'Set and track financial goals',
    componentPath: 'src/pages/GoalsPage.tsx',
    route: getToolRoute('goals')
  },
  budget: {
    title: 'Budget', 
    description: 'Monthly budget planning',
    componentPath: 'src/pages/BudgetsPage.tsx',
    route: getToolRoute('budget')
  },
  cashflow: {
    title: 'Cash Flow',
    description: 'Track income and expenses', 
    componentPath: 'src/features/cashflow/pages/CashFlowPage.tsx',
    route: getToolRoute('cashflow')
  },
  transactions: {
    title: 'Transactions',
    description: 'View and categorize transactions',
    componentPath: 'src/features/transactions/pages/TransactionsPage.tsx', 
    route: getToolRoute('transactions')
  }
} as const;