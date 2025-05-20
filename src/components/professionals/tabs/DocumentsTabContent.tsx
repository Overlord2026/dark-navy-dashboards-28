
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DocumentItem } from "@/types/document";
import SharedDocumentsList from "@/components/professionals/SharedDocumentsList";

// Example document items for demonstration
const exampleDocuments: DocumentItem[] = [
  {
    id: "1",
    name: "Medical History",
    type: "pdf",
    created: "2023-10-15",
    modified: "2023-10-20",
    permissions: [
      {
        userId: "user1",
        userName: "Dr. Smith",
        userRole: "Primary Care Physician",
        accessLevel: "view",
        grantedBy: "Patient",
        grantedAt: "2023-10-15"
      }
    ]
  },
  {
    id: "2",
    name: "Insurance Information",
    type: "document",
    created: "2023-09-05",
    modified: "2023-10-01",
    permissions: [
      {
        userId: "user1",
        userName: "Dr. Smith",
        userRole: "Primary Care Physician",
        accessLevel: "edit",
        grantedBy: "Patient",
        grantedAt: "2023-09-05"
      }
    ]
  }
];

export function DocumentsTabContent() {
  const handleOpenDocument = (doc: DocumentItem) => {
    console.log("Opening document:", doc);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Shared Documents</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Request Document
        </Button>
      </div>

      <SharedDocumentsList documents={exampleDocuments} onOpen={handleOpenDocument} />
    </div>
  );
}
