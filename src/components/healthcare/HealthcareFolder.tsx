import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { Button } from "@/components/ui/button";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";
import { healthcareCategories } from "@/data/documentCategories";
import { healthcareTags, DocumentItem, DocumentTag, HealthcareAccessLevel, DocumentPermission } from "@/types/document";
import { Upload, FolderPlus, Tag, Lock, Shield, Users, Eye, FileEdit, History } from "lucide-react";
import { CategoryList } from "@/components/documents/CategoryList";
import { toast } from "sonner";
import { HealthcareDocumentPermissions } from "./HealthcareDocumentPermissions";
import { auditLog } from "@/services/auditLog/auditLogService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HealthcareFolderProps {
  documents: DocumentItem[];
  onAddDocument: (document: DocumentItem) => void;
  onCreateFolder: (folderName: string, category: string) => void;
}

export const HealthcareFolder: React.FC<HealthcareFolderProps> = ({
  documents,
  onAddDocument,
  onCreateFolder
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>("healthcare");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showOnlyEncrypted, setShowOnlyEncrypted] = useState(false);
  const [showAccessLog, setShowAccessLog] = useState(false);
  
  const userId = "Tom Brady"; // In a real app, this would come from auth context

  const healthcareDocuments = documents.filter(doc => 
    doc.category === activeSubcategory || 
    (activeSubcategory === "healthcare" && healthcareCategories.some(c => c.id === doc.category))
  );
  
  const filteredDocuments = healthcareDocuments
    .filter(doc => selectedTags.length > 0 ? doc.tags?.some(tag => selectedTags.includes(tag)) : true)
    .filter(doc => showOnlyEncrypted ? doc.encrypted === true : true);

  const handleUploadDocument = (file: File, customName: string) => {
    let docType: "pdf" | "image" | "document" = "document";
    if (file.type.includes("pdf")) {
      docType = "pdf";
    } else if (file.type.includes("image")) {
      docType = "image";
    }

    const newDocument: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName || file.name,
      type: docType,
      category: activeSubcategory,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      size: file.size,
      uploadedBy: userId,
      tags: selectedTags,
      encrypted: true,
      isPrivate: true,
      permissions: [
        {
          userId: userId,
          userName: userId,
          accessLevel: "full",
          grantedAt: new Date().toISOString()
        }
      ]
    };
    
    onAddDocument(newDocument);
    setIsUploadDialogOpen(false);
    
    auditLog.log(
      userId,
      "document_modification",
      "success",
      {
        userName: userId,
        resourceId: newDocument.id,
        resourceType: "healthcare_document",
        details: {
          action: "upload",
          documentName: newDocument.name,
          documentType: newDocument.type,
          category: newDocument.category
        }
      }
    );
    
    toast.success("Healthcare document uploaded successfully", {
      description: "Document is encrypted and set to private by default"
    });
  };

  const handleCreateFolder = (folderName: string) => {
    onCreateFolder(folderName, activeSubcategory);
    setIsNewFolderDialogOpen(false);
    
    auditLog.log(
      userId,
      "document_modification",
      "success",
      {
        userName: userId,
        resourceType: "healthcare_folder",
        details: {
          action: "create_folder",
          folderName: folderName,
          category: activeSubcategory
        }
      }
    );
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleEditPermissions = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsPermissionDialogOpen(true);
    
    auditLog.log(
      userId,
      "document_access",
      "success",
      {
        userName: userId,
        resourceId: document.id,
        resourceType: "healthcare_document_permissions",
        details: {
          action: "view_permissions",
          documentName: document.name
        }
      }
    );
  };

  const handleShareDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  const handleViewDocument = (document: DocumentItem) => {
    auditLog.log(
      userId,
      "document_access",
      "success",
      {
        userName: userId,
        resourceId: document.id,
        resourceType: "healthcare_document",
        details: {
          action: "view",
          documentName: document.name,
          documentType: document.type
        }
      }
    );
    
    toast.info(`Viewing ${document.name}`, {
      description: "Document access has been logged"
    });
  };

  const relevantTags = activeSubcategory === "healthcare" 
    ? healthcareTags 
    : healthcareTags.filter(tag => tag.category === activeSubcategory);

  const activeSubcategoryName = healthcareCategories.find(cat => cat.id === activeSubcategory)?.name || "Healthcare";
  
  const documentAccessLogs = auditLog.getLogs({
    eventType: "document_access", 
    userId: userId
  }).filter(log => log.metadata?.resourceType?.includes("healthcare"));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Healthcare Documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Securely store and share your sensitive health information
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsNewFolderDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileEdit className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="access-logs" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            Access Logs
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <CategoryList
                categories={healthcareCategories}
                activeCategory={activeSubcategory}
                onCategorySelect={setActiveSubcategory}
              />
              
              <Card className="mt-6 bg-[#0a1629] border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">Privacy Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="encryption-filter" 
                      checked={showOnlyEncrypted}
                      onCheckedChange={setShowOnlyEncrypted}
                    />
                    <Label htmlFor="encryption-filter" className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Show only encrypted</span>
                    </Label>
                  </div>
                </CardContent>
              </Card>
              
              {relevantTags.length > 0 && (
                <Card className="mt-6 bg-[#0a1629] border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {relevantTags.map(tag => (
                        <Button
                          key={tag.id}
                          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => toggleTag(tag.id)}
                        >
                          <Tag className="h-3 w-3" />
                          <span className="text-xs">{tag.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-3">
              {filteredDocuments.length > 0 ? (
                <div className="space-y-6">
                  <DocumentsTable 
                    documents={filteredDocuments} 
                    onEditDocument={handleEditPermissions}
                    onShareDocument={handleShareDocument}
                    onViewDocument={handleViewDocument}
                    extraColumns={[
                      {
                        header: "Privacy",
                        cell: (document) => (
                          <div className="flex items-center space-x-1">
                            <TooltipProvider>
                              {document.encrypted && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Lock className="h-4 w-4 text-green-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>Encrypted</TooltipContent>
                                </Tooltip>
                              )}
                              {document.isPrivate && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Eye className="h-4 w-4 text-amber-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>Private</TooltipContent>
                                </Tooltip>
                              )}
                            </TooltipProvider>
                          </div>
                        )
                      },
                      {
                        header: "Shared With",
                        cell: (document) => (
                          <div className="flex items-center space-x-1">
                            {document.permissions && document.permissions.length > 1 ? (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{document.permissions.length - 1}</span>
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Only you</span>
                            )}
                          </div>
                        )
                      }
                    ]}
                  />
                  <p className="text-sm text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 inline mr-1" />
                    All healthcare documents are encrypted and have individual access controls
                  </p>
                </div>
              ) : (
                <NoDocumentsState
                  onUploadClick={() => setIsUploadDialogOpen(true)}
                  categoryName={activeSubcategoryName}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="access-logs">
          <Card className="border border-border/30">
            <CardHeader>
              <CardTitle className="text-lg">Document Access History</CardTitle>
            </CardHeader>
            <CardContent>
              {documentAccessLogs.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {documentAccessLogs.map(log => (
                    <div key={log.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{log.metadata?.details?.action || "Accessed"}: {log.metadata?.details?.documentName}</h4>
                          <p className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>User: {log.userId}</p>
                        {log.metadata?.details?.category && (
                          <p>Category: {log.metadata.details.category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No access logs available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={handleUploadDocument}
        activeCategory={activeSubcategory}
        documentCategories={healthcareCategories}
      />
      
      <NewFolderDialog
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
      
      <ShareDocumentDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={selectedDocument}
      />
      
      <HealthcareDocumentPermissions
        open={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
};
