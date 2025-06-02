
import React from "react";
import { Share } from "lucide-react";

export function EmptySharedDocuments() {
  return (
    <div className="text-center py-12">
      <Share className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Shared Documents</h3>
      <p className="text-sm text-muted-foreground">
        You haven't shared any documents with professionals yet. Share documents from the Documents page to see them here.
      </p>
    </div>
  );
}
