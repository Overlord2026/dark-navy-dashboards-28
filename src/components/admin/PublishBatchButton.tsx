import React from "react";
import { publishBatch } from "@/tools/publishBatch";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function PublishBatchButton() {
  const [busy, setBusy] = React.useState(false);
  
  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    
    try {
      const env = (import.meta.env.MODE === "production") ? "prod" : "dev";
      const tag = prompt("Launch tag (e.g., 2025.09.0):", `${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2,"0")}.0`);
      if (!tag) return;
      
      const pv = prompt("Policy version (e.g., K-2025.09):", "K-2025.09") || "K-DEV";
      const res = await publishBatch({ 
        env, 
        policy_version: pv, 
        launch_tag: tag, 
        dry_run: env !== "prod" 
      });
      
      toast.ok(res.ok ? "Publish checks passed" : "Publish checks finished with failures");
    } catch (e: any) {
      toast.err(`Publish failed: ${e?.message || e}`);
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
      title="Run checks → emit LaunchTag → open Rules Export → post summary"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {busy ? "Publishing…" : "Publish Batch"}
    </Button>
  );
}