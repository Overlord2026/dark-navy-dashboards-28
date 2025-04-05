
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
import { useDocumentManagement } from "@/hooks/estate-planning/useDocumentManagement";

export const FamilyLegacyBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [taxReturnDialogOpen, setTaxReturnDialogOpen] = useState(false);
  
  // Sample initial documents data (this would typically come from an API)
  const initialDocuments = [
    {
      id: "will",
      name: "Last Will and Testament",
      description: "My last will and testament document",
      status: "completed" as const,
      url: "#",
      date: new Date("2023-05-15"),
      uploadedBy: "John Smith",
      sharedWith: ["Sarah Johnson (Financial Advisor)", "James Wilson (Estate Attorney)"],
    },
    {
      id: "trust",
      name: "Trust Documents",
      description: "Family trust documentation",
      status: "completed" as const,
      url: "#",
      date: new Date("2023-04-10"),
      uploadedBy: "John Smith",
    },
    {
      id: "lifeInsurance",
      name: "Life Insurance Policy",
      description: "Term life insurance policy documents",
      status: "completed" as const,
      url: "#",
      date: new Date("2023-06-22"),
      uploadedBy: "John Smith",
      sharedWith: ["Sarah Johnson (Financial Advisor)"],
    },
  ];

  const {
    documents,
    sharedDocuments,
    uploadDialogOpen,
    shareDialogOpen,
    viewDialogOpen,
    completedDocuments,
    totalDocuments,
    selectedDocument,
    handleUploadDocument,
    handleShareDocument,
    handleViewDocument,
    handleDocumentUpload,
    handleDocumentShare,
    setUploadDialogOpen,
    setShareDialogOpen,
    setViewDialogOpen
  } = useDocumentManagement(initialDocuments);

  const handleTaxReturnUpload = (files: File[]) => {
    // Implementation would go here
    console.log("Tax returns uploaded:", files);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Family Legacy Box</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Document Overview</TabsTrigger>
                <TabsTrigger value="uploaded">My Documents</TabsTrigger>
                <TabsTrigger value="shared">Shared Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <DocumentChecklist
                  onUploadDocument={handleUploadDocument}
                  documents={documents}
                />
              </TabsContent>
              <TabsContent value="uploaded">
                <UploadedDocuments
                  documents={documents}
                  onViewDocument={handleViewDocument}
                  onShareDocument={handleShareDocument}
                />
              </TabsContent>
              <TabsContent value="shared">
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
      </div>
      
      <ResourcesCard />
      
      {/* Dialogs */}
      <UploadDocumentDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleDocumentUpload}
        documentId={selectedDocument?.id || ""}
      />
      
      <ShareDocumentDialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        documentId={selectedDocument?.id || ""}
        onShare={handleDocumentShare}
      />
      
      <TaxReturnUploadDialog 
        open={taxReturnDialogOpen} 
        onClose={() => setTaxReturnDialogOpen(false)}
        onUpload={handleTaxReturnUpload}
      />
    </div>
  );
};
