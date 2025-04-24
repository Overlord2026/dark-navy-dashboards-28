
import React from "react";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState, NoCategorySelectedState } from "@/components/documents/EmptyStates";
import { DocumentItem } from "@/types/document";

interface VaultContentProps {
  isLoading: boolean;
  documents: DocumentItem[];
  activeCategory: string;
}

export function VaultContent({ isLoading, documents, activeCategory }: VaultContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (documents.length > 0) {
    return (
      <DocumentsTable 
        documents={documents}
        onEditDocument={(doc) => window.dispatchEvent(new CustomEvent('open-edit-dialog', { detail: doc }))}
        onShareDocument={(doc) => window.dispatchEvent(new CustomEvent('open-share-dialog', { detail: doc }))}
        onDeleteDocument={(doc) => window.dispatchEvent(new CustomEvent('open-delete-dialog', { detail: doc }))}
      />
    );
  }

  return activeCategory === "all" ? (
    <NoCategorySelectedState />
  ) : (
    <NoDocumentsState 
      onUploadClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
      categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}
    />
  );
}
