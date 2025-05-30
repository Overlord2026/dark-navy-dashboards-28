
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderIcon, FileIcon, MoreHorizontal } from "lucide-react";
import { SupabaseDocument } from "@/hooks/useSupabaseDocuments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SupabaseDocumentsTableProps {
  documents: SupabaseDocument[];
  onEditDocument?: (document: SupabaseDocument) => void;
  onShareDocument?: (document: SupabaseDocument) => void;
  onDeleteDocument?: (document: SupabaseDocument) => void;
  onDownloadDocument?: (document: SupabaseDocument) => void;
  onViewDocument?: (document: SupabaseDocument) => void;
  loading?: boolean;
}

export const SupabaseDocumentsTable: React.FC<SupabaseDocumentsTableProps> = ({ 
  documents, 
  onEditDocument, 
  onShareDocument, 
  onDeleteDocument,
  onDownloadDocument,
  onViewDocument,
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

  const handleRowClick = (document: SupabaseDocument, event: React.MouseEvent) => {
    // Prevent row click when clicking on the actions dropdown
    if ((event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    
    if (document.is_folder && onViewDocument) {
      onViewDocument(document);
    }
  };

  // Sort documents to show folders first, then files
  const sortedDocuments = [...documents].sort((a, b) => {
    // Folders come first
    if (a.is_folder && !b.is_folder) return -1;
    if (!a.is_folder && b.is_folder) return 1;
    // Within the same type (folder or file), sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
  
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
        {sortedDocuments.map(document => (
          <TableRow 
            key={document.id}
            className={document.is_folder ? "cursor-pointer hover:bg-accent/50" : ""}
            onClick={(e) => handleRowClick(document, e)}
          >
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    aria-label="More actions"
                    data-dropdown-trigger
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {document.is_folder ? (
                    <>
                      {onViewDocument && (
                        <DropdownMenuItem onClick={() => onViewDocument(document)}>
                          View
                        </DropdownMenuItem>
                      )}
                      {onDeleteDocument && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteDocument(document)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : (
                    <>
                      {onDeleteDocument && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteDocument(document)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                      {onDownloadDocument && (
                        <DropdownMenuItem onClick={() => onDownloadDocument(document)}>
                          Download
                        </DropdownMenuItem>
                      )}
                      {onShareDocument && (
                        <DropdownMenuItem onClick={() => onShareDocument(document)}>
                          Share with Professional
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
