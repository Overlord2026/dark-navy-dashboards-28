import React from "react";
import { writePolicyPromotionRDS } from "@/features/release/policyPromotion";
import { setActivePolicyVersion, exportCurrentRules } from "@/features/release/rulesStore";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function PromotePolicyButton() {
  const [busy, setBusy] = React.useState(false);
  
  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    
    try {
      const env = (import.meta.env.MODE === "production") ? "prod" : "dev";
      const fromPV = prompt("Current policy version (for record):", "T-2025.09") || "UNKNOWN";
      const toPV = prompt("Promote to policy version:", "T-2025.10");
      if (!toPV) return;
      
      setActivePolicyVersion(toPV);
      const { hash } = await exportCurrentRules();
      
      const rds = await writePolicyPromotionRDS({
        type: "PolicyPromotion-RDS",
        ts: new Date().toISOString(),
        from_policy_version: fromPV,
        to_policy_version: toPV,
        env,
        reasons: ["promotion_ok"],
        approved_by: "admin_kid",
        anchor_ref: null
      });
      
      console.info("[policy] promoted", { rds, rules_hash: hash });
      toast.ok(`Policy promoted to ${toPV}`);
      
      // Optionally route to Release History
      window.location.assign("/admin/release-history");
    } catch (e: any) {
      toast.err(e?.message || "Promotion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={busy}
      className="gap-2"
      title="Promote active policy version"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {busy ? "Promoting…" : "Promote Policy"}
    </Button>
  );
}