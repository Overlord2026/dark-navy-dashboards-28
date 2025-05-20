
import React from "react";
import { DocumentItem } from "@/types/document";
import { PermissionBadge } from "./PermissionBadge";

interface SharedDocumentsListProps {
  documents: DocumentItem[];
  onOpen?: (document: DocumentItem) => void;
}

export default function SharedDocumentsList({ documents, onOpen }: SharedDocumentsListProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No shared documents found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onOpen && onOpen(doc)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {doc.permissions && doc.permissions.length > 0 && (
              <PermissionBadge permission={doc.permissions[0].accessLevel} />
            )}
            <span className="text-sm text-gray-500">
              {doc.modified ? new Date(doc.modified).toLocaleDateString() : "No date"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
