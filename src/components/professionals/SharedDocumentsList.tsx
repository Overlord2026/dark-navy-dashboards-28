
import React from "react";
import { useSupabaseSharedDocuments } from "@/hooks/useSupabaseSharedDocuments";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { User, Loader2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DocumentIcon } from "./DocumentIcon";
import { PermissionBadge } from "./PermissionBadge";
import { EmptySharedDocuments } from "./EmptySharedDocuments";

export function SharedDocumentsList() {
  const { professionals } = useProfessionals();
  const { sharedDocuments, loading, removeSharedDocument } = useSupabaseSharedDocuments();

  const handleRemoveAccess = async (sharedDocumentId: string, documentName: string) => {
    if (confirm(`Remove access to "${documentName}"?`)) {
      await removeSharedDocument(sharedDocumentId);
      toast.success("Document access removed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shared documents...</span>
      </div>
    );
  }

  if (sharedDocuments.length === 0) {
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
          {sharedDocuments.map((sharedDoc) => {
            const professional = professionals.find(p => p.id === sharedDoc.professional_id);
            
            return (
              <TableRow key={sharedDoc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DocumentIcon type={sharedDoc.document_type || 'document'} />
                    <span className="font-medium">{sharedDoc.document_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {professional ? (
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{professional.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unknown Professional</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(sharedDoc.shared_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <PermissionBadge accessLevel={sharedDoc.permission_level} />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveAccess(sharedDoc.id, sharedDoc.document_name || 'Document')}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove Access
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
