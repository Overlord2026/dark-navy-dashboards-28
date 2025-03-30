
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Folder, Upload, ChevronRight } from "lucide-react";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";

// Mock document categories
const documentCategories = [
  { id: "estate-planning", name: "Estate Planning" },
  { id: "insurance", name: "Insurance" },
  { id: "financial-statements", name: "Financial Statements" },
  { id: "tax-returns", name: "Tax Returns" },
  { id: "legal-documents", name: "Legal Documents" },
  { id: "wills-trusts", name: "Wills & Trusts" },
];

export default function LegacyVault() {
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

  return (
    <ThreeColumnLayout title="Legacy Vault" activeMainItem="legacy-vault">
      <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Legacy Vault</h1>
            <p className="text-muted-foreground">
              Secure your important documents for your legacy planning
            </p>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span className="font-medium">Documents</span>
          {activeCategory && (
            <>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>{documentCategories.find(cat => cat.id === activeCategory)?.name}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left sidebar - Categories */}
          <div className="md:col-span-1 space-y-4">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Categories</h3>
              <ul className="space-y-1">
                {documentCategories.map((category) => (
                  <li key={category.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeCategory === category.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content area - Documents */}
          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeCategory 
                  ? documentCategories.find(cat => cat.id === activeCategory)?.name 
                  : "All Documents"}
              </h2>
              <div className="flex gap-2">
                <NewFolderDialog onCreateFolder={handleCreateFolder} />
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)} 
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Document listing table or empty states */}
            <div className="bg-card border rounded-md">
              {!activeCategory ? (
                <NoCategorySelectedState />
              ) : filteredDocuments.length > 0 ? (
                <DocumentsTable documents={filteredDocuments} />
              ) : (
                <NoDocumentsState 
                  onUploadClick={() => setIsUploadDialogOpen(true)} 
                  categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name}
                />
              )}
            </div>
          </div>
        </div>

        {/* Upload document dialog */}
        <UploadDocumentDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={documentCategories}
        />
      </div>
    </ThreeColumnLayout>
  );
}
