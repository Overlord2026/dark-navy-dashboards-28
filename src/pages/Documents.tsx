
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, Search } from "lucide-react";
import { DocumentSearch } from "@/components/documents/DocumentSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Documents = () => {
  const {
    documents,
    activeCategory,
    isUploadDialogOpen,
    isNewFolderDialogOpen,
    searchQuery,
    setActiveCategory,
    setIsUploadDialogOpen,
    setIsNewFolderDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments,
    setSearchQuery
  } = useDocumentManagement();

  // Find active category name
  const activeCategoryName = activeCategory 
    ? documentCategories.find(c => c.id === activeCategory)?.name 
    : null;

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      title="Documents"
    >
      <div className="animate-fade-in p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Document Management</h1>
            <p className="text-muted-foreground">Manage and organize your important documents</p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <DocumentSearch 
              onSearch={setSearchQuery}
              initialQuery={searchQuery}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <CategoryList 
                  categories={documentCategories}
                  activeCategory={activeCategory}
                  onCategorySelect={setActiveCategory}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {activeCategory && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">
                    {activeCategoryName} Documents
                  </h2>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setIsNewFolderDialogOpen(true)}
                    >
                      <FolderPlus className="h-5 w-5" />
                      New Folder
                    </Button>
                    
                    <Button
                      className="flex items-center gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
                      onClick={() => setIsUploadDialogOpen(true)}
                    >
                      <Upload className="h-5 w-5" />
                      Upload Document
                    </Button>
                  </div>
                </div>
                
                {filteredDocuments.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <DocumentsTable documents={filteredDocuments} />
                    </CardContent>
                  </Card>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Search className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No results found</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      We couldn't find any documents matching "{searchQuery}" in this category. 
                      Try adjusting your search or browse all documents.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <NoDocumentsState 
                    onUploadClick={() => setIsUploadDialogOpen(true)} 
                    categoryName={activeCategoryName || ""}
                  />
                )}
              </div>
            )}
            
            {!activeCategory && <NoCategorySelectedState />}
          </div>
        </div>
      </div>

      <UploadDocumentDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={handleFileUpload}
        activeCategory={activeCategory}
        documentCategories={documentCategories}
      />
      
      <NewFolderDialog 
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </ThreeColumnLayout>
  );
};

export default Documents;
