
import { DocumentItem, DocumentType } from "@/types/document";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  {getDocumentIcon(document.type)}
                  {document.name}
                </TableCell>
                <TableCell>{document.created}</TableCell>
                <TableCell className="capitalize">{document.type}</TableCell>
                <TableCell className="text-right">{document.size}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No files
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
