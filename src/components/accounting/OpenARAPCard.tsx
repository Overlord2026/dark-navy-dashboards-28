'use client';
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function OpenARAPCard({ orgId }: { orgId: string }) {
  const [ar, setAr] = React.useState(0);
  const [ap, setAp] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const [{ data: inv }, { data: bills }] = await Promise.all([
        supabase.from("ar_invoices").select("total,status").eq("org_id", orgId).eq("status", "open"),
        supabase.from("ap_bills").select("total,status").eq("org_id", orgId).eq("status", "open"),
      ]);
      setAr((inv || []).reduce((s: number, r: any) => s + Number(r.total), 0));
      setAp((bills || []).reduce((s: number, r: any) => s + Number(r.total), 0));
    })();
  }, [orgId]);

  return (
    <Card>
      <CardHeader><CardTitle>Open AR / AP</CardTitle></CardHeader>
      <CardContent className="flex gap-6">
        <div>
          <div className="text-xs text-muted-foreground">Accounts Receivable</div>
          <div className="text-xl font-semibold">{ar.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Accounts Payable</div>
          <div className="text-xl font-semibold">{ap.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
        </div>
      </CardContent>
    </Card>
  );
}