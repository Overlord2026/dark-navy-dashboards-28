
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SharedDocumentsList } from "@/components/professionals/SharedDocumentsList";

interface DocumentsTabContentProps {
  onUpload: () => void;
  onShare: () => void;
}

export function DocumentsTabContent({ onUpload, onShare }: DocumentsTabContentProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-medium">Shared Documents</h2>
          <p className="text-muted-foreground">
            Manage documents shared with your service professionals. Control access and track document viewing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onUpload}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Upload New
          </Button>
        </div>
      </div>
      
      <SharedDocumentsList />
    </div>
  );
}
