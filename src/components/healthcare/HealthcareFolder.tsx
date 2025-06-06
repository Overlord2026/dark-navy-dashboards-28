
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Plus, FolderPlus } from "lucide-react";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { SupabaseDocumentUploadDialog } from "@/components/documents/SupabaseDocumentUploadDialog";
import { ShareDocumentWithProfessionalsDialog } from "@/components/professionals/ShareDocumentWithProfessionalsDialog";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";

interface HealthcareFolderProps {
  documents: DocumentItem[];
  onAddDocument: (document: DocumentItem) => void;
  onCreateFolder: (folderName: string, category?: string) => void;
}

export const HealthcareFolder: React.FC<HealthcareFolderProps> = ({
  documents,
  onAddDocument,
  onCreateFolder,
}) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const healthcareDocuments = documents.filter(doc => 
    doc.category === 'healthcare' || doc.category === 'medical-records'
  );

  const handleUpload = async (file: File, name: string, category: string): Promise<any> => {
    const newDocument: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || file.name,
      type: file.type.includes("pdf") ? "pdf" : 
            file.type.includes("image") ? "image" : "document",
      category: "healthcare",
      size: file.size,
      uploadedBy: "You",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    onAddDocument(newDocument);
    toast.success("Healthcare document uploaded successfully");
    setIsUploadDialogOpen(false);
    return newDocument;
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      onCreateFolder(folderName, "healthcare");
    }
  };

  const handleDownloadDocument = (document: DocumentItem) => {
    // Simulate download
    console.log(`Downloading ${document.name}`);
    toast.success(`Downloading ${document.name}`);
  };

  const handleDeleteDocument = (document: DocumentItem) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      console.log(`Deleting ${document.name}`);
      toast.success(`${document.name} deleted successfully`);
    }
  };

  const handleShareWithProfessional = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  // Convert DocumentItem to the format expected by ShareDocumentWithProfessionalsDialog
  const convertToSupabaseDocument = (doc: DocumentItem | null) => {
    if (!doc) return null;
    
    return {
      id: doc.id,
      user_id: "current-user", // This would normally come from auth
      name: doc.name,
      type: doc.type,
      category: doc.category,
      file_path: null,
      content_type: null,
      description: null,
      tags: doc.tags || null,
      size: typeof doc.size === 'number' ? doc.size : null,
      is_folder: doc.type === 'folder',
      is_private: doc.isPrivate || true,
      encrypted: doc.encrypted || true,
      shared: doc.shared || false,
      uploaded_by: doc.uploadedBy || null,
      parent_folder_id: null,
      created_at: doc.created,
      updated_at: doc.modified || doc.created,
      modified: doc.modified || null,
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Healthcare Documents</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Store and manage your medical records, prescriptions, and healthcare documents
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCreateFolder}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {healthcareDocuments.length > 0 ? (
            <DocumentsTable 
              documents={healthcareDocuments}
              onDownloadDocument={handleDownloadDocument}
              onDeleteDocument={handleDeleteDocument}
              onShareWithProfessional={handleShareWithProfessional}
              useDropdownActions={true}
              extraColumns={[
                {
                  header: "Type",
                  cell: (document) => (
                    <span className="capitalize text-sm text-muted-foreground">
                      {document.type}
                    </span>
                  )
                }
              ]}
            />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No healthcare documents</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first healthcare document to get started
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SupabaseDocumentUploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={handleUpload}
        category="healthcare"
        activeCategory="healthcare"
        categories={[{ id: "healthcare", name: "Healthcare" }]}
        uploading={false}
      />

      <ShareDocumentWithProfessionalsDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={convertToSupabaseDocument(selectedDocument)}
      />
    </div>
  );
};
