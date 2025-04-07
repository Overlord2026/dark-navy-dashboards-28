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

export default function LegacyVault() {
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
    },
    {
      id: "2",
      name: "Insurance Policies",
      type: "folder",
      category: "insurance",
      created: new Date().toISOString(),
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
    <ThreeColumnLayout activeMainItem="legacy-vault" title="Secure Family Vault">
      <ProfessionalsProvider>
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Secure Family Vault</h1>
              <p className="text-muted-foreground">Store and organize your important documents securely</p>
            </div>

            <Button
              onClick={() => window.open('https://trustandwill.com', '_blank')}
              variant="outline"
              className="flex items-center mt-4 md:mt-0 bg-white border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              DIY with Trust & Will
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <VaultIcon className="h-4 w-4" />
                Important Documents
              </TabsTrigger>
              <TabsTrigger value="legacy-box" className="flex items-center gap-2">
                <ArchiveIcon className="h-4 w-4" />
                Family Legacy Box
              </TabsTrigger>
              <TabsTrigger value="healthcare" className="flex items-center gap-2">
                <HeartPulseIcon className="h-4 w-4" />
                Healthcare
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-end space-x-4">
                <Button 
                  onClick={() => setIsNewFolderDialogOpen(true)}
                  variant="outline"
                  className="flex items-center"
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
                
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)} 
                  className="flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <CategoryList 
                    categories={importantDocumentCategories as DocumentCategory[]} 
                    activeCategory={activeCategory} 
                    onCategorySelect={setActiveCategory} 
                  />
                </div>
                
                <div className="md:col-span-3">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredDocuments.length > 0 ? (
                    <DocumentsTable 
                      documents={filteredDocuments}
                      onEditDocument={handleEditDocument}
                      onShareDocument={handleShareDocument}
                      onDeleteDocument={handleDeleteDialog}
                    />
                  ) : (
                    activeCategory === "all" ? (
                      <NoCategorySelectedState />
                    ) : (
                      <NoDocumentsState 
                        onUploadClick={() => setIsUploadDialogOpen(true)}
                        categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}
                      />
                    )
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="legacy-box">
              <FamilyLegacyBox />
            </TabsContent>

            <TabsContent value="healthcare">
              <HealthcareFolder 
                documents={documents} 
                onAddDocument={handleAddDocument}
                onCreateFolder={handleCreateFolder}
              />
            </TabsContent>
          </Tabs>
        </div>
        
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
