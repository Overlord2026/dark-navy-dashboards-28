
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";

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
                
                <UploadDocumentDialog 
                  isOpen={isUploadDialogOpen}
                  onOpenChange={setIsUploadDialogOpen}
                  onFileUpload={handleFileUpload}
                  activeCategory={activeCategory}
                  documentCategories={documentCategories}
                />
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
    </ThreeColumnLayout>
  );
};

export default Documents;
