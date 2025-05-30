
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, ChevronRight, File } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Documents = () => {
  const {
    documents,
    activeCategory,
    isUploadDialogOpen,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments
  } = useDocumentManagement();

  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

  // Reorder categories to move "other" to the end
  const reorderedCategories = documentCategories.filter(c => c.id !== "other").concat(
    documentCategories.filter(c => c.id === "other")
  );

  const activeCategoryName = activeCategory 
    ? reorderedCategories.find(c => c.id === activeCategory)?.name 
    : null;

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
                <div className="space-y-1">
                  {reorderedCategories.map((category) => (
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
                  <span className="text-muted-foreground">Documents</span>
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
                      <DocumentsTable 
                        documents={filteredDocuments}
                        onViewDocument={(doc) => console.log('View:', doc)}
                        onDownloadDocument={(doc) => console.log('Download:', doc)}
                      />
                    </div>
                  ) : (
                    /* Empty State for Selected Category */
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
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={reorderedCategories}
        />

        <NewFolderDialog
          open={isNewFolderDialogOpen}
          onOpenChange={setIsNewFolderDialogOpen}
          onCreateFolder={handleCreateFolder}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
};

export default Documents;
