
import React, { useState } from "react";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentItem, DocumentCategory } from "@/types/document";
import { documentCategories } from "@/data/documentCategories";
import { VaultActions } from "./VaultActions";
import { VaultContent } from "./VaultContent";

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
      <VaultActions />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryList 
            categories={importantDocumentCategories as DocumentCategory[]} 
            activeCategory={activeCategory} 
            onCategorySelect={setActiveCategory} 
          />
        </div>
        
        <div className="md:col-span-3">
          <VaultContent 
            isLoading={isLoading}
            documents={filteredDocuments}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  );
}
