
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
import { useEstatePlanning } from "@/hooks/useEstatePlanning";
import { toast } from "sonner";

export const FamilyLegacyBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocumentDetails, setSelectedDocumentDetails] = useState<any | null>(null);
  
  const { 
    documents, 
    loading, 
    createDocument, 
    updateDocument, 
    deleteDocument 
  } = useEstatePlanning();
  
  // Convert backend documents to component format
  const convertedDocuments = documents.map(doc => ({
    id: doc.document_type,
    name: doc.document_name,
    description: doc.description || '',
    status: doc.status === 'completed' ? 'completed' as const : 'notStarted' as const,
    url: doc.file_path || '#',
    date: new Date(doc.created_at),
    uploadedBy: "You",
    sharedWith: doc.shared_with || [],
  }));

  // Sample shared documents (filtered from the main documents array)
  const sharedDocuments = convertedDocuments.filter(doc => doc.sharedWith && doc.sharedWith.length > 0).map(doc => ({
    id: doc.id,
    name: doc.name,
    sharedWith: doc.sharedWith || [],
    date: doc.date,
    status: "active" as const
  }));

  const handleUploadDocument = (documentType: string) => {
    setSelectedDocument(documentType);
    setUploadDialogOpen(true);
  };

  const handleShareDocument = (documentId: string) => {
    setSelectedDocument(documentId);
    const document = convertedDocuments.find((doc) => doc.id === documentId);
    setSelectedDocumentDetails(document);
    setShareDialogOpen(true);
  };

  const handleViewDocument = (documentId: string) => {
    const document = convertedDocuments.find((doc) => doc.id === documentId);
    setSelectedDocument(documentId);
    setSelectedDocumentDetails(document);
    toast.info("Document viewer would open here");
  };

  const handleDocumentUpload = async (documentType: string, data: any) => {
    try {
      await createDocument({
        document_type: documentType,
        document_name: data.documentName,
        description: data.description,
        status: 'completed',
      });
      
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleDocumentShare = async (documentId: string, sharedWith: string[]) => {
    try {
      const backendDoc = documents.find(doc => doc.document_type === documentId);
      if (backendDoc) {
        await updateDocument(backendDoc.id, {
          shared_with: sharedWith,
        });
      }
      
      setShareDialogOpen(false);
    } catch (error) {
      console.error('Error sharing document:', error);
    }
  };

  // Calculate completion metrics
  const totalDocuments = 9; // Total number of checklist items
  const completedDocuments = convertedDocuments.filter(doc => doc.status === 'completed').length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading estate planning data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                  documents={convertedDocuments}
                />
              </TabsContent>
              <TabsContent value="uploaded">
                <UploadedDocuments
                  documents={convertedDocuments}
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
        
        <AdvancedTaxStrategies />
        
        <CompletionProgress completedItems={completedDocuments} totalItems={totalDocuments} />
      </div>
      
      <ResourcesCard />
      
      {/* Dialogs */}
      <UploadDocumentDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleDocumentUpload}
        documentType={selectedDocument || ""}
      />
      
      <ShareDocumentDialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        documentId={selectedDocument || ""} 
        onShare={handleDocumentShare}
      />
      
      <TaxReturnUploadDialog 
        open={false} 
        onClose={() => {}} 
      />
    </div>
  );
};
