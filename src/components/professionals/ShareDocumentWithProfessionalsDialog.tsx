
import React, { useState } from "react";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { useSupabaseSharedDocuments } from "@/hooks/useSupabaseSharedDocuments";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";

export interface ShareDocumentWithProfessionalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: DocumentItem | null;
}

export function ShareDocumentWithProfessionalsDialog({
  open,
  onOpenChange,
  document
}: ShareDocumentWithProfessionalsDialogProps) {
  const { professionals } = useProfessionals();
  const { shareDocument, sharing } = useSupabaseSharedDocuments();
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  const [permissionLevel, setPermissionLevel] = useState<'view' | 'download' | 'edit'>('view');

  const handleShare = async () => {
    if (!document || !selectedProfessionalId) {
      toast.error("Please select a professional");
      return;
    }

    const result = await shareDocument(
      selectedProfessionalId,
      document.id,
      permissionLevel
    );

    if (result) {
      toast.success(`Document shared with professional`);
      setSelectedProfessionalId("");
      setPermissionLevel('view');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{document?.name}" with a professional
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="professional">Select Professional</Label>
            <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a professional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id}>
                    {professional.name} - {professional.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permissionLevel} onValueChange={(value: 'view' | 'download' | 'edit') => setPermissionLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="download">View & Download</SelectItem>
                <SelectItem value="edit">Full Access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sharing}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={sharing || !selectedProfessionalId}>
            {sharing ? "Sharing..." : "Share Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
