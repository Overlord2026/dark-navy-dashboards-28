
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Share2, FileText, User, Calendar, Download, MoreHorizontal, Trash2 } from "lucide-react";
import { SharedDocumentsList } from "@/components/professionals/SharedDocumentsList";
import { useSupabaseSharedDocuments } from "@/hooks/useSupabaseSharedDocuments";
import { useEstatePlanning } from "@/hooks/useEstatePlanning";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface DocumentsTabContentProps {
  onUpload: () => void;
  onShare: () => void;
}

export function DocumentsTabContent({ onUpload, onShare }: DocumentsTabContentProps) {
  const { sharedDocuments, loading } = useSupabaseSharedDocuments();
  const { documents: estateDocuments } = useEstatePlanning();

  // Get estate planning shared documents
  const estateSharedDocuments = estateDocuments.filter(doc => 
    doc.shared_with && doc.shared_with.length > 0
  ).map(doc => ({
    id: doc.document_type,
    name: doc.document_name,
    sharedWith: doc.shared_with || [],
    date: new Date(doc.created_at),
    status: "active" as const,
    source: "estate-planning"
  }));

  // Combine all shared documents
  const allSharedDocuments = [
    ...sharedDocuments.map(doc => ({
      id: doc.id,
      name: doc.document_name || 'Document',
      sharedWith: [doc.professional_name || 'Professional'],
      date: new Date(doc.shared_at),
      status: "active" as const,
      source: "professionals"
    })),
    ...estateSharedDocuments
  ];

  const handleDownloadDocument = (documentId: string, source: string) => {
    if (source === "estate-planning") {
      const document = estateDocuments.find(doc => doc.document_type === documentId);
      if (document) {
        console.log(`Downloading estate document: ${document.document_name}`);
        const blob = new Blob(['This is a simulated estate document content'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.document_name;
        link.click();
        URL.revokeObjectURL(url);
      }
    } else {
      // Handle professional shared documents download
      const document = sharedDocuments.find(doc => doc.id === documentId);
      if (document) {
        console.log(`Downloading professional document: ${document.document_name}`);
        const blob = new Blob(['This is a simulated professional document content'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.document_name || 'document';
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Document Management</h2>
          <p className="text-muted-foreground">Upload and share documents with your professional team</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onUpload} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
          <Button variant="outline" onClick={onShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Document
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Shared Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Shared Documents
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Documents you've shared with professionals
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading shared documents...</span>
              </div>
            ) : allSharedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <Share2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Shared Documents</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't shared any documents with professionals yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allSharedDocuments.map((document) => (
                  <div
                    key={`${document.source}-${document.id}`}
                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{document.name}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-4">
                            {document.sharedWith.length > 0 && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>
                                  Shared with {document.sharedWith.join(', ')}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {format(document.date, "MMM d, yyyy")}
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              {document.status === "active" ? "Active" : "Expired"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border">
                          <DropdownMenuItem onClick={() => handleDownloadDocument(document.id, document.source)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              // Handle remove sharing functionality
                              console.log('Remove sharing for:', document.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Sharing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Shared Documents (Original Component) */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Documents</CardTitle>
            <p className="text-sm text-muted-foreground">
              Documents shared via professional relationships
            </p>
          </CardHeader>
          <CardContent>
            <SharedDocumentsList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
