// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Row = { period_date: string; return_unsmoothed: number; };
type Risk = { 
  mdd: number; 
  time_under_water_days: number; 
  sortino: number; 
  cvar_5: number; 
  vol_annualized: number; 
  ulcer_index: number; 
};

interface PerformanceBulletinProps {
  fundId: string;
  windowStart: string;
  windowEnd: string;
}

export default function PerformanceBulletin({ fundId, windowStart, windowEnd }: PerformanceBulletinProps) {
  const [series, setSeries] = useState<{date: string, cum: number}[]>([]);
  const [risk, setRisk] = useState<Risk | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("fund_returns_unsmoothed")
        .select("period_date, return_unsmoothed")
        .eq("fund_id", fundId).gte("period_date", windowStart).lte("period_date", windowEnd)
        .order("period_date", { ascending: true });
      
      const rets = (data as Row[] || []);
      let level = 1;
      const cum = rets.map(r => { 
        level *= (1 + (r.return_unsmoothed ?? 0)); 
        return { date: r.period_date, cum: Number(level.toFixed(6)) }; 
      });
      setSeries(cum);

      const { data: rm } = await supabase.from("risk_metrics").select("*")
        .eq("fund_id", fundId).eq("window_start", windowStart).eq("window_end", windowEnd).maybeSingle();
      setRisk(rm as any);
    })();
  }, [fundId, windowStart, windowEnd]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Bulletin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cum" dot={false} stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {risk && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>MDD: {(risk.mdd * 100).toFixed(2)}%</div>
            <div>Sortino: {risk.sortino?.toFixed(2)}</div>
            <div>CVaR(5%): {(risk.cvar_5 * 100).toFixed(2)}%</div>
            <div>Ulcer: {risk.ulcer_index?.toFixed(4)}</div>
            <div>Vol (ann): {(risk.vol_annualized * 100).toFixed(2)}%</div>
            <div>Time Under Water: {risk.time_under_water_days} days</div>
          </div>
        )}
        {series.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-8">
            No performance data available for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}