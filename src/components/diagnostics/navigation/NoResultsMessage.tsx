
import React from "react";

export function NoResultsMessage() {
  return (
    <div className="flex justify-center items-center h-40">
      <p className="text-muted-foreground">No diagnostics data available. Run the diagnostics to check navigation health.</p>
    </div>
  );
}
