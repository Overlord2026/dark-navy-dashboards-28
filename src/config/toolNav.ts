import { ReactNode } from "react";

export type ToolKey =
  | "dashboard" | "accounts" | "transactions" | "cashflow"
  | "reports" | "budget" | "recurring" | "goals" | "investments" | "advice";

export type ToolItem = { key: ToolKey; label: string; to: string; icon?: ReactNode };

export const TOOL_NAV: ToolItem[] = [
  { key: "dashboard",    label: "Dashboard",    to: "/reports" },        // fallback to reports summary
  { key: "accounts",     label: "Accounts",     to: "/accounts" },
  { key: "transactions", label: "Transactions", to: "/transactions" },
  { key: "cashflow",     label: "Cash Flow",    to: "/cashflow" },
  { key: "reports",      label: "Reports",      to: "/reports" },
  { key: "budget",       label: "Budget",       to: "/budgets" },
  { key: "recurring",    label: "Recurring",    to: "/recurring" },      // TODO: implement route
  { key: "goals",        label: "Goals",        to: "/goals" },
  { key: "investments",  label: "Investments",  to: "/investments" },    // TODO: implement route
  { key: "advice",       label: "Advice",       to: "/advice" },         // TODO: implement route
];

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

export const PRO_QUICK_ACTIONS: Record<string, { label: string; to: string }[]> = {
  advisors:    [{ label:"Review investments", to:"/investments" }, { label:"Run spending report", to:"/reports" }],
  accountants: [{ label:"Download CSV", to:"/reports" }, { label:"Review categories", to:"/transactions" }],
  attorneys:   [{ label:"Confirm entities & accounts", to:"/accounts" }, { label:"Estate spend summary", to:"/reports" }],
  insurance:   [{ label:"Find premium cash flows", to:"/cashflow" }, { label:"Policy transactions", to:"/transactions" }],
  medicare:    [{ label:"Verify income/premiums", to:"/cashflow" }, { label:"Spending summary", to:"/reports" }],
  realtors:    [{ label:"Property cash flows", to:"/cashflow" }, { label:"Deposits/escrows", to:"/transactions" }],
  consultants: [{ label:"Scan monthly cash flow", to:"/cashflow" }, { label:"Spot largest expenses", to:"/reports" }],
};