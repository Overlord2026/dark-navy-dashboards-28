
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, ChevronLeft } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { useState } from "react";
import { Card } from "@/components/ui/card";

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

  // Find active category name
  const activeCategoryName = activeCategory 
    ? documentCategories.find(c => c.id === activeCategory)?.name 
    : null;

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      title="Document Management"
    >
      <ProfessionalsProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Document Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organize and manage your documents by category
              </p>
            </div>

            {!activeCategory ? (
              /* Categories Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documentCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-xl">📁</span>
                        </div>
                      </div>
                      
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {filteredDocuments.filter(doc => doc.category === category.id).length} documents
                        </span>
                        <div className="text-blue-600 dark:text-blue-400">→</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              /* Category Detail View */
              <div className="space-y-6">
                {/* Back Button and Category Header */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveCategory(null)}
                    className="p-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeCategoryName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredDocuments.length} documents in this category
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsNewFolderDialogOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                  </Button>
                  <Button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>

                {/* Documents List */}
                <Card className="p-6">
                  {filteredDocuments.length > 0 ? (
                    <DocumentsTable 
                      documents={filteredDocuments}
                      onViewDocument={(doc) => console.log('View:', doc)}
                      onDownloadDocument={(doc) => console.log('Download:', doc)}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No documents yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Upload your first document to get started
                      </p>
                      <Button
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <UploadDocumentDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={documentCategories}
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
