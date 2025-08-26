import React from "react";
import { getAutoAnchorAfterPublish, setAutoAnchorAfterPublish } from "@/features/release/autoAnchor";
import { Checkbox } from "@/components/ui/checkbox";

export function AutoAnchorToggle() {
  const [on, setOn] = React.useState<boolean>(getAutoAnchorAfterPublish());
  
  const toggle = () => {
    const next = !on;
    setOn(next);
    setAutoAnchorAfterPublish(next);
  };
  
  return (
    <label className="inline-flex items-center gap-2 text-sm border border-border rounded-xl px-3 py-1 cursor-pointer hover:bg-muted/50 transition-colors" title="When enabled, a successful Publish Batch will auto-anchor receipts.">
      <Checkbox checked={on} onCheckedChange={toggle} />
      <span className="text-foreground">Auto-anchor after publish</span>
    </label>
  );
}