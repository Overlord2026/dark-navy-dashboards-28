
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/animated-dialog";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/ui/async-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentItem } from "@/types/document";

export interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
  onSave: (document: DocumentItem, newName: string) => Promise<void>;
}

export function EditDocumentDialog({
  open,
  onOpenChange,
  document,
  onSave,
}: EditDocumentDialogProps) {
  const [name, setName] = useState("");

  // Set the name when the document changes
  React.useEffect(() => {
    if (document) {
      setName(document.name);
    }
  }, [document]);

  const handleSave = async () => {
    if (document && name.trim()) {
      await onSave(document, name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit document</DialogTitle>
          <DialogDescription>
            Update the document name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <AsyncButton 
            onClick={handleSave} 
            disabled={!name.trim()}
            loadingText="Saving..."
            showFeedback={false}
          >
            Save Changes
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
