
import { DocumentItem, DocumentType } from "@/types/document";
import { TableRow, TableCell } from "@/components/ui/table";
import { File, FileText, FileImage, FileSpreadsheet } from "lucide-react";

interface DocumentsTableProps {
  documents: DocumentItem[];
}

export const DocumentsTable = ({ documents }: DocumentsTableProps) => {
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
              className="grid grid-cols-4 gap-4 px-4 py-3 border-b hover:bg-accent/10 cursor-pointer"
            >
              <div className="font-medium flex items-center gap-2">
                {getDocumentIcon(document.type)}
                {document.name}
              </div>
              <div>{document.created}</div>
              <div className="capitalize">{document.type}</div>
              <div>{document.size}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
