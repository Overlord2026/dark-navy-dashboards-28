
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentItem } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Share2, Trash2, Download, ExternalLink } from "lucide-react";

export interface DocumentsTableProps {
  documents: DocumentItem[];
  onEditDocument?: (document: DocumentItem) => void;
  onShareDocument?: (document: DocumentItem) => void;
  onDeleteDocument?: (document: DocumentItem) => void;
  onViewDocument?: (document: DocumentItem) => void;
  onDownloadDocument?: (document: DocumentItem) => void;
  showCategory?: boolean;
  onEditPermissions?: (document: DocumentItem) => void;
  onShare?: (document: DocumentItem) => void;
  onView?: (document: DocumentItem) => void;
  extraColumns?: {
    header: string;
    cell: (document: DocumentItem) => React.ReactNode;
  }[];
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({ 
  documents, 
  onEditDocument, 
  onShareDocument, 
  onDeleteDocument,
  onViewDocument,
  onDownloadDocument,
  showCategory = false,
  onEditPermissions,
  onShare,
  onView,
  extraColumns = []
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "image": return "🖼️";
      case "spreadsheet": return "📊";
      case "folder": return "📁";
      case "external-link": return "🔗";
      default: return "📄";
    }
  };
  
  // Handle compatibility between old and new prop names
  const handleViewDocument = (document: DocumentItem) => {
    if (document.type === "external-link" && document.url) {
      window.open(document.url, "_blank", "noopener,noreferrer");
    } else if (onViewDocument) {
      onViewDocument(document);
    } else if (onView) {
      onView(document);
    }
  };
  
  const handleShareDocument = (document: DocumentItem) => {
    if (onShareDocument) onShareDocument(document);
    else if (onShare) onShare(document);
  };
  
  const handleEditPermissions = (document: DocumentItem) => {
    if (onEditPermissions) onEditPermissions(document);
  };
  
  const renderDocumentName = (document: DocumentItem) => {
    return (
      <div className="flex items-center">
        <span className="mr-2" aria-hidden="true">
          {getDocumentIcon(document.type)}
        </span>
        <div className="flex items-center">
          {document.name}
          {document.type === "external-link" && (
            <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          {showCategory && <TableHead>Category</TableHead>}
          {extraColumns?.map((col, index) => (
            <TableHead key={`extra-col-${index}`}>{col.header}</TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map(document => (
          <TableRow key={document.id}>
            <TableCell className="font-medium">
              {renderDocumentName(document)}
            </TableCell>
            <TableCell>{document.created ? new Date(document.created).toLocaleDateString() : '-'}</TableCell>
            <TableCell>
              {document.type === "external-link" ? "External Link" : 
                typeof document.size === 'number' ? 
                  `${(document.size / (1024 * 1024)).toFixed(2)} MB` : 
                  document.size || '-'}
            </TableCell>
            
            {showCategory && (
              <TableCell>{document.category || '-'}</TableCell>
            )}
            
            {extraColumns?.map((col, index) => (
              <TableCell key={`document-${document.id}-col-${index}`}>
                {col.cell(document)}
              </TableCell>
            ))}
            
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                {(document.type === "external-link" || onViewDocument || onView) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewDocument(document)}
                    aria-label="View Document"
                  >
                    {document.type === "external-link" ? 
                      <ExternalLink className="h-4 w-4" /> :
                      <Eye className="h-4 w-4" />}
                  </Button>
                )}
                
                {onDownloadDocument && document.type !== "external-link" && (
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
                
                {(onShareDocument || onShare) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleShareDocument(document)}
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                {onEditPermissions && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditPermissions(document)}
                    aria-label="Edit Permissions"
                  >
                    <Edit className="h-4 w-4" />
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
