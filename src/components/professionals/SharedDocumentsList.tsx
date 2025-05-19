import React from "react";
import { DocumentItem, DocumentPermission } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from "lucide-react";

interface SharedDocumentsListProps {
  documents: DocumentItem[];
  onDelete: (document: DocumentItem) => void;
}

const SharedDocumentsList: React.FC<SharedDocumentsListProps> = ({ documents, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Name</TableHead>
          <TableHead>Shared With</TableHead>
          <TableHead>Access Level</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id}>
            <TableCell className="font-medium">{document.name}</TableCell>
            <TableCell>
              {document.permissions?.map((permission: DocumentPermission) => (
                <div key={permission.userId}>
                  {permission.userName} ({permission.userEmail})
                </div>
              ))}
            </TableCell>
            <TableCell>
              {document.permissions?.map((permission: DocumentPermission) => (
                <div key={permission.userId}>
                  {permission.accessLevel}
                </div>
              ))}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onDelete(document)}>
                <TrashIcon className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SharedDocumentsList;
