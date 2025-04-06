
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useDocumentManagement } from "@/hooks/useDocumentManagement"; 
import { Professional } from "@/types/professional";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";
import { FileText, Search, User, Building, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShareDocumentWithProfessionalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDocumentWithProfessionalsDialog({
  open,
  onOpenChange
}: ShareDocumentWithProfessionalsDialogProps) {
  const { professionals } = useProfessionals();
  const { documents, shareDocument } = useDocumentManagement();
  
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [selectedProfessionalIds, setSelectedProfessionalIds] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string>("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [documentSearchQuery, setDocumentSearchQuery] = useState("");
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedDocumentId("");
      setSelectedProfessionalIds([]);
      setSelectedPermission("view");
      setSearchQuery("");
      setDocumentSearchQuery("");
    }
  }, [open]);
  
  // Filter professionals based on search query
  const filteredProfessionals = professionals.filter(pro =>
    pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pro.company && pro.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    pro.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get available documents (for now, we'll use sample documents if the actual documents array is empty)
  const availableDocuments = documents.length > 0 ? documents : getSampleDocuments();
  
  // Filter documents based on search query
  const filteredDocuments = availableDocuments.filter(doc =>
    doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase())
  );
  
  const handleToggleProfessional = (professionalId: string) => {
    setSelectedProfessionalIds(prev => 
      prev.includes(professionalId)
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };
  
  const handleShare = () => {
    if (!selectedDocumentId) {
      toast.error("Please select a document to share");
      return;
    }
    
    if (selectedProfessionalIds.length === 0) {
      toast.error("Please select at least one professional to share with");
      return;
    }
    
    // Find the selected document
    const documentToShare = availableDocuments.find(doc => doc.id === selectedDocumentId);
    
    if (!documentToShare) {
      toast.error("Selected document not found");
      return;
    }
    
    // Share the document with each selected professional
    selectedProfessionalIds.forEach(professionalId => {
      const professional = professionals.find(p => p.id === professionalId);
      
      if (professional) {
        shareDocument({
          documentId: selectedDocumentId,
          professionalId,
          professionalName: professional.name,
          professionalRole: professional.type,
          permission: selectedPermission
        });
      }
    });
    
    toast.success(
      `Document shared successfully with ${selectedProfessionalIds.length} professional(s)`,
      {
        description: `They now have ${selectedPermission} access to ${documentToShare.name}`
      }
    );
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Document with Professionals</DialogTitle>
          <DialogDescription>
            Select a document from your vault and choose which professionals should have access to it
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Document selection section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Document to Share</h3>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your documents..."
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-36 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedDocumentId === document.id ? "bg-secondary" : "hover:bg-secondary/50"
                      }`}
                      onClick={() => setSelectedDocumentId(document.id)}
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{document.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {document.size} • {document.type.toUpperCase()} • {document.created}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No documents match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Permissions section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Set Access Permissions</h3>
            <RadioGroup 
              value={selectedPermission} 
              onValueChange={setSelectedPermission}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="cursor-pointer">View Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="cursor-pointer">Allow Download</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="cursor-pointer">Allow Editing</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Professional selection section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Professionals</h3>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-48 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="flex items-start space-x-2 p-2 rounded-md hover:bg-secondary"
                    >
                      <Checkbox
                        id={`pro-${professional.id}`}
                        checked={selectedProfessionalIds.includes(professional.id)}
                        onCheckedChange={() => handleToggleProfessional(professional.id)}
                        className="mt-0.5"
                      />
                      <div className="space-y-1 w-full">
                        <Label
                          htmlFor={`pro-${professional.id}`}
                          className="flex justify-between w-full cursor-pointer"
                        >
                          <span className="font-medium">{professional.name}</span>
                          <span className="text-xs text-muted-foreground">{professional.type}</span>
                        </Label>
                        
                        {professional.company && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{professional.company}</span>
                          </div>
                        )}
                        
                        {professional.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{professional.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No professionals match your search
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="text-xs text-muted-foreground">
              {selectedProfessionalIds.length} professional(s) selected
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!selectedDocumentId || selectedProfessionalIds.length === 0}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Sample documents for demonstration
function getSampleDocuments(): DocumentItem[] {
  return [
    {
      id: "doc-1",
      name: "Tax Return 2024.pdf",
      type: "pdf",
      created: "04/02/2025",
      category: "professional-documents",
      size: "2.4 MB"
    },
    {
      id: "doc-2",
      name: "Estate Plan Draft.docx",
      type: "document",
      created: "03/28/2025",
      category: "professional-documents",
      size: "1.2 MB"
    },
    {
      id: "doc-3",
      name: "Investment Portfolio Analysis.xlsx",
      type: "spreadsheet",
      created: "03/15/2025",
      category: "professional-documents",
      size: "3.7 MB"
    },
    {
      id: "doc-4",
      name: "Property Deed.pdf",
      type: "pdf",
      created: "02/10/2025",
      category: "professional-documents",
      size: "1.8 MB"
    },
    {
      id: "doc-5",
      name: "Insurance Policy.pdf",
      type: "pdf",
      created: "01/25/2025",
      category: "professional-documents",
      size: "4.2 MB"
    }
  ];
}
