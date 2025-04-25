
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ProfessionalsProvider } from "@/contexts/ProfessionalsContext";

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

  // Find active category name
  const activeCategoryName = activeCategory 
    ? documentCategories.find(c => c.id === activeCategory)?.name 
    : null;

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      title="Documents"
    >
      <ProfessionalsProvider>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold mb-6">Documents</h1>
          
          <CategoryList 
            categories={documentCategories}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
          
          {activeCategory && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">
                  {activeCategoryName}
                </h2>
                <div className="flex space-x-3">
                  <NewFolderDialog onCreateFolder={handleCreateFolder} />
                  
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <Upload className="h-5 w-5" />
                    Upload Documents
                  </Button>
                </div>
              </div>
              
              {filteredDocuments.length > 0 ? (
                <DocumentsTable documents={filteredDocuments} />
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

        <UploadDocumentDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={documentCategories}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
};

export default Documents;
