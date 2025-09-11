import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

const CHECKS: Record<string, {title:string; steps:{label:string; to?:string}[]}> = {
  advisors: {
    title: "Advisors – Get started",
    steps: [
      { label: "Link accounts", to: "/accounts" },
      { label: "Review cash flow", to: "/cashflow" },
      { label: "Run a spending report", to: "/reports" },
      { label: "Set a goal", to: "/goals" },
    ],
  },
  accountants: {
    title: "Accountants – Get started",
    steps: [
      { label: "Collect documents", to: "/reports" },
      { label: "Download CSV", to: "/reports" },
      { label: "Review categories", to: "/transactions" },
    ],
  },
  attorneys: {
    title: "Attorneys – Get started",
    steps: [
      { label: "Confirm entities & accounts", to: "/accounts" },
      { label: "Export spending by category", to: "/reports" },
    ],
  },
  insurance: {
    title: "Insurance – Get started",
    steps: [
      { label: "Find premium cash flows", to: "/cashflow" },
      { label: "Download transaction CSV", to: "/reports" },
    ],
  },
  medicare: {
    title: "Medicare – Get started",
    steps: [
      { label: "Verify income & premiums", to: "/cashflow" },
      { label: "Export spending summary", to: "/reports" },
    ],
  },
  realtors: {
    title: "Realtors / PM – Get started",
    steps: [
      { label: "Check property cash flows", to: "/cashflow" },
      { label: "Review deposits/escrows", to: "/transactions" },
    ],
  },
  consultants: {
    title: "Consultants – Get started",
    steps: [
      { label: "Scan monthly cash flow", to: "/cashflow" },
      { label: "Spot largest expenses", to: "/reports" },
    ],
  },
};

export default function PersonaOnboarding() {
  const [sp] = useSearchParams();
  const persona = sp.get("persona") || "";
  const cfg = CHECKS[persona];

  if (!cfg) return null;

  return (
    <aside className="mb-3 rounded-md border bg-card px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground">{cfg.title}</div>
          <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
            {cfg.steps.map((s, i) => (
              <li key={i}>
                {s.to ? <Link className="text-primary hover:underline" to={s.to}>{s.label}</Link> : s.label}
              </li>
            ))}
          </ul>
        </div>
        <Link to="/pros" className="shrink-0 text-sm text-muted-foreground hover:underline">Change role</Link>
      </div>
    </aside>
  );
}