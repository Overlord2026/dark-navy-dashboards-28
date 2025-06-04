
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Share, User, Download } from "lucide-react";
import { format } from "date-fns";

interface SharedDocument {
  id: string;
  name: string;
  sharedBy?: string;
  sharedWith: string[];
  date?: Date;
  status: "active" | "expired";
}

export interface SharedDocumentsProps {
  sharedDocuments: SharedDocument[];
  onViewDocument: (documentId: string) => void;
}

export const SharedDocuments: React.FC<SharedDocumentsProps> = ({
  sharedDocuments,
  onViewDocument,
}) => {
  const handleDownloadDocument = (documentId: string) => {
    // Simulate download for shared documents
    const document = sharedDocuments.find(doc => doc.id === documentId);
    if (document) {
      console.log(`Downloading shared document: ${document.name}`);
      const blob = new Blob(['This is a simulated shared document content'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (sharedDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <Share className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Shared Documents</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't shared any documents with others yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="font-medium text-lg">Shared Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sharedDocuments.map((document) => (
          <div
            key={document.id}
            className="border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    {document.sharedWith.length > 0 && (
                      <div className="flex items-center mr-3">
                        <User className="h-3 w-3 mr-1" />
                        <span>
                          Shared with {document.sharedWith.length} {document.sharedWith.length === 1 ? "person" : "people"}
                        </span>
                      </div>
                    )}
                    {document.date && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {format(new Date(document.date), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  document.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {document.status === "active" ? "Active" : "Expired"}
              </span>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDownloadDocument(document.id)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
