
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/animated-dialog";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/ui/async-button";
import { DocumentItem } from "@/types/document";

export interface DeleteDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
  onConfirm: (document: DocumentItem) => Promise<void>;
}

export function DeleteDocumentDialog({
  open,
  onOpenChange,
  document,
  onConfirm,
}: DeleteDocumentDialogProps) {
  const handleConfirm = async () => {
    if (document) {
      await onConfirm(document);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{document?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <AsyncButton 
            variant="destructive" 
            onClick={handleConfirm}
            loadingText="Deleting..."
            showFeedback={false}
          >
            Delete
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
