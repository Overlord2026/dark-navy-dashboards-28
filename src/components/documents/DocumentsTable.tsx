
import { DocumentItem, DocumentType } from "@/types/document";
import { File, FileText, FileImage, FileSpreadsheet, Edit, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsTableProps {
  documents: DocumentItem[];
  onEditDocument?: (document: DocumentItem) => void;
  onDeleteDocument?: (document: DocumentItem) => void;
  onShareDocument?: (document: DocumentItem) => void;
}

export const DocumentsTable = ({ 
  documents,
  onEditDocument,
  onDeleteDocument,
  onShareDocument
}: DocumentsTableProps) => {
  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "pdf":
        return <File className="h-5 w-5 text-red-400" />;
      case "image":
        return <FileImage className="h-5 w-5 text-blue-400" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      {documents.length > 0 ? (
        <div>
          {documents.map((document) => (
            <div 
              key={document.id}
              className="grid grid-cols-5 gap-4 px-4 py-3 border-b hover:bg-accent/10"
            >
              <div className="font-medium flex items-center gap-2 col-span-2">
                {getDocumentIcon(document.type)}
                {document.name}
              </div>
              <div>{document.created}</div>
              <div className="capitalize">{document.type}</div>
              <div className="flex items-center justify-end gap-2">
                {onEditDocument && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => onEditDocument(document)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
                {onShareDocument && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => onShareDocument(document)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                )}
                {onDeleteDocument && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" 
                    onClick={() => onDeleteDocument(document)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
