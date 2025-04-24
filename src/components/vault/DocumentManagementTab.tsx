
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload } from "lucide-react";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState, NoCategorySelectedState } from "@/components/documents/EmptyStates";
import { documentCategories } from "@/data/documentCategories";
import { DocumentItem, DocumentCategory } from "@/types/document";

const importantDocumentCategories = documentCategories.filter(cat => 
  ["documents-to-sign", "bfo-records", "alternative-investments", 
   "business-ownership", "education", "employer-agreements", 
   "leases", "property-ownership", 
   "statements", "taxes", "vehicles"].includes(cat.id)
);

export function DocumentManagementTab() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDocuments = activeCategory === "all"
    ? documents
    : documents.filter(doc => doc.category === activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={() => window.dispatchEvent(new CustomEvent('open-new-folder-dialog'))}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
        
        <Button 
          className="flex items-center"
          onClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryList 
            categories={importantDocumentCategories as DocumentCategory[]} 
            activeCategory={activeCategory} 
            onCategorySelect={setActiveCategory} 
          />
        </div>
        
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <DocumentsTable 
              documents={filteredDocuments}
              onEditDocument={(doc) => window.dispatchEvent(new CustomEvent('open-edit-dialog', { detail: doc }))}
              onShareDocument={(doc) => window.dispatchEvent(new CustomEvent('open-share-dialog', { detail: doc }))}
              onDeleteDocument={(doc) => window.dispatchEvent(new CustomEvent('open-delete-dialog', { detail: doc }))}
            />
          ) : (
            activeCategory === "all" ? (
              <NoCategorySelectedState />
            ) : (
              <NoDocumentsState 
                onUploadClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
                categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
