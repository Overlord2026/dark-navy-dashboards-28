
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { Button } from "@/components/ui/button";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { healthcareCategories } from "@/data/documentCategories";
import { healthcareTags, DocumentItem, DocumentTag } from "@/types/document";
import { Upload, FolderPlus, Tag } from "lucide-react";
import { CategoryList } from "@/components/documents/CategoryList";
import { toast } from "sonner";

interface HealthcareFolderProps {
  documents: DocumentItem[];
  onAddDocument: (document: DocumentItem) => void;
  onCreateFolder: (folderName: string, category: string) => void;
}

export const HealthcareFolder: React.FC<HealthcareFolderProps> = ({
  documents,
  onAddDocument,
  onCreateFolder
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>("healthcare");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const healthcareDocuments = documents.filter(doc => 
    doc.category === activeSubcategory || 
    (activeSubcategory === "healthcare" && healthcareCategories.some(c => c.id === doc.category))
  );
  
  const filteredDocuments = selectedTags.length > 0 
    ? healthcareDocuments.filter(doc => 
        doc.tags?.some(tag => selectedTags.includes(tag))
      )
    : healthcareDocuments;

  const handleUploadDocument = (file: File, customName: string) => {
    // Determine document type based on file extension
    let docType: "pdf" | "image" | "document" = "document";
    if (file.type.includes("pdf")) {
      docType = "pdf";
    } else if (file.type.includes("image")) {
      docType = "image";
    }

    const newDocument: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName || file.name,
      type: docType,
      category: activeSubcategory,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      size: file.size,
      uploadedBy: "Tom Brady",
      tags: selectedTags
    };
    
    onAddDocument(newDocument);
    setIsUploadDialogOpen(false);
    toast.success("Healthcare document uploaded successfully");
  };

  const handleCreateFolder = (folderName: string) => {
    onCreateFolder(folderName, activeSubcategory);
    setIsNewFolderDialogOpen(false);
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // Filter tags relevant to the selected subcategory
  const relevantTags = activeSubcategory === "healthcare" 
    ? healthcareTags 
    : healthcareTags.filter(tag => tag.category === activeSubcategory);

  const activeSubcategoryName = healthcareCategories.find(cat => cat.id === activeSubcategory)?.name || "Healthcare";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Healthcare Documents</h2>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsNewFolderDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryList
            categories={healthcareCategories}
            activeCategory={activeSubcategory}
            onCategorySelect={setActiveSubcategory}
          />
          
          {relevantTags.length > 0 && (
            <Card className="mt-6 bg-[#0a1629] border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {relevantTags.map(tag => (
                    <Button
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toggleTag(tag.id)}
                    >
                      <Tag className="h-3 w-3" />
                      <span className="text-xs">{tag.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-3">
          {filteredDocuments.length > 0 ? (
            <DocumentsTable documents={filteredDocuments} />
          ) : (
            <NoDocumentsState
              onUploadClick={() => setIsUploadDialogOpen(true)}
              categoryName={activeSubcategoryName}
            />
          )}
        </div>
      </div>

      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={handleUploadDocument}
        activeCategory={activeSubcategory}
        documentCategories={healthcareCategories}
      />
      
      <NewFolderDialog
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};
