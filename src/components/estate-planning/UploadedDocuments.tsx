
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Share } from "lucide-react";
import { format } from "date-fns";

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "notStarted" | "inProgress" | "completed";
  url?: string;
  date?: Date;
  uploadedBy?: string;
  sharedWith?: string[];
}

interface UploadedDocumentsProps {
  documents: DocumentItem[];
  onViewDocument: (documentId: string) => void;
  onShareDocument: (documentId: string) => void;
}

export const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({
  documents,
  onViewDocument,
  onShareDocument,
}) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Documents Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't uploaded any documents yet. Go to the Document Overview tab to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="font-medium text-lg">My Uploaded Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {document.description}
                  </p>
                  {document.date && (
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        Uploaded on {format(new Date(document.date), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onViewDocument(document.id)}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onShareDocument(document.id)}
              >
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
