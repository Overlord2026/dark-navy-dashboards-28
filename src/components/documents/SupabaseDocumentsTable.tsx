
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Trash2, FolderOpen, Share } from "lucide-react";
import { SupabaseDocument } from "@/hooks/useSupabaseDocuments";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { useSupabaseSharedDocuments } from "@/hooks/useSupabaseSharedDocuments";
import { toast } from "sonner";
import { StaggeredTable, StaggeredTableRow } from "@/components/animations/StaggeredTable";

export interface SupabaseDocumentsTableProps {
  documents: SupabaseDocument[];
  onDownloadDocument?: (document: SupabaseDocument) => void;
  onDeleteDocument?: (document: SupabaseDocument) => void;
  onViewDocument?: (document: SupabaseDocument) => void;
  loading?: boolean;
}

export const SupabaseDocumentsTable: React.FC<SupabaseDocumentsTableProps> = ({ 
  documents, 
  onDownloadDocument, 
  onDeleteDocument,
  onViewDocument,
  loading = false
}) => {
  const { professionals } = useProfessionals();
  const { shareDocument, sharing } = useSupabaseSharedDocuments();

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "image": return "🖼️";
      case "spreadsheet": return "📊";
      case "folder": return "📁";
      default: return "📄";
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '-';
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleShareDocument = async (document: SupabaseDocument) => {
    console.log('Sharing document:', document.name);
    console.log('Available professionals:', professionals);
    
    if (professionals.length === 0) {
      console.log('No professionals available - cannot share document');
      toast.error('No professionals available. Please add a professional first before sharing documents.');
      return;
    }

    // Use the first available professional and default to 'view' permission
    const firstProfessional = professionals[0];
    console.log('Sharing with first professional:', firstProfessional);
    
    const result = await shareDocument(
      firstProfessional.id,
      document.id,
      'view'
    );

    if (result) {
      toast.success(`Document "${document.name}" shared with ${firstProfessional.name}`);
    } else {
      toast.error('Failed to share document');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading documents...</div>
      </div>
    );
  }

  return (
    <StaggeredTable 
      headers={
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      }
    >
      {documents.map(document => (
        <StaggeredTableRow key={document.id}>
          <TableCell className="font-medium">
            <div className="flex items-center">
              <span className="mr-2" aria-hidden="true">
                {getDocumentIcon(document.type)}
              </span>
              {document.name}
            </div>
          </TableCell>
          <TableCell className="capitalize">{document.type}</TableCell>
          <TableCell>{formatFileSize(document.size)}</TableCell>
          <TableCell>
            {document.modified 
              ? new Date(document.modified).toLocaleDateString() 
              : new Date(document.created_at).toLocaleDateString()
            }
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {document.is_folder && onViewDocument && (
                  <DropdownMenuItem onClick={() => onViewDocument(document)}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open Folder
                  </DropdownMenuItem>
                )}
                
                {!document.is_folder && (
                  <>
                    {onDownloadDocument && (
                      <DropdownMenuItem onClick={() => onDownloadDocument(document)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem 
                      onClick={() => handleShareDocument(document)}
                      disabled={sharing || professionals.length === 0}
                    >
                      <Share className="mr-2 h-4 w-4" />
                      {sharing ? 'Sharing...' : professionals.length === 0 ? 'No Professionals Available' : 'Share with Professional'}
                    </DropdownMenuItem>
                  </>
                )}
                
                {onDeleteDocument && (
                  <DropdownMenuItem 
                    onClick={() => onDeleteDocument(document)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </StaggeredTableRow>
      ))}
    </StaggeredTable>
  );
};
