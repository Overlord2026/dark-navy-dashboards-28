import React from "react";
import { anchorNow } from "@/features/anchor/anchorNow";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function AnchorNowButton() {
  const [busy, setBusy] = React.useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    
    try {
      const env = (import.meta.env.MODE === "production") ? "prod" : "dev";
      const types = prompt("Which receipt types? (comma-separated; leave blank for ALL)", "") || "";
      const include_types = types.split(",").map(s => s.trim()).filter(Boolean);
      
      const res = await anchorNow({ 
        env, 
        include_types: include_types.length ? include_types : undefined 
      });
      
      if (res.count === 0) {
        toast.info("No unanchored receipts found");
      } else {
        toast.ok(`Anchored ${res.count} receipts (root: ${res.merkle_root?.slice(0, 16)}...)`);
        
        // Optional: update Release Notes
        const md = `## Anchor Batch\n- Root: ${res.merkle_root}\n- Count: ${res.count}\n- Audit-RDS: ${res.audit_receipt_id}`;
        const existing = window.localStorage.getItem("lastReleaseSummary") || "";
        window.localStorage.setItem("lastReleaseSummary", existing + "\n\n" + md);
      }
    } catch (e: any) {
      toast.err(e?.message || "Anchor failed");
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
      title="Merkle-batch unanchored receipts and record Audit-RDS"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {busy ? "Anchoring…" : "Anchor Now"}
    </Button>
  );
}