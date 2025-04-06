
import React, { useState } from "react";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { useProfessionals } from "@/hooks/useProfessionals";
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  ShieldCheck, 
  User, 
  FileIcon,
  File,
  FileSpreadsheet,
  FileImage,
  FilePdf
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentItem, DocumentPermission } from "@/types/document";
import { Professional } from "@/types/professional";
import { toast } from "sonner";

export function SharedDocumentsList() {
  const { professionals } = useProfessionals();
  const { sharedDocuments, deleteSharedDocument, updateDocumentPermissions } = useDocumentManagement();
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Get sample shared documents if sharedDocuments is empty
  const documents = sharedDocuments.length > 0 ? sharedDocuments : getSampleDocuments();

  const handleDownload = (document: DocumentItem) => {
    // In a real app, this would initiate a download
    toast.success(`Downloading ${document.name}`);
  };

  const handleDelete = (document: DocumentItem) => {
    deleteSharedDocument(document.id);
    toast.success(`Document ${document.name} has been removed from sharing`);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case "image":
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "view":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">View Only</Badge>;
      case "download":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Download</Badge>;
      case "edit":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Edit</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
        <FileText size={48} className="text-muted-foreground mb-4" />
        <p className="text-center mb-2">No documents shared yet</p>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
          Share documents with your service professionals to collaborate securely.
          You can control who can view, download, or edit your documents.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Shared With</TableHead>
            <TableHead>Date Shared</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => {
            const sharedWith = professionals.find(p => 
              doc.sharedWith?.includes(p.id)
            );
            
            return (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {sharedWith ? (
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{sharedWith.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Multiple</span>
                  )}
                </TableCell>
                <TableCell>
                  {doc.created || new Date().toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getPermissionBadge(doc.permissions?.[0]?.accessLevel || "view")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage Permissions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove Sharing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Sample documents for demonstration
function getSampleDocuments(): DocumentItem[] {
  return [
    {
      id: "doc-1",
      name: "Tax Return 2024.pdf",
      type: "pdf",
      created: "04/02/2025",
      category: "professional-documents",
      size: "2.4 MB",
      sharedWith: ["pro-1"],
      permissions: [
        {
          userId: "pro-1",
          userName: "Sarah Johnson",
          userRole: "Tax Professional / Accountant",
          accessLevel: "view"
        }
      ]
    },
    {
      id: "doc-2",
      name: "Estate Plan Draft.docx",
      type: "document",
      created: "03/28/2025",
      category: "professional-documents",
      size: "1.2 MB",
      sharedWith: ["pro-3"],
      permissions: [
        {
          userId: "pro-3",
          userName: "Jennifer Williams",
          userRole: "Estate Planning Attorney",
          accessLevel: "download"
        }
      ]
    },
    {
      id: "doc-3",
      name: "Investment Portfolio Analysis.xlsx",
      type: "spreadsheet",
      created: "03/15/2025",
      category: "professional-documents",
      size: "3.7 MB",
      sharedWith: ["pro-2"],
      permissions: [
        {
          userId: "pro-2",
          userName: "Michael Chen",
          userRole: "Financial Advisor",
          accessLevel: "edit"
        }
      ]
    }
  ];
}
