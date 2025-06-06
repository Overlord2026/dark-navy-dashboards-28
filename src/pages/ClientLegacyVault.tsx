
import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState, NoCategorySelectedState } from "@/components/documents/EmptyStates";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { EditDocumentDialog } from "@/components/documents/EditDocumentDialog";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload, ExternalLink, ArchiveIcon, HeartPulseIcon } from "lucide-react";
import { documentCategories, healthcareCategories } from "@/data/documentCategories";
import { toast } from "sonner";
import { DocumentType, DocumentItem, DocumentCategory } from "@/types/document";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { HealthcareFolder } from "@/components/healthcare/HealthcareFolder";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { useSupabaseDocumentManagement } from "@/hooks/useSupabaseDocumentManagement";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const importantDocumentCategories = documentCategories.filter(cat => 
  ["documents-to-sign", "bfo-records", "alternative-investments", 
   "business-ownership", "education", "employer-agreements", 
   "leases", "property-ownership", 
   "statements", "taxes", "vehicles"].includes(cat.id)
);

const estateDocumentCategories = documentCategories.filter(cat => 
  ["estate-planning", "trusts", "other"].includes(cat.id)
);

export default function ClientLegacyVault() {
  const {
    documents,
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument,
    refreshDocuments,
    filteredDocuments
  } = useSupabaseDocumentManagement();

  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [activeTab, setActiveTab] = useState("legacy-box");
  
  const legacyBoxDocuments: DocumentItem[] = [
    {
      id: "1",
      name: "Estate Plan",
      type: "folder",
      category: "estate-planning",
      created: new Date().toISOString(),
      size: "—",
    },
    {
      id: "2",
      name: "Insurance Policies",
      type: "folder",
      category: "insurance",
      created: new Date().toISOString(),
      size: "—",
    },
    {
      id: "3",
      name: "Living Trust.pdf",
      type: "pdf",
      category: "estate-planning",
      size: 1200000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Power of Attorney.pdf",
      type: "pdf",
      category: "estate-planning",
      size: 850000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Life Insurance Policy.pdf",
      type: "pdf",
      category: "insurance",
      size: 1500000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
  ];

  const handleAddDocument = (document: DocumentItem) => {
    // This will be handled by the Supabase hook
    refreshDocuments();
  };

  const handleEditDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleSaveDocument = (document: DocumentItem, newName: string) => {
    // Update logic would go here
    toast.success("Document updated successfully");
  };

  const handleShareDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  const handleDeleteDialog = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async (document: DocumentItem) => {
    try {
      await deleteDocument(document.id);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  // Convert Supabase documents to DocumentItem format for compatibility
  const convertSupabaseDocsToDocumentItems = (supabaseDocs: any[]): DocumentItem[] => {
    return supabaseDocs.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      created: doc.created_at,
      modified: doc.updated_at,
      size: doc.size || 0,
      uploadedBy: doc.uploaded_by || "Unknown",
    }));
  };

  // Restore the original documents list for Healthcare tab - don't filter by Supabase documents
  const documentItems = convertSupabaseDocsToDocumentItems(filteredDocuments);

  return (
    <ThreeColumnLayout activeMainItem="client-legacy-vault">
      <ProfessionalsProvider>
        <div className="container mx-auto p-4 lg:p-6 space-y-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold">Secure Family Vault</h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Store and organize your important documents securely
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => window.open('https://trustandwill.com', '_blank')}
                className="flex items-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors shrink-0 font-medium shadow-lg"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">DIY with Trust & Will</span>
                <span className="sm:hidden">Trust & Will</span>
              </Button>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
              <TabsTrigger value="legacy-box" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <ArchiveIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Family Legacy Box</span>
              </TabsTrigger>
              <TabsTrigger value="healthcare" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <HeartPulseIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Healthcare</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Legacy Box Tab */}
            <TabsContent value="legacy-box" className="space-y-6">
              <FamilyLegacyBox />
            </TabsContent>

            {/* Healthcare Tab - Restored to original functionality */}
            <TabsContent value="healthcare" className="space-y-6">
              <HealthcareFolder 
                documents={[]} 
                onAddDocument={handleAddDocument}
                onCreateFolder={handleCreateFolder}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Dialogs */}
        <UploadDocumentDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory || "documents"}
          documentCategories={documentCategories as any}
        />
        
        <NewFolderDialog 
          open={isNewFolderDialogOpen}
          onOpenChange={setIsNewFolderDialogOpen}
          onCreateFolder={handleCreateFolder}
        />

        <EditDocumentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          document={selectedDocument}
          onSave={handleSaveDocument}
        />

        <ShareDocumentDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          document={selectedDocument}
        />

        <DeleteDocumentDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          document={selectedDocument}
          onConfirm={handleDeleteDocument}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
