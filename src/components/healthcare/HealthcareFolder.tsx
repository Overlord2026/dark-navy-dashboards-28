
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { DocumentItem } from "@/types/document";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { HealthcareShareDialog } from "./HealthcareShareDialog";
import { auditLog } from "@/services/auditLog/auditLogService";
import { toast } from "sonner";
import { LayoutDashboard, FileEdit, Pill, Bell, FileText, History } from "lucide-react";
import { HealthcareDashboard } from "./HealthcareDashboard";
import HealthcareNotifications from "./HealthcareNotifications";
import { HealthcareTemplates } from "./HealthcareTemplates";
import { DocumentVersionControl } from "./DocumentVersionControl";
import { HealthcareDocumentsHeader } from "./documents/HealthcareDocumentsHeader";
import { DocumentsTabContent } from "./documents/DocumentsTabContent";
import { PrescriptionManagement } from "./prescriptions/PrescriptionManagement";
import { Prescription } from "./prescriptions/PrescriptionSchema";

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
  const navigate = useNavigate();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string>("healthcare");
  const [healthcareDocuments, setHealthcareDocuments] = useLocalStorage<DocumentItem[]>("healthcare-documents", []);
  const [prescriptions, setPrescriptions] = useLocalStorage<Prescription[]>("healthcare-prescriptions", []);
  
  const userId = "Tom Brady";

  // Handle document upload
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

  // Handle folder creation
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

  // Handle document permissions
  const handleEditPermissions = (document: DocumentItem) => {
    setSelectedDocument(document);
    
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

  // Handle document sharing
  const handleShareDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  // Handle document share completion
  const handleDocumentShare = (document: DocumentItem, collaboratorIds: string[]) => {
    const collaboratorPermissions = collaboratorIds.map(id => ({
      userId: id,
      userName: `Collaborator ${id}`,
      accessLevel: "view" as const,
      grantedAt: new Date().toISOString(),
      grantedBy: userId
    }));
    
    const ownerPermission = document.permissions?.find(p => p.userId === document.uploadedBy);
    
    const updatedDocument: DocumentItem = {
      ...document,
      permissions: [
        ...(ownerPermission ? [ownerPermission] : []),
        ...collaboratorPermissions
      ],
      shared: true
    };
    
    setHealthcareDocuments(
      healthcareDocuments.map(doc => 
        doc.id === document.id ? updatedDocument : doc
      )
    );
    
    toast.success(`Document shared with ${collaboratorIds.length} collaborator(s)`, {
      description: "They'll be notified about this document"
    });
  };

  // Handle document view
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

  const handleNavigateBack = () => {
    navigate('/legacy-vault');
  };

  return (
    <div className="space-y-6">
      <HealthcareDocumentsHeader 
        onNavigateBack={handleNavigateBack}
        onNewFolderClick={() => setIsNewFolderDialogOpen(true)}
        onUploadClick={() => setIsUploadDialogOpen(true)}
      />

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
          <TabsTrigger value="prescriptions" className="flex items-center gap-1">
            <Pill className="h-4 w-4" />
            Prescriptions
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
          <DocumentsTabContent
            documents={documents}
            onEditPermissions={handleEditPermissions}
            onShareDocument={handleShareDocument}
            onViewDocument={handleViewDocument}
            onUploadClick={() => setIsUploadDialogOpen(true)}
            onCreateFolderClick={() => setIsNewFolderDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="prescriptions">
          <PrescriptionManagement />
        </TabsContent>
        
        <TabsContent value="reminders">
          <HealthcareNotifications 
            upcomingAppointments={[
              {
                id: "apt1",
                title: "Annual Physical",
                doctor: "Dr. Sarah Smith",
                date: new Date(new Date().setDate(new Date().getDate() + 14)),
                time: "10:00 AM",
                notes: "Fasting required",
                location: "City Medical Group"
              },
              {
                id: "apt2",
                title: "Cardiology Follow-up",
                doctor: "Dr. James Johnson",
                date: new Date(new Date().setDate(new Date().getDate() + 7)),
                time: "2:30 PM",
                notes: "Bring medication list",
                location: "Specialty Care Associates"
              },
              {
                id: "apt3",
                title: "Lab Work",
                doctor: "Metro Health Partners",
                date: new Date(new Date().setDate(new Date().getDate() + 3)),
                time: "8:15 AM",
                notes: "Fasting required",
                location: "Metro Health Lab"
              }
            ]}
            medications={prescriptions.map(p => ({
              id: p.name,
              name: p.name,
              nextRefill: p.nextRefill,
              dosage: p.dosage,
              frequency: p.frequency,
              doctor: p.doctor,
              pharmacy: p.pharmacy
            }))}
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
        onClose={() => setIsUploadDialogOpen(false)}
        onFileUpload={handleUploadDocument}
        activeCategory={activeSubcategory}
        documentCategories={[]}
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
