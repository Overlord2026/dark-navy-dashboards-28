
import React from "react";
import { FileText } from "lucide-react";
import { EmptyDocumentsProps } from "./types/sharedDocuments";

export function EmptySharedDocuments({ 
  message = "No documents shared yet",
  description = "Share documents with your service professionals to collaborate securely. You can control who can view, download, or edit your documents."
}: EmptyDocumentsProps) {
  return (
    <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
      <FileText size={48} className="text-muted-foreground mb-4" />
      <p className="text-center mb-2">{message}</p>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        {description}
      </p>
    </div>
  );
}
