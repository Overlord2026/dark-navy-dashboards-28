import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, FileSymlink, RotateCcw, Eye } from "lucide-react";
import { DocumentItem } from "@/types/document";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Sample version history data structure
export interface DocumentVersion {
  id: string;
  documentId: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "create" | "update" | "rename" | "share" | "delete" | "restore";
  details?: {
    previousName?: string;
    newName?: string;
    sharedWith?: string;
    restoredFrom?: string;
    changes?: string[];
  };
}

interface DocumentVersionControlProps {
  documents: DocumentItem[];
  onViewDocument: (document: DocumentItem) => void;
}

export const DocumentVersionControl: React.FC<DocumentVersionControlProps> = ({
  documents,
  onViewDocument
}) => {
  // Get unique documents that have been modified
  const getDocumentsWithHistory = () => {
    // In a real implementation, this would query a version history database
    // For demo purposes, we're using a hardcoded set of version histories
    return documents.filter(doc => 
      doc.modified && doc.modified !== doc.created
    ).slice(0, 5);
  };
  
  const getVersionHistory = (documentId: string): DocumentVersion[] => {
    // This would be fetched from a database in a real implementation
    // For demo purposes, we're generating fake version history
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return [];
    
    const history: DocumentVersion[] = [
      {
        id: `v-${Math.random().toString(36).substring(2, 9)}`,
        documentId: document.id,
        timestamp: document.created,
        userId: document.uploadedBy || "Tom Brady",
        userName: document.uploadedBy || "Tom Brady",
        action: "create"
      }
    ];
    
    if (document.modified && document.modified !== document.created) {
      history.push({
        id: `v-${Math.random().toString(36).substring(2, 9)}`,
        documentId: document.id,
        timestamp: document.modified,
        userId: document.lastAccessedBy || document.uploadedBy || "Tom Brady",
        userName: document.lastAccessedBy || document.uploadedBy || "Tom Brady",
        action: "update",
        details: {
          changes: ["Content updated"]
        }
      });
    }
    
    if (document.permissions && document.permissions.length > 1) {
      history.push({
        id: `v-${Math.random().toString(36).substring(2, 9)}`,
        documentId: document.id,
        timestamp: document.permissions[1].grantedAt || new Date().toISOString(),
        userId: document.permissions[0].userId,
        userName: document.permissions[0].userName || "Tom Brady",
        action: "share",
        details: {
          sharedWith: document.permissions[1].userName
        }
      });
    }
    
    return history.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };
  
  const documentsWithHistory = getDocumentsWithHistory();
  
  const handleRestoreVersion = (version: DocumentVersion) => {
    // In a real app, this would restore the document to a previous version
    toast({
      title: "Version restored",
      description: `Document has been restored to version from ${format(parseISO(version.timestamp), "PP")}`,
    });
  };
  
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "create": return "default";
      case "update": return "outline";
      case "rename": return "secondary";
      case "share": return "blue";
      case "delete": return "destructive";
      case "restore": return "green";
      default: return "outline";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Document Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documentsWithHistory.length > 0 ? (
          <div className="space-y-6">
            {documentsWithHistory.map(document => {
              const versionHistory = getVersionHistory(document.id);
              
              return (
                <div key={document.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileSymlink className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">{document.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewDocument(document)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead className="text-right">Options</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {versionHistory.map(version => (
                        <TableRow key={version.id}>
                          <TableCell className="font-medium">
                            {format(parseISO(version.timestamp), "MMM d, yyyy h:mm a")}
                          </TableCell>
                          <TableCell>{version.userName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={getActionBadgeColor(version.action) as any}>
                                {version.action}
                              </Badge>
                              {version.details?.sharedWith && (
                                <span className="text-xs text-muted-foreground">
                                  with {version.details.sharedWith}
                                </span>
                              )}
                              {version.details?.changes && (
                                <span className="text-xs text-muted-foreground">
                                  {version.details.changes.join(", ")}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {version.action === "update" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRestoreVersion(version)}
                                className="h-8 px-2"
                              >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Restore
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No document version history available</p>
            <p className="text-sm">Version history will appear when documents are modified</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
