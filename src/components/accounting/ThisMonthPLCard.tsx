'use client';
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function ThisMonthPLCard({ orgId }: { orgId: string }) {
  const [income, setIncome] = React.useState(0);
  const [expense, setExpense] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("vw_income_statement")
        .select("type, balance, org_id, code")
        .eq("org_id", orgId);
      if (error) return;
      const now = new Date();
      // If you add period columns later, filter by month; for now, aggregate all posted.
      const inc = (data || []).filter((r: any) => r.type === "income").reduce((s: number, r: any) => s + Number(r.balance), 0);
      const exp = (data || []).filter((r: any) => r.type === "expense").reduce((s: number, r: any) => s + Number(r.balance), 0);
      setIncome(inc);
      setExpense(exp);
    })();
  }, [orgId]);

  const pnl = income - Math.abs(expense);

  return (
    <Card>
      <CardHeader><CardTitle>This Month's P&L</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div>
            <div className="text-xs text-muted-foreground">Income</div>
            <div className="text-xl font-semibold">{income.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Expenses</div>
            <div className="text-xl font-semibold">{Math.abs(expense).toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Net</div>
            <div className="text-xl font-semibold">{pnl.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}