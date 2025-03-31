
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface DocumentCategory {
  id: string;
  name: string;
  count: number;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  lastModified: Date;
  shared: boolean;
}

export default function LegacyVault() {
  const { userProfile } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Demo categories
  const categories: DocumentCategory[] = [
    { id: "all", name: "All Documents", count: 12 },
    { id: "tax", name: "Tax Documents", count: 5 },
    { id: "estate", name: "Estate Planning", count: 3 },
    { id: "insurance", name: "Insurance Policies", count: 2 },
    { id: "investments", name: "Investment Statements", count: 2 },
    { id: "properties", name: "Property Records", count: 0 },
  ];
  
  // Demo documents
  const allDocuments: DocumentItem[] = [
    { id: "1", name: "2023 Tax Return.pdf", type: "PDF", size: "2.4 MB", category: "tax", lastModified: new Date("2023-04-15"), shared: true },
    { id: "2", name: "Trust Agreement.docx", type: "DOCX", size: "568 KB", category: "estate", lastModified: new Date("2022-11-03"), shared: false },
    { id: "3", name: "Life Insurance Policy.pdf", type: "PDF", size: "3.1 MB", category: "insurance", lastModified: new Date("2022-08-22"), shared: true },
    { id: "4", name: "Home Deed.pdf", type: "PDF", size: "1.7 MB", category: "properties", lastModified: new Date("2021-06-10"), shared: false },
    { id: "5", name: "Will.pdf", type: "PDF", size: "1.2 MB", category: "estate", lastModified: new Date("2022-05-18"), shared: true },
    { id: "6", name: "Q2 Investment Statement.pdf", type: "PDF", size: "942 KB", category: "investments", lastModified: new Date("2023-07-14"), shared: false },
  ];
  
  // Filter documents based on activeCategory and searchTerm
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesCategory = activeCategory === "" || activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleDeleteDocument = (id: string) => {
    console.log(`Delete document with ID: ${id}`);
  };
  
  const handleUploadDocument = (documentData: { file: File; name: string; category: string }) => {
    console.log("Document uploaded:", documentData);
    setShowUploadDialog(false);
  };
  
  const handleCreateFolder = (folderName: string) => {
    console.log("Folder created:", folderName);
    setShowNewFolderDialog(false);
  };
  
  const activeCategoryName = activeCategory 
    ? categories.find(cat => cat.id === activeCategory)?.name || ""
    : "";

  return (
    <ThreeColumnLayout title="Legacy Vault" activeMainItem="legacy-vault">
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Legacy Vault</h1>
            <p className="text-muted-foreground mt-1">
              Securely store and organize your important documents
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewFolderDialog(true)}
                className="flex items-center gap-2"
              >
                <FolderPlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">New Folder</span>
              </Button>
              
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="flex items-center gap-2"
              >
                <UploadIcon className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CategoryList 
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>
            
            <div className="lg:col-span-3">
              {activeCategory ? (
                filteredDocuments.length > 0 ? (
                  <DocumentsTable 
                    documents={filteredDocuments}
                    onDelete={handleDeleteDocument}
                  />
                ) : (
                  <NoDocumentsState 
                    onUploadClick={() => setShowUploadDialog(true)} 
                    categoryName={activeCategoryName} 
                  />
                )
              ) : (
                <NoCategorySelectedState />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <UploadDocumentDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUploadDocument}
        categories={categories}
      />
      
      <NewFolderDialog 
        open={showNewFolderDialog}
        onOpenChange={setShowNewFolderDialog}
        onCreateFolder={handleCreateFolder}
      />
    </ThreeColumnLayout>
  );
}
