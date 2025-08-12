import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiquidityOverlayProps {
  fundId: string;
  windowStart: string;
  windowEnd: string;
}

export default function LiquidityOverlay({ fundId, windowStart, windowEnd }: LiquidityOverlayProps) {
  const [rdi, setRdi] = useState<any>(null);
  const [rac, setRac] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: rdiRow } = await supabase.from("rdi_scores").select("*")
        .eq("fund_id", fundId).eq("window_start", windowStart).eq("window_end", windowEnd).maybeSingle();
      setRdi(rdiRow);
      
      const { data: racRow } = await supabase.from("rac_scores").select("*")
        .eq("fund_id", fundId).eq("window_start", windowStart).eq("window_end", windowEnd).maybeSingle();
      setRac(racRow);
    })();
  }, [fundId, windowStart, windowEnd]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Liquidity Overlay</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <div className="font-medium">RDI (Relative Drawdown Index)</div>
          <div className="text-2xl font-bold text-primary">
            {rdi ? rdi.rdi?.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-muted-foreground">
            Fund DD: {(rdi?.drawdown_fund * 100 || 0).toFixed(2)}% · Proxy DD: {(rdi?.drawdown_proxy * 100 || 0).toFixed(2)}%
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">RAC (Risk-Adjusted Composite)</div>
          <div className="text-2xl font-bold text-primary">
            {rac ? rac.rac?.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-muted-foreground">
            Weights: {rac ? Object.entries(rac.weights).map(([k, v]) => `${k}:${v}`).join(" • ") : "—"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}