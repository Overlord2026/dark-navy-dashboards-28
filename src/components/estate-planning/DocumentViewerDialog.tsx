
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share, X } from "lucide-react";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    description: string;
    status: string;
    url?: string;
    date?: Date;
    uploadedBy?: string;
  } | null;
  onShare?: (documentId: string) => void;
}

export function DocumentViewerDialog({ 
  open, 
  onClose, 
  document,
  onShare 
}: DocumentViewerDialogProps) {
  if (!document) return null;

  const handleDownload = () => {
    // In a real implementation, this would download the actual file
    // For now, we'll simulate the download
    const link = window.document.createElement('a');
    link.href = document.url || '#';
    link.download = document.name;
    link.click();
  };

  const handleShare = () => {
    if (onShare) {
      onShare(document.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle className="text-lg">{document.name}</DialogTitle>
                <DialogDescription>
                  {document.description || "Estate planning document"}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {document.url ? (
            <div className="w-full h-[60vh] border rounded-lg overflow-hidden">
              <iframe
                src={document.url}
                className="w-full h-full"
                title={document.name}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Document Preview Not Available</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                This document doesn't have a preview available. You can download it to view the contents.
              </p>
              <Button
                onClick={handleDownload}
                className="mt-4 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Document
              </Button>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Status: {document.status}</span>
              {document.date && (
                <span>Last updated: {new Date(document.date).toLocaleDateString()}</span>
              )}
            </div>
            {document.uploadedBy && (
              <div className="mt-1">
                Uploaded by: {document.uploadedBy}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
