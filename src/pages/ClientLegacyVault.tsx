
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
import { FolderPlus, Upload, ExternalLink, ArchiveIcon, HeartPulseIcon, Activity, FileText, Pill } from "lucide-react";
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
  const [healthcareActiveTab, setHealthcareActiveTab] = useState("dashboard");
  
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

            {/* Healthcare Tab with Sub-tabs */}
            <TabsContent value="healthcare" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulseIcon className="h-5 w-5" />
                    Healthcare Management
                  </CardTitle>
                  <CardDescription>
                    Manage your healthcare documents, prescriptions, and medical information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={healthcareActiveTab} onValueChange={setHealthcareActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="dashboard" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                      </TabsTrigger>
                      <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Prescriptions
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Healthcare Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Quick overview of your healthcare status and recent activities.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recent Documents</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Your most recently uploaded healthcare documents.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Prescription Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              Current prescriptions and medication reminders.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Healthcare Documents</h3>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => setIsNewFolderDialogOpen(true)}
                              variant="outline"
                              size="sm"
                            >
                              <FolderPlus className="mr-2 h-4 w-4" />
                              New Folder
                            </Button>
                            <Button 
                              onClick={() => setIsUploadDialogOpen(true)}
                              size="sm"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-1">
                            <CategoryList 
                              categories={healthcareCategories as DocumentCategory[]} 
                              activeCategory={activeCategory || ""} 
                              onCategorySelect={setActiveCategory} 
                            />
                          </div>
                          
                          <div className="md:col-span-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Document Categories</CardTitle>
                                <CardDescription className="text-xs">
                                  Healthcare, Insurance Coverage, Prescriptions & Medications, Physicians & Providers, Medical Records & Documents
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <HealthcareFolder 
                                  documents={[]} 
                                  onAddDocument={handleAddDocument}
                                  onCreateFolder={handleCreateFolder}
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Prescriptions Tab */}
                    <TabsContent value="prescriptions" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Prescription Management
                          </CardTitle>
                          <CardDescription>
                            Manage your prescriptions and medication schedules
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Prescription Management</h3>
                            <p className="text-muted-foreground mb-4">
                              Track your medications, dosages, and refill schedules
                            </p>
                            <Button>
                              <Pill className="mr-2 h-4 w-4" />
                              Add Prescription
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
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
