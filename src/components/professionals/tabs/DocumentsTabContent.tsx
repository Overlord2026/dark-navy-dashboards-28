
import React from "react";
import { SharedDocumentsList } from "@/components/professionals/SharedDocumentsList";
import { Button } from "@/components/ui/button";
import { Share, Upload } from "lucide-react";

interface DocumentsTabContentProps {
  onUpload?: () => void;
  onShare?: () => void;
}

export function DocumentsTabContent({ onUpload, onShare }: DocumentsTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shared Documents</h3>
          <p className="text-sm text-muted-foreground">
            Manage documents you've shared with professionals
          </p>
        </div>
        <div className="flex gap-2">
          {onUpload && (
            <Button variant="outline" onClick={onUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share Document
            </Button>
          )}
        </div>
      </div>
      
      <SharedDocumentsList />
    </div>
  );
}
