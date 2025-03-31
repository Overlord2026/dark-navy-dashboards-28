
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyStates } from "@/components/documents/EmptyStates";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { CategoryList } from "@/components/documents/CategoryList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticsAccessButton } from "@/components/diagnostics/DiagnosticsAccessButton";
import { DocumentItem } from "@/types/document";

const LegacyVault = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    documents, 
    activeCategory,
    setActiveCategory,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments
  } = useDocumentManagement();
  
  // Function to handle document deletion
  const handleDeleteDocument = (id: string) => {
    // This would normally call a function from useDocumentManagement
    // Here we'll just show a toast message
    toast.success(`Document with ID ${id} deleted successfully`);
  };
  
  const comingSoonContent = (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="h-16 w-16 text-muted-foreground/60 mb-4" />
      <h3 className="text-xl font-medium text-muted-foreground">Coming Soon</h3>
      <p className="text-muted-foreground/80 max-w-md text-center mt-2">
        This section is currently under development. Check back soon for updates.
      </p>
      <Button 
        variant="outline" 
        className="mt-6"
        onClick={() => {
          setActiveTab("documents");
          toast.info("Navigated to Documents section");
        }}
      >
        Back to Documents
      </Button>
    </div>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "documents":
        return (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex-shrink-0">
              <CategoryList 
                categories={documentCategories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
            
            <div className="flex-1">
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredDocuments.length > 0 ? (
                <DocumentsTable 
                  documents={filteredDocuments}
                  handleDelete={handleDeleteDocument}
                />
              ) : (
                <EmptyStates 
                  category={activeCategory === "all" ? "All Documents" : documentCategories.find(c => c.id === activeCategory)?.name || ""}
                  onUpload={() => setIsUploadDialogOpen(true)} 
                />
              )}
            </div>
          </div>
        );
      case "estate-planning":
      case "real-estate":
      case "insurance":
      case "personal":
      case "financial":
      case "valuables":
        return comingSoonContent;
      default:
        return null;
    }
  };
  
  // Handle file upload
  const handleUpload = (documentData: { file: File; name: string; category: string }) => {
    handleFileUpload(documentData.file, documentData.name);
    setIsUploadDialogOpen(false);
    toast.success("Document uploaded successfully");
  };
  
  return (
    <ThreeColumnLayout title="Legacy Vault">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Legacy Vault</h1>
            <p className="text-muted-foreground">Store, organize and share your important documents</p>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button 
              onClick={() => setIsNewFolderDialogOpen(true)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Folder className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
            
            <Button 
              onClick={() => setIsUploadDialogOpen(true)} 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload</span>
            </Button>
            
            <DiagnosticsAccessButton />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="estate-planning">Estate Planning</TabsTrigger>
            <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="valuables">Valuables</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
      
      <UploadDocumentDialog 
        isOpen={isUploadDialogOpen} 
        setIsOpen={setIsUploadDialogOpen}
        onUploadDocument={handleUpload}
        categories={documentCategories}
      />
      
      <NewFolderDialog 
        isOpen={isNewFolderDialogOpen} 
        setIsOpen={setIsNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </ThreeColumnLayout>
  );
};

export default LegacyVault;
