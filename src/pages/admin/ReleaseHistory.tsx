import React from "react";
import { getSnapshots } from "@/features/release/rulesStore";

export default function ReleaseHistory() {
  const [snaps, setSnaps] = React.useState(getSnapshots());

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Release History</h1>
      
      {snaps.length === 0 && (
        <p className="text-sm text-muted-foreground">No snapshots found.</p>
      )}
      
      {snaps.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2">
            <h2 className="text-sm font-medium text-foreground">Launch Tag Snapshots</h2>
          </div>
          <div className="divide-y divide-border">
            {snaps.map(s => (
              <div key={s.tag} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{s.tag}</div>
                  <div className="text-sm text-muted-foreground">{s.ts}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {s.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Snapshots are content-free (hashes only). Use Publish Batch to save a new one.
      </p>
    </div>
  );
}