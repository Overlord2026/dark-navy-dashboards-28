

import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SupabaseDocumentsTable } from "@/components/documents/SupabaseDocumentsTable";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { SupabaseDocumentUploadDialog } from "@/components/documents/SupabaseDocumentUploadDialog";
import { useSupabaseDocumentManagement } from "@/hooks/useSupabaseDocumentManagement";
import { Button } from "@/components/ui/button";
import { Upload, ChevronRight, File } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { cn } from "@/lib/utils";

const Documents = () => {
  const {
    documents,
    categories,
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument
  } = useSupabaseDocumentManagement();

  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{id: string | null, name: string}>>([]);

  const activeCategoryName = activeCategory 
    ? categories.find(c => c.id === activeCategory)?.name 
    : null;

  const handleCreateFolderWithCategory = (folderName: string) => {
    if (activeCategory) {
      handleCreateFolder(folderName, activeCategory, currentFolderId);
    }
    setIsNewFolderDialogOpen(false);
  };

  const handleDeleteDocument = async (document: any) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      await deleteDocument(document.id);
    }
  };

  const handleViewFolder = (folder: any) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleNavigateBack = (targetId: string | null) => {
    setCurrentFolderId(targetId);
    const targetIndex = breadcrumbs.findIndex(b => b.id === targetId);
    if (targetIndex >= 0) {
      setBreadcrumbs(breadcrumbs.slice(0, targetIndex + 1));
    } else {
      setBreadcrumbs([]);
    }
  };

  const handleFileUploadWithFolder = async (file: File, name: string, category: string) => {
    return await handleFileUpload(file, name, category, currentFolderId);
  };

  // Filter documents based on current folder and category
  const filteredDocuments = documents.filter(doc => {
    if (activeCategory && doc.category !== activeCategory) return false;
    
    // Show documents in the current folder
    if (currentFolderId) {
      return doc.parent_folder_id === currentFolderId;
    } else {
      // Show only root level documents (no parent folder)
      return !doc.parent_folder_id;
    }
  });

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="documents" title="">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="documents" title="">
      <ProfessionalsProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Left Sidebar - Categories */}
          <div className="w-80 bg-background border-r border-border">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <File className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Documents</h1>
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Categories</h2>
                {categories.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No categories available</div>
                ) : (
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setCurrentFolderId(null);
                          setBreadcrumbs([]);
                        }}
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
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header with Breadcrumb and Actions */}
            <div className="bg-background border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {activeCategoryName && (
                    <button 
                      onClick={() => handleNavigateBack(null)}
                      className="text-foreground font-medium hover:underline"
                    >
                      {activeCategoryName}
                    </button>
                  )}
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.id}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <button 
                        onClick={() => handleNavigateBack(crumb.id)}
                        className="text-foreground font-medium hover:underline"
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                
                {activeCategory && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setIsUploadDialogOpen(true)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={loading || uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-background">
              {!activeCategory ? (
                /* Welcome State - No Category Selected */
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
                /* Documents Table */
                <div className="p-6">
                  {filteredDocuments.length > 0 ? (
                    <div className="bg-background rounded-lg border border-border overflow-hidden">
                      <SupabaseDocumentsTable 
                        documents={filteredDocuments}
                        onDownloadDocument={handleDownloadDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onViewDocument={handleViewFolder}
                        loading={loading}
                      />
                    </div>
                  ) : loading ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-muted-foreground">Loading documents...</div>
                    </div>
                  ) : (
                    /* Empty State for Selected Category */
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                          <File className="h-8 w-8 text-accent-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          {currentFolderId ? 'Folder is Empty' : 'No Documents Yet'}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                          {currentFolderId 
                            ? 'This folder is empty. Add some files to get started.'
                            : `Upload your first document to the ${activeCategoryName} category to get started.`
                          }
                        </p>
                        <div className="flex items-center justify-center gap-3">
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
        <SupabaseDocumentUploadDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUploadWithFolder}
          activeCategory={activeCategory}
          categories={categories}
          uploading={uploading}
        />

        <NewFolderDialog
          open={isNewFolderDialogOpen}
          onOpenChange={setIsNewFolderDialogOpen}
          onCreateFolder={handleCreateFolderWithCategory}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
};

export default Documents;

