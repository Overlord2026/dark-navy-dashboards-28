
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SupabaseDocumentsTable } from "@/components/documents/SupabaseDocumentsTable";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { SupabaseDocumentUploadDialog } from "@/components/documents/SupabaseDocumentUploadDialog";
import { useSupabaseDocumentManagement } from "@/hooks/useSupabaseDocumentManagement";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, ChevronRight, File, Menu, X } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const isMobile = useIsMobile();

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

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentFolderId(null);
    setBreadcrumbs([]);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
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

  // Categories Sidebar Component
  const CategoriesSidebar = ({ className = "" }: { className?: string }) => (
    <div className={cn("bg-background border-r border-border h-full", className)}>
      <div className={cn("p-6", isMobile && "p-4")}>
        <div className={cn("flex items-center gap-3 mb-6", isMobile && "mb-4")}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <File className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className={cn("text-xl font-semibold text-foreground", isMobile && "text-lg")}>Documents</h1>
        </div>
        
        <div className={cn("mb-6", isMobile && "mb-4")}>
          <h2 className={cn("text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider", isMobile && "text-xs mb-2")}>Categories</h2>
          {categories.length === 0 ? (
            <div className={cn("text-muted-foreground text-sm", isMobile && "text-xs")}>No categories available</div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "group flex items-center py-2 px-3 rounded-md transition-colors text-[14px] whitespace-nowrap border w-full text-left",
                    isMobile && "py-3 px-2 text-sm",
                    activeCategory === category.id
                      ? "bg-black text-[#E2E2E2] font-medium border-primary"
                      : "text-foreground border-transparent hover:bg-sidebar-accent hover:border-primary"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium truncate">{category.name}</span>
                    {activeCategory === category.id && (
                      <div className="w-2 h-2 bg-[#E2E2E2] rounded-full flex-shrink-0 ml-2"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          {/* Desktop Sidebar - Categories */}
          {!isMobile && (
            <CategoriesSidebar className="w-80 flex-shrink-0" />
          )}

          {/* Mobile Sidebar - Categories */}
          {isMobile && (
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetContent side="left" className="w-[280px] p-0">
                <CategoriesSidebar />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header with Breadcrumb and Actions */}
            <div className={cn("bg-background border-b border-border px-6 py-4", isMobile && "px-4 py-3")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm min-w-0">
                  {/* Mobile menu trigger */}
                  {isMobile && (
                    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="mr-2 p-1">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </Sheet>
                  )}
                  
                  {activeCategoryName && (
                    <button 
                      onClick={() => handleNavigateBack(null)}
                      className={cn("text-foreground font-medium hover:underline truncate", isMobile && "text-sm")}
                    >
                      {activeCategoryName}
                    </button>
                  )}
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.id}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <button 
                        onClick={() => handleNavigateBack(crumb.id)}
                        className={cn("text-foreground font-medium hover:underline truncate", isMobile && "text-sm")}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                
                {activeCategory && (
                  <div className={cn("flex items-center gap-3", isMobile && "flex-col gap-2 ml-2")}>
                    <Button
                      onClick={() => setIsNewFolderDialogOpen(true)}
                      size="sm"
                      variant="outline"
                      className={cn("border-primary/20 hover:border-primary/40 whitespace-nowrap", isMobile && "w-full text-xs px-2")}
                      disabled={loading}
                    >
                      <FolderPlus className={cn("h-4 w-4 mr-2", isMobile && "h-3 w-3 mr-1")} />
                      New Folder
                    </Button>
                    <Button
                      onClick={() => setIsUploadDialogOpen(true)}
                      size="sm"
                      className={cn("bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap", isMobile && "w-full text-xs px-2")}
                      disabled={loading || uploading}
                    >
                      <Upload className={cn("h-4 w-4 mr-2", isMobile && "h-3 w-3 mr-1")} />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-background overflow-hidden">
              {!activeCategory ? (
                /* Welcome State - No Category Selected */
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <File className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <h3 className={cn("text-lg font-medium text-foreground mb-2", isMobile && "text-base")}>Select a Category</h3>
                    <p className={cn("text-muted-foreground", isMobile && "text-sm")}>
                      {isMobile ? "Tap the menu to choose a document category." : "Choose a document category from the sidebar to view and manage your documents."}
                    </p>
                    {isMobile && (
                      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                        <SheetTrigger asChild>
                          <Button variant="outline" className="mt-4">
                            <Menu className="h-4 w-4 mr-2" />
                            Browse Categories
                          </Button>
                        </SheetTrigger>
                      </Sheet>
                    )}
                  </div>
                </div>
              ) : (
                /* Documents Table */
                <div className={cn("p-6 overflow-auto", isMobile && "p-4")}>
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
                      <div className="text-center max-w-sm">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                          <File className="h-8 w-8 text-accent-foreground" />
                        </div>
                        <h3 className={cn("text-lg font-medium text-foreground mb-2", isMobile && "text-base")}>
                          {currentFolderId ? 'Folder is Empty' : 'No Documents Yet'}
                        </h3>
                        <p className={cn("text-muted-foreground mb-6", isMobile && "text-sm mb-4")}>
                          {currentFolderId 
                            ? 'This folder is empty. Add some files or create new folders to get started.'
                            : `Upload your first document to the ${activeCategoryName} category to get started.`
                          }
                        </p>
                        <div className={cn("flex items-center justify-center gap-3", isMobile && "flex-col w-full")}>
                          <Button
                            onClick={() => setIsNewFolderDialogOpen(true)}
                            variant="outline"
                            className={cn("border-primary/20 hover:border-primary/40", isMobile && "w-full")}
                          >
                            <FolderPlus className={cn("h-4 w-4 mr-2", isMobile && "h-3 w-3")} />
                            New Folder
                          </Button>
                          <Button
                            onClick={() => setIsUploadDialogOpen(true)}
                            className={cn("bg-primary hover:bg-primary/90 text-primary-foreground", isMobile && "w-full")}
                          >
                            <Upload className={cn("h-4 w-4 mr-2", isMobile && "h-3 w-3")} />
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
