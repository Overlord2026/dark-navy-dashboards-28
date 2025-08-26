import React from "react";
import { getSnapshots, restoreSnapshot } from "@/features/release/rulesStore";
import { writeRevertTagRDS } from "@/features/release/revertTag";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function RevertTagButton() {
  const [busy, setBusy] = React.useState(false);
  
  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    
    try {
      const env = (import.meta.env.MODE === "production") ? "prod" : "dev";
      const snaps = getSnapshots();
      
      if (!snaps.length) {
        toast.err("No snapshots to revert");
        return;
      }
      
      const names = snaps.map(s => s.tag).join(", ");
      const toTag = prompt(`Revert to which Launch Tag?\nAvailable: ${names}`, snaps[0].tag);
      if (!toTag) return;
      
      const fromTag = (snaps[0]?.tag) || "UNKNOWN_CURRENT";
      const restored = await restoreSnapshot(toTag);
      
      const rds = await writeRevertTagRDS({
        type: "RevertTag-RDS",
        ts: new Date().toISOString(),
        env,
        from_launch_tag: fromTag,
        to_launch_tag: toTag,
        restored_rules_hash: restored.hash,
        reasons: ["revert_ok"],
        anchor_ref: null
      });
      
      console.info("[revert] restored", { rds });
      toast.ok(`Restored rules to tag ${toTag}`);
      window.location.assign("/admin/release-history");
    } catch (e: any) {
      toast.err(e?.message || "Revert failed");
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
      title="Revert rules to a previous Launch Tag"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {busy ? "Reverting…" : "Revert Tag"}
    </Button>
  );
}