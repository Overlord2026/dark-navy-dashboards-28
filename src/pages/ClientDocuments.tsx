
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { EditDocumentDialog } from "@/components/documents/EditDocumentDialog";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { CategoryList } from "@/components/documents/CategoryList";
import { useSupabaseDocuments } from "@/hooks/useSupabaseDocuments";
import { useDocumentPermissions } from "@/hooks/useDocumentPermissions";
import { documentCategories } from "@/data/documentCategories";
import { DocumentItem } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, ChevronRight, File, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ClientDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    documents,
    loading,
    error,
    uploadDocument,
    createFolder,
    deleteDocument,
    updateDocument,
    downloadDocument,
    getDocumentsByCategory
  } = useSupabaseDocuments();

  const { shareDocument } = useDocumentPermissions();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Filter categories to only show relevant ones
  const relevantCategories = documentCategories.filter(c => c.id !== "other");
  const activeCategoryName = activeCategory 
    ? relevantCategories.find(c => c.id === activeCategory)?.name 
    : null;

  const filteredDocuments = getDocumentsByCategory(activeCategory);

  const handleUploadDocument = async (file: File, customName: string) => {
    if (!activeCategory) {
      return;
    }
    await uploadDocument(file, customName, activeCategory);
    setIsUploadDialogOpen(false);
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!activeCategory) {
      return;
    }
    await createFolder(folderName, activeCategory);
    setIsNewFolderDialogOpen(false);
  };

  const handleEditDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleSaveDocument = async (document: DocumentItem, newName: string) => {
    await updateDocument(document.id, { name: newName });
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDialog = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async (document: DocumentItem) => {
    await deleteDocument(document.id);
    setIsDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleShareDocument = async (document: DocumentItem) => {
    // This would open a share dialog - for now just show a toast
    console.log('Share document:', document);
  };

  const handleDownloadDocument = async (document: DocumentItem) => {
    await downloadDocument(document.id);
  };

  if (!isAuthenticated) {
    return (
      <ThreeColumnLayout activeMainItem="client-documents" title="Client Documents">
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access your documents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="client-documents" title="Client Documents">
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Left Sidebar - Categories */}
        <div className="w-80 bg-background border-r border-border">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <File className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Client Documents</h1>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Categories</h2>
              <div className="space-y-1">
                {relevantCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 border",
                      activeCategory === category.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]'
                        : 'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent/50 hover:shadow-sm'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      {activeCategory === category.id && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with Breadcrumb and Actions */}
          <div className="bg-background border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Client Documents</span>
                {activeCategoryName && (
                  <>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{activeCategoryName}</span>
                  </>
                )}
              </div>
              
              {activeCategory && (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsNewFolderDialogOpen(true)}
                    size="sm"
                    variant="outline"
                    className="border-primary/20 hover:border-primary/40"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                  <Button
                    onClick={() => setIsUploadDialogOpen(true)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-background">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading documents...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <Card className="max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle className="text-red-600">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ) : !activeCategory ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <File className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a Category</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Choose a document category from the sidebar to view and manage your documents.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {filteredDocuments.length > 0 ? (
                  <div className="bg-background rounded-lg border border-border overflow-hidden">
                    <DocumentsTable 
                      documents={filteredDocuments}
                      onEditDocument={handleEditDocument}
                      onShareDocument={handleShareDocument}
                      onDeleteDocument={handleDeleteDialog}
                      onDownloadDocument={handleDownloadDocument}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <File className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No Documents Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Upload your first document to the {activeCategoryName} category to get started.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          onClick={() => setIsNewFolderDialogOpen(true)}
                          variant="outline"
                          className="border-primary/20 hover:border-primary/40"
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          New Folder
                        </Button>
                        <Button
                          onClick={() => setIsUploadDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UploadDocumentDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onFileUpload={handleUploadDocument}
        activeCategory={activeCategory}
        documentCategories={relevantCategories}
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

      <DeleteDocumentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        document={selectedDocument}
        onConfirm={handleDeleteDocument}
      />
    </ThreeColumnLayout>
  );
};

export default ClientDocuments;
