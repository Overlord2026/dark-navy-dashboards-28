import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { Button } from "@/components/ui/button";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { healthcareCategories } from "@/data/documentCategories";
import { healthcareTags, DocumentItem, DocumentTag, HealthcareAccessLevel, DocumentPermission } from "@/types/document";
import { Upload, FolderPlus, Tag, Lock, Shield, Users, Eye, FileEdit, History, LayoutDashboard, Bell, FileText } from "lucide-react";
import { CategoryList } from "@/components/documents/CategoryList";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HealthcareDashboard } from "./HealthcareDashboard";
import { HealthcareNotifications } from "./HealthcareNotifications";
import { HealthcareTemplates } from "./HealthcareTemplates";
import { DocumentVersionControl } from "./DocumentVersionControl";
import { HealthcareShareDialog } from "./HealthcareShareDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const [healthcareDocuments, setHealthcareDocuments] = useLocalStorage<DocumentItem[]>("healthcare-documents", []);
  
  const userId = "Tom Brady"; // In a real app, this would come from auth context

  // Initialize documents from localStorage if we have them
  useEffect(() => {
    if (healthcareDocuments.length > 0 && documents.length === 0) {
      // Only add them to the main documents array if they're not already there
      healthcareDocuments.forEach(doc => {
        onAddDocument(doc);
      });
    }
  }, [healthcareDocuments, documents, onAddDocument]);
  
  // Filter documents by category and tags
  const filteredDocuments = documents
    .filter(doc => 
      doc.category === activeSubcategory || 
      (activeSubcategory === "healthcare" && healthcareCategories.some(c => c.id === doc.category))
    )
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
    
    // Also save to localStorage
    setHealthcareDocuments([...healthcareDocuments, newDocument]);
    
    setIsUploadDialogOpen(false);
    
    auditLog.log(
      userId,
      "document_creation",
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
      "document_creation",
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

  const handleDocumentShare = (document: DocumentItem, collaboratorIds: string[]) => {
    // In a real app, this would update the document permissions via an API
    // For this demo, we'll just update the local state
    
    // Here we should look up the collaborator details from the IDs
    // This is simplified for the demo
    const collaboratorPermissions: DocumentPermission[] = collaboratorIds.map(id => ({
      userId: id,
      userName: `Collaborator ${id}`, // In a real app, look up the actual name
      accessLevel: "view", // Default access level - real app would have more granular control
      grantedAt: new Date().toISOString(),
      grantedBy: userId
    }));
    
    // Keep the owner's permission
    const ownerPermission = document.permissions?.find(p => p.userId === document.uploadedBy);
    
    // Update the document
    const updatedDocument: DocumentItem = {
      ...document,
      permissions: [
        ...(ownerPermission ? [ownerPermission] : []),
        ...collaboratorPermissions
      ],
      shared: true
    };
    
    // Update documents in state/storage
    const updatedDocuments = documents.map(doc => 
      doc.id === document.id ? updatedDocument : doc
    );
    
    // Update localStorage
    setHealthcareDocuments(
      healthcareDocuments.map(doc => 
        doc.id === document.id ? updatedDocument : doc
      )
    );
    
    // In a real app, this would trigger a re-render with the updated document
    // For this demo, we'll just show a toast
    toast.success(`Document shared with ${collaboratorIds.length} collaborator(s)`, {
      description: "They'll be notified about this document"
    });
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
    
    toast.success(`Viewing ${document.name}`, {
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
  }).filter(log => log.metadata?.resourceType?.includes('healthcare'));

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

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileEdit className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="version-history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            Version History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <HealthcareDashboard documents={documents} />
        </TabsContent>
      
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
                                    <div>
                                      <Lock className="h-4 w-4 text-green-500" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Encrypted</TooltipContent>
                                </Tooltip>
                              )}
                              {document.isPrivate && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Eye className="h-4 w-4 text-amber-500" />
                                    </div>
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
        
        <TabsContent value="reminders">
          <HealthcareNotifications 
            upcomingAppointments={[
              {
                id: "apt1",
                title: "Annual Physical",
                doctor: "Dr. Sarah Smith",
                location: "City Medical Group",
                date: new Date(new Date().setDate(new Date().getDate() + 14)),
                time: "10:00 AM",
                notes: "Fasting required"
              },
              {
                id: "apt2",
                title: "Cardiology Follow-up",
                doctor: "Dr. James Johnson",
                location: "Specialty Care Associates",
                date: new Date(new Date().setDate(new Date().getDate() + 7)),
                time: "2:30 PM",
                notes: "Bring medication list"
              },
              {
                id: "apt3",
                title: "Lab Work",
                doctor: "Metro Health Partners",
                location: "Metro Health Lab",
                date: new Date(new Date().setDate(new Date().getDate() + 3)),
                time: "8:15 AM",
                notes: "Fasting required"
              }
            ]} 
            medications={[
              { 
                id: "med1", 
                name: "Lisinopril", 
                dosage: "20mg", 
                frequency: "Once daily", 
                nextRefill: new Date(new Date().setDate(new Date().getDate() + 7)),
                doctor: "Dr. Smith",
                pharmacy: "CVS Pharmacy"
              },
              { 
                id: "med2", 
                name: "Metformin", 
                dosage: "500mg", 
                frequency: "Twice daily", 
                nextRefill: new Date(new Date().setDate(new Date().getDate() + 14)),
                doctor: "Dr. Johnson",
                pharmacy: "Walgreens"
              },
              { 
                id: "med3", 
                name: "Atorvastatin", 
                dosage: "10mg", 
                frequency: "Once daily", 
                nextRefill: new Date(new Date().setDate(new Date().getDate() + 3)),
                doctor: "Dr. Smith",
                pharmacy: "CVS Pharmacy"
              }
            ]}
            policies={[
              {
                id: "health-policy-1",
                name: "Medicare Supplement Plan F",
                endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString()
              },
              {
                id: "health-policy-2",
                name: "Dental Insurance",
                endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString()
              }
            ]}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <HealthcareTemplates onAddDocument={onAddDocument} />
        </TabsContent>
        
        <TabsContent value="version-history">
          <DocumentVersionControl 
            documents={documents} 
            onViewDocument={handleViewDocument} 
          />
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
      
      <HealthcareShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={selectedDocument}
        onShareComplete={handleDocumentShare}
      />
    </div>
  );
};
