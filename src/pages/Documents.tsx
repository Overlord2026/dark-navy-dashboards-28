
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

  // Find active category name
  const activeCategoryName = activeCategory 
    ? reorderedCategories.find(c => c.id === activeCategory)?.name 
    : null;

  return (
    <ThreeColumnLayout activeMainItem="documents" title="">
      <ProfessionalsProvider>
        <div className="min-h-screen bg-[#0f172a] text-white flex">
          {/* Left Sidebar - Categories */}
          <div className="w-80 bg-[#1e293b] border-r border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <File className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-white">Documents</h1>
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Categories</h2>
                <div className="space-y-1">
                  {reorderedCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header with Breadcrumb and Actions */}
            <div className="bg-[#1e293b] border-b border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Documents</span>
                  {activeCategoryName && (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                      <span className="text-white">{activeCategoryName}</span>
                    </>
                  )}
                </div>
                
                {activeCategory && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setIsNewFolderDialogOpen(true)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Folder
                    </Button>
                    <Button
                      onClick={() => setIsUploadDialogOpen(true)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[#0f172a]">
              {!activeCategory ? (
                /* Welcome State - No Category Selected */
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <File className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Select a Category</h3>
                    <p className="text-gray-400 max-w-sm">
                      Choose a document category from the sidebar to view and manage your documents.
                    </p>
                  </div>
                </div>
              ) : (
                /* Documents Table */
                <div className="p-6">
                  {filteredDocuments.length > 0 ? (
                    <div className="bg-[#1e293b] rounded-lg border border-gray-700 overflow-hidden">
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
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <File className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No Documents Yet</h3>
                        <p className="text-gray-400 mb-6 max-w-sm">
                          Upload your first document to the {activeCategoryName} category to get started.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            onClick={() => setIsNewFolderDialogOpen(true)}
                            variant="outline"
                            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <FolderPlus className="h-4 w-4 mr-2" />
                            Create Folder
                          </Button>
                          <Button
                            onClick={() => setIsUploadDialogOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
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
