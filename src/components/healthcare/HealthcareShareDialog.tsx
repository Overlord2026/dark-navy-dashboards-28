
// Update the imports to use the correct types
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DocumentItem, healthcareProfessionalRoles } from "@/types/document";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface HealthcareShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
  onShareComplete?: (document: DocumentItem, collaborators: string[]) => void;
}

export function HealthcareShareDialog({
  open,
  onOpenChange,
  document,
  onShareComplete
}: HealthcareShareDialogProps) {
  const [collaborators, setCollaborators] = useLocalStorage<Collaborator[]>("collaborators", []);
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [notifyCollaborators, setNotifyCollaborators] = useState(true);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedCollaborators([]);
    } else if (document?.permissions) {
      // Pre-select existing permissions
      const existingSharedWith = document.permissions
        .filter(p => p.userId !== document.uploadedBy)
        .map(p => p.userId);
      
      setSelectedCollaborators(existingSharedWith);
    }
  }, [open, document]);

  const handleToggleCollaborator = (collaboratorId: string) => {
    setSelectedCollaborators(prev => 
      prev.includes(collaboratorId)
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const handleShare = () => {
    if (!document) return;
    
    // In a real app, this would call an API to update document permissions
    if (onShareComplete) {
      onShareComplete(document, selectedCollaborators);
      
      // Log the share action
      auditLog.log(
        document.uploadedBy || "current-user",
        "document_share",
        "success",
        {
          resourceId: document.id,
          resourceType: "healthcare_document",
          details: {
            action: "share",
            documentName: document.name,
            sharedWith: selectedCollaborators
          }
        }
      );
      
      // Send notifications if enabled
      if (notifyCollaborators && selectedCollaborators.length > 0) {
        auditLog.log(
          document.uploadedBy || "current-user",
          "document_notification",
          "success",
          {
            resourceId: document.id,
            resourceType: "healthcare_notification",
            details: {
              action: "notify_collaborators",
              documentName: document.name,
              notifiedUsers: selectedCollaborators
            }
          }
        );
        
        toast.success(`Notifications sent to ${selectedCollaborators.length} collaborator(s)`);
      }
    }
    
    onOpenChange(false);
  };

  // Sample collaborators if none exist
  useEffect(() => {
    if (collaborators.length === 0) {
      setCollaborators([
        { id: "collab-1", name: "Jane Doe", email: "jane.doe@example.com", role: "spouse" },
        { id: "collab-2", name: "Dr. Sarah Smith", email: "dr.smith@clinic.com", role: "Primary Care Physician" },
        { id: "collab-3", name: "Michael Johnson", email: "mjohnson@finance.com", role: "Financial Advisor" }
      ]);
    }
  }, [collaborators, setCollaborators]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Healthcare Document</DialogTitle>
          <DialogDescription>
            Share "{document?.name}" with your collaborators and healthcare providers
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-3">Share with:</h3>
          
          {collaborators.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <Checkbox 
                    id={`collaborator-${collaborator.id}`} 
                    checked={selectedCollaborators.includes(collaborator.id)}
                    onCheckedChange={() => handleToggleCollaborator(collaborator.id)}
                  />
                  <Label 
                    htmlFor={`collaborator-${collaborator.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{collaborator.name}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No collaborators yet. Add collaborators in the Sharing section.
            </p>
          )}
          
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox 
              id="notify-collaborators" 
              checked={notifyCollaborators}
              onCheckedChange={(checked) => setNotifyCollaborators(!!checked)}
            />
            <Label htmlFor="notify-collaborators">
              Send notification to collaborators
            </Label>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!document || selectedCollaborators.length === 0}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
