import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentChecklist } from "./DocumentChecklist";
import { UploadedDocuments } from "./UploadedDocuments";
import { SharedDocuments } from "./SharedDocuments";
import { ResourcesCard } from "./ResourcesCard";
import { UploadDocumentDialog, ShareDocumentDialog, TaxReturnUploadDialog } from "@/components/estate-planning/DocumentDialogs";
import { CompletionProgress } from "./CompletionProgress";
import { AdvancedTaxStrategies } from "./AdvancedTaxStrategies";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// No useProfessionals import here, so this component is fine

export const FamilyLegacyBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocumentDetails, setSelectedDocumentDetails] = useState<any | null>(null);
  
  // Sample documents data (this would typically come from an API)
  const [documents, setDocuments] = useState<any[]>([
    {
      id: "will",
      name: "Last Will and Testament",
      description: "My last will and testament document",
      status: "completed",
      url: "#",
      date: new Date("2023-05-15"),
      uploadedBy: "John Smith",
      sharedWith: ["Sarah Johnson (Financial Advisor)", "James Wilson (Estate Attorney)"],
    },
    {
      id: "trust",
      name: "Trust Documents",
      description: "Family trust documentation",
      status: "completed",
      url: "#",
      date: new Date("2023-04-10"),
      uploadedBy: "John Smith",
    },
    {
      id: "lifeInsurance",
      name: "Life Insurance Policy",
      description: "Term life insurance policy documents",
      status: "completed",
      url: "#",
      date: new Date("2023-06-22"),
      uploadedBy: "John Smith",
      sharedWith: ["Sarah Johnson (Financial Advisor)"],
    },
  ]);

  // Sample shared documents (filtered from the main documents array)
  const sharedDocuments = documents.filter(doc => doc.sharedWith && doc.sharedWith.length > 0).map(doc => ({
    id: doc.id,
    name: doc.name,
    sharedWith: doc.sharedWith || [],
    date: doc.date,
    status: "active" as const  // This ensures the type is specifically "active", not just any string
  }));

  const handleUploadDocument = (documentType: string) => {
    setSelectedDocument(documentType);
    setUploadDialogOpen(true);
  };

  const handleShareDocument = (documentId: string) => {
    setSelectedDocument(documentId);
    const document = documents.find((doc) => doc.id === documentId);
    setSelectedDocumentDetails(document);
    setShareDialogOpen(true);
  };

  const handleViewDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId);
    setSelectedDocument(documentId);
    setSelectedDocumentDetails(document);
    setViewDialogOpen(true);
  };

  const handleDocumentUpload = (documentType: string, data: any) => {
    // In a real app, this would send the data to an API
    const newDocument = {
      id: documentType,
      name: data.documentName,
      description: data.description,
      status: "completed",
      url: "#",
      date: new Date(),
      uploadedBy: "John Smith",
    };

    // Update documents list - either add new or replace existing
    const existingIndex = documents.findIndex((doc) => doc.id === documentType);
    
    if (existingIndex >= 0) {
      const updatedDocuments = [...documents];
      updatedDocuments[existingIndex] = newDocument;
      setDocuments(updatedDocuments);
      toast.success("Document updated successfully");
    } else {
      setDocuments([...documents, newDocument]);
      toast.success("Document uploaded successfully");
    }
  };

  const handleDocumentShare = (documentId: string, sharedWith: string[]) => {
    // In a real app, this would send the sharing info to an API
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === documentId) {
        // Convert IDs to names (simplified example)
        const sharedWithNames = sharedWith.map((id) => {
          // This is a simplified example - in a real app you would lookup the name from the ID
          const lookup: Record<string, string> = {
            "1": "James Wilson (Estate Attorney)",
            "2": "Sarah Johnson (Financial Advisor)",
            "3": "Michael Brown (CPA)",
            "4": "Jennifer Davis (Insurance Agent)",
            "101": "Robert Smith (Spouse)",
            "102": "Emma Smith (Child)",
            "103": "Daniel Smith (Child)",
            "104": "Margaret Johnson (Parent)",
          };
          return lookup[id] || id;
        });
        
        return {
          ...doc,
          sharedWith: sharedWithNames,
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    toast.success("Document shared successfully");
  };

  // Calculate completion metrics
  const totalDocuments = 9; // Total number of checklist items
  const completedDocuments = documents.length;

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30">
          <CardTitle>Family Legacy Box</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Document Overview</TabsTrigger>
              <TabsTrigger value="uploaded">My Documents</TabsTrigger>
              <TabsTrigger value="shared">Shared Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <DocumentChecklist
                onUploadDocument={handleUploadDocument}
                documents={documents}
              />
            </TabsContent>
            <TabsContent value="uploaded" className="pt-4">
              <UploadedDocuments
                documents={documents}
                onViewDocument={handleViewDocument}
                onShareDocument={handleShareDocument}
              />
            </TabsContent>
            <TabsContent value="shared" className="pt-4">
              <SharedDocuments
                sharedDocuments={sharedDocuments}
                onViewDocument={handleViewDocument}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Advanced Tax Planning Strategies section */}
      <AdvancedTaxStrategies />
      
      <CompletionProgress completedItems={completedDocuments} totalItems={totalDocuments} />
      
      {/* Dialogs */}
      <UploadDocumentDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
      />
      
      <ShareDocumentDialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        documentId={selectedDocument || ""} 
      />
      
      <TaxReturnUploadDialog 
        open={false} 
        onClose={() => {}} 
      />
    </div>
  );
};
