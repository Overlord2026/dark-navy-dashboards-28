import { ComponentType } from "react";
import { BarChart2, Wallet, Receipt, Activity, PieChart, PiggyBank, RefreshCw, Goal, LineChart, Lightbulb } from "lucide-react";

export type ToolKey =
  | "dashboard" | "accounts" | "transactions" | "cashflow"
  | "reports" | "budget" | "recurring" | "goals" | "investments" | "advice";

export type ToolItem = { key: ToolKey; label: string; to: string; icon?: ComponentType<{ className?: string }> };

export const TOOL_NAV: ToolItem[] = [
  { key: "dashboard",    label: "Dashboard",    to: "/reports",     icon: BarChart2 },
  { key: "accounts",     label: "Accounts",     to: "/accounts",    icon: Wallet },
  { key: "transactions", label: "Transactions", to: "/transactions", icon: Receipt },
  { key: "cashflow",     label: "Cash Flow",    to: "/cashflow",    icon: Activity },
  { key: "reports",      label: "Reports",      to: "/reports",     icon: PieChart },
  { key: "budget",       label: "Budget",       to: "/budgets",     icon: PiggyBank },
  { key: "recurring",    label: "Recurring",    to: "/recurring",   icon: RefreshCw },
  { key: "goals",        label: "Goals",        to: "/goals",       icon: Goal },
  { key: "investments",  label: "Investments",  to: "/investments", icon: LineChart },
  { key: "advice",       label: "Advice",       to: "/advice",      icon: Lightbulb },
];

// Tool descriptions for the launcher
export const TOOL_COPY: Partial<Record<ToolKey, string>> = {
  dashboard:   "Overview of your finances this month.",
  accounts:    "Linked accounts and balances.",
  transactions:"Categorize and review activity.",
  cashflow:    "Cash in vs. cash out trends.",
  reports:     "Spending, income, categories.",
  budget:      "Plan monthly categories.",
  recurring:   "Subscriptions, bills, and repeats.",
  goals:       "Track savings and progress.",
  investments: "Holdings and performance.",
  advice:      "Insights and recommendations."
};

// persona-specific orders + quick actions (idempotent; expand later)
export const PRO_RECOMMENDED_ORDER: Record<string, ToolKey[]> = {
  advisors:    ["dashboard","investments","reports","goals","accounts","transactions","cashflow","advice","budget","recurring"],
  accountants: ["dashboard","reports","transactions","accounts","cashflow","budget","recurring","goals"],
  attorneys:   ["dashboard","accounts","reports","advice","transactions"],
  insurance:   ["dashboard","cashflow","reports","accounts","advice"],
  medicare:    ["dashboard","cashflow","reports","advice"],
  realtors:    ["dashboard","cashflow","transactions","accounts","reports"],
  consultants: ["dashboard","cashflow","reports","transactions","accounts"],
};

export const DEFAULT_QUICK_ACTIONS: { label: string; to: string }[] = [
  { label: "Cash flows", to: "/cashflow" },
  { label: "Transactions", to: "/transactions" },
];

export const PRO_QUICK_ACTIONS: Record<string, { label: string; to: string }[]> = {
  advisors:    DEFAULT_QUICK_ACTIONS,
  accountants: DEFAULT_QUICK_ACTIONS,
  attorneys:   DEFAULT_QUICK_ACTIONS,
  insurance:   DEFAULT_QUICK_ACTIONS,
  medicare:    DEFAULT_QUICK_ACTIONS,
  realtors:    [
    { label: "Property cash flows", to: "/cashflow" },
    { label: "Deposits/escrows", to: "/transactions" },
  ],
  consultants: DEFAULT_QUICK_ACTIONS,
};