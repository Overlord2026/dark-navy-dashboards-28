
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
import { FolderPlus, Upload, ExternalLink, VaultIcon, ArchiveIcon, HeartPulseIcon } from "lucide-react";
import { documentCategories, healthcareCategories } from "@/data/documentCategories";
import { toast } from "sonner";
import { DocumentType, DocumentItem, DocumentCategory } from "@/types/document";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { HealthcareFolder } from "@/components/healthcare/HealthcareFolder";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  
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
  
  useEffect(() => {
    setTimeout(() => {
      setDocuments([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = activeCategory === "all"
    ? documents
    : documents.filter(doc => doc.category === activeCategory);

  const handleUploadDocument = (file: File, customName: string) => {
    const newDocument: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName || file.name,
      type: file.type.includes("pdf") ? "pdf" : 
            file.type.includes("image") ? "image" : "document",
      category: activeCategory === "all" ? "general" : activeCategory,
      size: file.size,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    setDocuments(prev => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
    setIsUploadDialogOpen(false);
  };

  const handleCreateFolder = (folderName: string, category: string = activeCategory) => {
    const newFolder: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: folderName,
      type: "folder",
      category: category === "all" ? "general" : category,
      created: new Date().toISOString(),
      size: "—",
    };
    
    setDocuments(prev => [...prev, newFolder]);
    toast.success("Folder created successfully");
    setIsNewFolderDialogOpen(false);
  };

  const handleAddDocument = (document: DocumentItem) => {
    setDocuments(prev => [...prev, document]);
  };

  const handleEditDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleSaveDocument = (document: DocumentItem, newName: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, name: newName, modified: new Date().toISOString() } 
          : doc
      )
    );
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

  const handleDeleteDocument = (document: DocumentItem) => {
    setDocuments(prev => prev.filter(doc => doc.id !== document.id));
    toast.success("Document deleted successfully");
  };

  return (
    <ThreeColumnLayout activeMainItem="client-legacy-vault" title="Secure Family Vault">
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

            <Button
              onClick={() => window.open('https://trustandwill.com', '_blank')}
              variant="outline"
              className="flex items-center gap-2 bg-white border-primary text-primary hover:bg-primary hover:text-white transition-colors shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">DIY with Trust & Will</span>
              <span className="sm:hidden">Trust & Will</span>
            </Button>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
              <TabsTrigger value="documents" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <VaultIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Important Documents</span>
              </TabsTrigger>
              <TabsTrigger value="legacy-box" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <ArchiveIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Family Legacy Box</span>
              </TabsTrigger>
              <TabsTrigger value="healthcare" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <HeartPulseIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Healthcare</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  onClick={() => setIsNewFolderDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 order-2 sm:order-1"
                >
                  <FolderPlus className="h-4 w-4" />
                  New Folder
                </Button>
                
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)} 
                  className="flex items-center gap-2 order-1 sm:order-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
              
              {/* Documents Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <div className="xl:col-span-1 order-2 xl:order-1">
                  <Card className="sticky top-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CategoryList 
                        categories={importantDocumentCategories as DocumentCategory[]} 
                        activeCategory={activeCategory} 
                        onCategorySelect={setActiveCategory} 
                      />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Documents Table */}
                <div className="xl:col-span-3 order-1 xl:order-2">
                  <Card>
                    <CardContent className="p-0">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      ) : filteredDocuments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <DocumentsTable 
                            documents={filteredDocuments}
                            onEditDocument={handleEditDocument}
                            onShareDocument={handleShareDocument}
                            onDeleteDocument={handleDeleteDialog}
                          />
                        </div>
                      ) : (
                        <div className="p-6">
                          {activeCategory === "all" ? (
                            <NoCategorySelectedState />
                          ) : (
                            <NoDocumentsState 
                              onUploadClick={() => setIsUploadDialogOpen(true)}
                              categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}
                            />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Legacy Box Tab */}
            <TabsContent value="legacy-box" className="space-y-6">
              <FamilyLegacyBox />
            </TabsContent>

            {/* Healthcare Tab */}
            <TabsContent value="healthcare" className="space-y-6">
              <HealthcareFolder 
                documents={documents} 
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
          onFileUpload={handleUploadDocument}
          activeCategory={activeCategory}
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
