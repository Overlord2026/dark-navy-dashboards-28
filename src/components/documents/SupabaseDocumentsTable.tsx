
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Trash2, Download, FolderIcon, FileIcon } from "lucide-react";
import { SupabaseDocument } from "@/hooks/useSupabaseDocuments";

export interface SupabaseDocumentsTableProps {
  documents: SupabaseDocument[];
  onEditDocument?: (document: SupabaseDocument) => void;
  onShareDocument?: (document: SupabaseDocument) => void;
  onDeleteDocument?: (document: SupabaseDocument) => void;
  onDownloadDocument?: (document: SupabaseDocument) => void;
  loading?: boolean;
}

export const SupabaseDocumentsTable: React.FC<SupabaseDocumentsTableProps> = ({ 
  documents, 
  onEditDocument, 
  onShareDocument, 
  onDeleteDocument,
  onDownloadDocument,
  loading = false
}) => {
  const getDocumentIcon = (type: string, isFolder: boolean) => {
    if (isFolder) return <FolderIcon className="h-4 w-4 text-blue-500" />;
    
    switch (type) {
      case "pdf": return <FileIcon className="h-4 w-4 text-red-500" />;
      case "image": return <FileIcon className="h-4 w-4 text-green-500" />;
      case "spreadsheet": return <FileIcon className="h-4 w-4 text-green-600" />;
      default: return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes || bytes === 0) return "—";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading documents...</div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No documents found</p>
        </div>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map(document => (
          <TableRow key={document.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {getDocumentIcon(document.type, document.is_folder)}
                <span>{document.name}</span>
                {document.shared && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Shared</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="capitalize">{document.is_folder ? 'Folder' : document.type}</span>
            </TableCell>
            <TableCell>{formatDate(document.created_at)}</TableCell>
            <TableCell>{formatFileSize(document.size)}</TableCell>
            
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                {onDownloadDocument && !document.is_folder && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDownloadDocument(document)}
                    aria-label="Download Document"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                {onEditDocument && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditDocument(document)}
                    aria-label="Edit Document"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                {onShareDocument && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onShareDocument(document)}
                    aria-label="Share Document"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                
                {onDeleteDocument && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteDocument(document)}
                    aria-label="Delete Document"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
