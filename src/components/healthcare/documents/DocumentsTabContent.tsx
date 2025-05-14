
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { DocumentItem } from "@/types/document";
import { Filter, Upload, FolderPlus } from "lucide-react";

interface DocumentsTabContentProps {
  documents: DocumentItem[];
  onEditPermissions: (document: DocumentItem) => void;
  onShareDocument: (document: DocumentItem) => void;
  onViewDocument: (document: DocumentItem) => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
}

export const DocumentsTabContent: React.FC<DocumentsTabContentProps> = ({
  documents,
  onEditPermissions,
  onShareDocument,
  onViewDocument,
  onUploadClick,
  onCreateFolderClick
}) => {
  const healthcareDocuments = documents.filter(doc => 
    doc.category === "healthcare" || doc.category === "medical"
  );
  
  const recentUploads = healthcareDocuments
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 5);
  
  const sharedDocuments = healthcareDocuments.filter(doc => doc.shared);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUploads.length > 0 ? (
              <DocumentsTable 
                documents={recentUploads}
                showCategory={false}
                onEditPermissions={onEditPermissions}
                onShare={onShareDocument}
                onView={onViewDocument}
              />
            ) : (
              <NoDocumentsState 
                onUploadClick={onUploadClick}
                title="No recent uploads"
                description="Upload your first medical document to get started"
              />
            )}
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              Shared With Healthcare Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sharedDocuments.length > 0 ? (
              <DocumentsTable 
                documents={sharedDocuments}
                showCategory={false}
                onEditPermissions={onEditPermissions}
                onShare={onShareDocument}
                onView={onViewDocument}
              />
            ) : (
              <NoDocumentsState 
                onUploadClick={onUploadClick}
                title="No shared documents"
                description="Share documents with your healthcare providers"
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">All Healthcare Documents</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCreateFolderClick}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button size="sm" onClick={onUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {healthcareDocuments.length > 0 ? (
            <DocumentsTable 
              documents={healthcareDocuments}
              showCategory={true}
              onEditPermissions={onEditPermissions}
              onShare={onShareDocument}
              onView={onViewDocument}
            />
          ) : (
            <NoDocumentsState 
              onUploadClick={onUploadClick}
              title="No documents found"
              description="Upload your first healthcare document"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
