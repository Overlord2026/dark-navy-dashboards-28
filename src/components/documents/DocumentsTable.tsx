
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentItem } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Trash2, Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DocumentsTableProps {
  documents: DocumentItem[];
  onEditDocument?: (document: DocumentItem) => void;
  onShareDocument?: (document: DocumentItem) => void;
  onDeleteDocument?: (document: DocumentItem) => void;
  onDownloadDocument?: (document: DocumentItem) => void;
  onShareWithProfessional?: (document: DocumentItem) => void;
  useDropdownActions?: boolean;
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
  onDownloadDocument,
  onShareWithProfessional,
  useDropdownActions = false,
  extraColumns = []
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "image": return "🖼️";
      case "spreadsheet": return "📊";
      case "folder": return "📁";
      default: return "📄";
    }
  };

  const renderDropdownActions = (document: DocumentItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border">
        {onDownloadDocument && (
          <DropdownMenuItem onClick={() => onDownloadDocument(document)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        {onDeleteDocument && (
          <DropdownMenuItem onClick={() => onDeleteDocument(document)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
        {onShareWithProfessional && (
          <DropdownMenuItem onClick={() => onShareWithProfessional(document)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share with Professional
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderRegularActions = (document: DocumentItem) => (
    <div className="flex justify-end space-x-2">
      {onDownloadDocument && (
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
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
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
              <div className="flex items-center">
                <span className="mr-2" aria-hidden="true">
                  {getDocumentIcon(document.type)}
                </span>
                {document.name}
              </div>
            </TableCell>
            <TableCell>{document.created ? new Date(document.created).toLocaleDateString() : '-'}</TableCell>
            <TableCell>{typeof document.size === 'number' ? `${(document.size / (1024 * 1024)).toFixed(2)} MB` : document.size || '-'}</TableCell>
            
            {extraColumns?.map((col, index) => (
              <TableCell key={`document-${document.id}-col-${index}`}>
                {col.cell(document)}
              </TableCell>
            ))}
            
            <TableCell className="text-right">
              {useDropdownActions ? renderDropdownActions(document) : renderRegularActions(document)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
