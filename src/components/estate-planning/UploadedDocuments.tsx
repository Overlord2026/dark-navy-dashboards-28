
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FilePlus, Eye, Share2, UploadCloud } from "lucide-react";
import { DocumentItem } from "@/types/document";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  documents: DocumentItem[];
  subItems?: SubChecklistItem[];
  expanded?: boolean;
}

interface SubChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

interface UploadedDocumentsProps {
  checklist: ChecklistItem[];
  onUpload: (category: ChecklistItem) => void;
  onView: (category: ChecklistItem, document: DocumentItem) => void;
  onShare: (category: ChecklistItem, document: DocumentItem) => void;
}

export const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({
  checklist,
  onUpload,
  onView,
  onShare,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm">
          View and manage all your uploaded documents across categories.
        </p>
      </div>
      
      {checklist.map((category) => (
        category.documents.length > 0 && (
          <div key={category.id} className="border rounded-lg overflow-hidden mb-4">
            <div className="bg-muted/40 p-3 font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {category.title}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => onUpload(category)}
              >
                <FilePlus className="h-3 w-3" />
                Add Document
              </Button>
            </div>
            <div className="divide-y">
              {category.documents.map((doc) => (
                <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-muted/10">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded: {doc.dateUploaded} • {doc.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onView(category, doc)}
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onShare(category, doc)}
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      
      {!checklist.some(category => category.documents.length > 0) && (
        <div className="text-center p-12 border rounded-lg">
          <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
          <p className="text-muted-foreground mb-6">
            Start uploading documents from the Document Checklist tab.
          </p>
        </div>
      )}
    </div>
  );
};
