import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventRow = { 
  created_at: string; 
  reason_codes: string[]; 
  receipt_sha256?: string; 
};

interface ReasonCodesTimelineProps {
  fundId: string;
}

export default function ReasonCodesTimeline({ fundId }: ReasonCodesTimelineProps) {
  const [rows, setRows] = useState<EventRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data: rdi } = await supabase.from("rdi_scores")
        .select("created_at, reason_codes, receipt_sha256")
        .eq("fund_id", fundId)
        .order("created_at", { ascending: false });
        
      const { data: rac } = await supabase.from("rac_scores")
        .select("created_at, reason_codes, receipt_sha256")
        .eq("fund_id", fundId)
        .order("created_at", { ascending: false });
        
      setRows([...(rdi as any[] || []), ...(rac as any[] || [])]
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1)));
    })();
  }, [fundId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reason Codes Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0">
            <div className="flex-1 truncate">
              {(r.reason_codes || []).join(" • ")}
            </div>
            <div className="text-xs text-muted-foreground ml-3">
              {new Date(r.created_at).toLocaleString()}
            </div>
            <div className="text-xs ml-3 truncate font-mono">
              {r.receipt_sha256?.slice(0, 10)}…
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">
            No reason codes yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}