
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface ShareDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  onShare?: (documentId: string, sharedWith: string[]) => void;
}

export const ShareDocumentDialog: React.FC<ShareDocumentDialogProps> = ({ 
  open, 
  onClose, 
  documentId,
  onShare 
}) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  
  // Sample contacts data
  const contactOptions = [
    { id: "1", name: "James Wilson", role: "Estate Attorney" },
    { id: "2", name: "Sarah Johnson", role: "Financial Advisor" },
    { id: "3", name: "Michael Brown", role: "CPA" },
    { id: "4", name: "Jennifer Davis", role: "Insurance Agent" },
    { id: "101", name: "Robert Smith", role: "Spouse" },
    { id: "102", name: "Emma Smith", role: "Child" },
    { id: "103", name: "Daniel Smith", role: "Child" },
    { id: "104", name: "Margaret Johnson", role: "Parent" },
  ];
  
  const handleToggleContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId) 
        : [...prev, contactId]
    );
  };
  
  const handleShare = () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact to share with");
      return;
    }
    
    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      if (onShare) {
        onShare(documentId, selectedContacts);
      }
      
      setIsSharing(false);
      setSelectedContacts([]);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Select people to share this document with
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Professionals</h4>
            <div className="space-y-2">
              {contactOptions.filter(c => parseInt(c.id) < 100).map(contact => (
                <div key={contact.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleContact(contact.id)}
                  />
                  <Label 
                    htmlFor={`contact-${contact.id}`}
                    className="flex-1 flex justify-between text-sm"
                  >
                    <span>{contact.name}</span>
                    <span className="text-muted-foreground">{contact.role}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Family Members</h4>
            <div className="space-y-2">
              {contactOptions.filter(c => parseInt(c.id) >= 100).map(contact => (
                <div key={contact.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleContact(contact.id)}
                  />
                  <Label 
                    htmlFor={`contact-${contact.id}`}
                    className="flex-1 flex justify-between text-sm"
                  >
                    <span>{contact.name}</span>
                    <span className="text-muted-foreground">{contact.role}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isSharing || selectedContacts.length === 0}
          >
            {isSharing ? "Sharing..." : "Share Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
