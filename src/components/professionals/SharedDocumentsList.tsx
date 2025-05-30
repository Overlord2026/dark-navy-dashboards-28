
import React, { useState } from "react";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { User } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";
import { DocumentIcon } from "./DocumentIcon";
import { PermissionBadge } from "./PermissionBadge";
import { DocumentActions } from "./DocumentActions";
import { EmptySharedDocuments } from "./EmptySharedDocuments";

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

  if (documents.length === 0) {
    return <EmptySharedDocuments />;
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
                    <DocumentIcon type={doc.type} />
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
                  <PermissionBadge accessLevel={doc.permissions?.[0]?.accessLevel || "view"} />
                </TableCell>
                <TableCell className="text-right">
                  <DocumentActions 
                    document={doc}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

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
          userEmail: "sarah@example.com",
          userRole: "Tax Professional / Accountant",
          accessLevel: "view",
          grantedAt: new Date().toISOString()
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
          userEmail: "jennifer@example.com",
          userRole: "Estate Planning Attorney",
          accessLevel: "view",
          grantedAt: new Date().toISOString()
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
          userEmail: "michael@example.com",
          userRole: "Financial Advisor",
          accessLevel: "edit",
          grantedAt: new Date().toISOString()
        }
      ]
    }
  ];
}
