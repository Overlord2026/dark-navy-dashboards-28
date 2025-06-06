import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState, NoCategorySelectedState } from "@/components/documents/EmptyStates";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { EditDocumentDialog } from "@/components/documents/EditDocumentDialog";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload, ExternalLink, ArchiveIcon, HeartPulseIcon, Activity, FileText, Pill, Users, Edit, Trash2, Plus, Calendar, Clock, User } from "lucide-react";
import { documentCategories, healthcareCategories } from "@/data/documentCategories";
import { toast } from "sonner";
import { DocumentType, DocumentItem, DocumentCategory } from "@/types/document";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { HealthcareFolder } from "@/components/healthcare/HealthcareFolder";
import { PrescriptionManager } from "@/components/healthcare/PrescriptionManager";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { useSupabaseDocumentManagement } from "@/hooks/useSupabaseDocumentManagement";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AddPhysicianDialog } from "@/components/healthcare/AddPhysicianDialog";
import { usePhysicians, type PhysicianData } from "@/hooks/usePhysicians";
import { useHealthcare } from "@/hooks/useHealthcare";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, addDays } from 'date-fns';

const importantDocumentCategories = documentCategories.filter(cat => 
  ["documents-to-sign", "bfo-records", "alternative-investments", 
   "business-ownership", "education", "employer-agreements", 
   "leases", "property-ownership", 
   "statements", "taxes", "vehicles"].includes(cat.id)
);

const estateDocumentCategories = documentCategories.filter(cat => 
  ["estate-planning", "trusts", "other"].includes(cat.id)
);

export default function ClientLegacyVault() {
  const {
    documents,
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument,
    refreshDocuments,
    filteredDocuments
  } = useSupabaseDocumentManagement();

  // Replace local physician state with Supabase hook
  const {
    physicians,
    loading: physiciansLoading,
    saving: physiciansSaving,
    addPhysician,
    updatePhysician,
    deletePhysician
  } = usePhysicians();

  const {
    prescriptions,
    loading: prescriptionsLoading,
  } = useHealthcare();

  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [activeTab, setActiveTab] = useState("legacy-box");
  const [healthcareActiveTab, setHealthcareActiveTab] = useState("dashboard");
  
  const [isAddPhysicianDialogOpen, setIsAddPhysicianDialogOpen] = useState(false);
  const [isEditPhysicianDialogOpen, setIsEditPhysicianDialogOpen] = useState(false);
  const [editingPhysician, setEditingPhysician] = useState<any | null>(null);
  
  const legacyBoxDocuments: DocumentItem[] = [
    {
      id: "1",
      name: "Estate Plan",
      type: "folder",
      category: "estate-planning",
      created: new Date().toISOString(),
      size: "—",
    },
    {
      id: "2",
      name: "Insurance Policies",
      type: "folder",
      category: "insurance",
      created: new Date().toISOString(),
      size: "—",
    },
    {
      id: "3",
      name: "Living Trust.pdf",
      type: "pdf",
      category: "estate-planning",
      size: 1200000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Power of Attorney.pdf",
      type: "pdf",
      category: "estate-planning",
      size: 850000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Life Insurance Policy.pdf",
      type: "pdf",
      category: "insurance",
      size: 1500000,
      uploadedBy: "Tom Brady",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
  ];

  const handleAddDocument = (document: DocumentItem) => {
    // This will be handled by the Supabase hook
    refreshDocuments();
  };

  const handleEditDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleSaveDocument = (document: DocumentItem, newName: string) => {
    // Update logic would go here
    toast.success("Document updated successfully");
  };

  const handleShareDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  const handleDeleteDialog = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async (document: DocumentItem) => {
    try {
      await deleteDocument(document.id);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleAddPhysician = async (physicianData: PhysicianData) => {
    const result = await addPhysician(physicianData);
    if (result) {
      setIsAddPhysicianDialogOpen(false);
    }
  };

  const handleEditPhysician = (physician: any) => {
    setEditingPhysician(physician);
    setIsEditPhysicianDialogOpen(true);
  };

  const handleUpdatePhysician = async (updatedPhysicianData: PhysicianData) => {
    if (editingPhysician) {
      const result = await updatePhysician(editingPhysician.id, updatedPhysicianData);
      if (result) {
        setEditingPhysician(null);
        setIsEditPhysicianDialogOpen(false);
      }
    }
  };

  const handleDeletePhysician = async (physicianId: string) => {
    if (window.confirm("Are you sure you want to delete this physician?")) {
      await deletePhysician(physicianId);
    }
  };

  // New handler for category-specific uploads
  const handleUploadForCategory = () => {
    if (!activeCategory) {
      toast.error("Please select a category first");
      return;
    }
    setIsUploadDialogOpen(true);
  };

  // Convert Supabase documents to DocumentItem format for compatibility
  const convertSupabaseDocsToDocumentItems = (supabaseDocs: any[]): DocumentItem[] => {
    return supabaseDocs.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      created: doc.created_at,
      modified: doc.updated_at,
      size: doc.size || 0,
      uploadedBy: doc.uploaded_by || "Unknown",
    }));
  };

  const getRefillStatus = (nextRefillDate: string) => {
    const refillDate = new Date(nextRefillDate);
    const today = new Date();
    const weekFromNow = addDays(today, 7);

    if (isBefore(refillDate, today)) {
      return { status: 'overdue', label: 'Overdue', variant: 'destructive' as const };
    } else if (isBefore(refillDate, weekFromNow)) {
      return { status: 'due-soon', label: 'Due Soon', variant: 'secondary' as const };
    } else {
      return { status: 'good', label: 'Good', variant: 'default' as const };
    }
  };

  // New function to get category-specific content
  const getCategoryContent = (categoryId: string | null) => {
    if (!categoryId) {
      return {
        title: "Select a Category",
        description: "Choose a healthcare category from the left to view and manage related documents"
      };
    }

    const category = healthcareCategories.find(cat => cat.id === categoryId);
    
    switch (categoryId) {
      case "healthcare":
        return {
          title: "Healthcare Documents",
          description: "Store and manage your medical records, prescriptions, and healthcare documents"
        };
      case "insurance-coverage":
        return {
          title: "Insurance Coverage",
          description: "Manage your health insurance policies, coverage details, and claims documentation"
        };
      case "prescriptions":
        return {
          title: "Prescriptions & Medications",
          description: "Keep track of your current medications, prescriptions, and pharmacy information"
        };
      case "physicians":
        return {
          title: "Physicians & Providers",
          description: "Maintain contact information and records for your healthcare providers and specialists"
        };
      case "medical-records":
        return {
          title: "Medical Records & Documents",
          description: "Store important medical records, test results, and healthcare documentation"
        };
      default:
        return {
          title: category?.name || "Healthcare Documents",
          description: "Store and manage documents related to this healthcare category"
        };
    }
  };

  // Restore the original documents list for Healthcare tab - don't filter by Supabase documents
  const documentItems = convertSupabaseDocsToDocumentItems(filteredDocuments);

  return (
    <ThreeColumnLayout activeMainItem="client-legacy-vault">
      <ProfessionalsProvider>
        <div className="container mx-auto p-4 lg:p-6 space-y-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold">Secure Family Vault</h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Store and organize your important documents securely
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => window.open('https://trustandwill.com', '_blank')}
                className="flex items-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors shrink-0 font-medium shadow-lg"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">DIY with Trust & Will</span>
                <span className="sm:hidden">Trust & Will</span>
              </Button>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
              <TabsTrigger value="legacy-box" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <ArchiveIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Family Legacy Box</span>
              </TabsTrigger>
              <TabsTrigger value="healthcare" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
                <HeartPulseIcon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Healthcare</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Legacy Box Tab */}
            <TabsContent value="legacy-box" className="space-y-6">
              <FamilyLegacyBox />
            </TabsContent>

            {/* Healthcare Tab with Sub-tabs */}
            <TabsContent value="healthcare" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulseIcon className="h-5 w-5" />
                    Healthcare Management
                  </CardTitle>
                  <CardDescription>
                    Manage your healthcare documents, prescriptions, and medical information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={healthcareActiveTab} onValueChange={setHealthcareActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="dashboard" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                      </TabsTrigger>
                      <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Prescriptions
                      </TabsTrigger>
                      <TabsTrigger value="physicians" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Physicians & Contacts
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Prescriptions Card */}
                        <Card className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                              <div className="flex items-center gap-2">
                                <Pill className="h-5 w-5 text-blue-600" />
                                Prescriptions
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setHealthcareActiveTab("prescriptions")}
                                className="text-xs"
                              >
                                View All
                              </Button>
                            </CardTitle>
                            <CardDescription>
                              Current medications and detailed information
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {prescriptionsLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                              </div>
                            ) : prescriptions.length === 0 ? (
                              <div className="text-center py-8">
                                <Pill className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-3">No prescriptions added yet</p>
                                <Button
                                  size="sm"
                                  onClick={() => setHealthcareActiveTab("prescriptions")}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Prescription
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm font-medium">
                                  <span>Total Prescriptions: {prescriptions.length}</span>
                                  {prescriptions.filter(p => {
                                    const status = getRefillStatus(p.next_refill);
                                    return status.status === 'overdue' || status.status === 'due-soon';
                                  }).length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {prescriptions.filter(p => {
                                        const status = getRefillStatus(p.next_refill);
                                        return status.status === 'overdue' || status.status === 'due-soon';
                                      }).length} need attention
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Show all prescriptions with full details */}
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {prescriptions.map((prescription) => {
                                    const refillStatus = getRefillStatus(prescription.next_refill);
                                    return (
                                      <div key={prescription.id} className="border rounded-lg p-4 bg-muted/20">
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-base">{prescription.name}</h4>
                                            <p className="text-sm text-muted-foreground font-medium">{prescription.dosage}</p>
                                          </div>
                                          <Badge variant={refillStatus.variant} className="ml-2">
                                            {refillStatus.label}
                                          </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span><strong>Frequency:</strong> {prescription.frequency}</span>
                                          </div>
                                          
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span><strong>Next Refill:</strong> {format(new Date(prescription.next_refill), 'MMM d, yyyy')}</span>
                                          </div>
                                          
                                          {prescription.doctor && (
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                              <span><strong>Doctor:</strong> Dr. {prescription.doctor}</span>
                                            </div>
                                          )}
                                          
                                          {prescription.pharmacy && (
                                            <div className="flex items-center gap-2">
                                              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                              <span><strong>Pharmacy:</strong> {prescription.pharmacy}</span>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {prescription.notes && (
                                          <div className="mt-3 pt-3 border-t border-border/30">
                                            <p className="text-xs text-muted-foreground">
                                              <strong>Notes:</strong> {prescription.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Physicians & Contacts Card */}
                        <Card className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                Physicians & Contacts
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setHealthcareActiveTab("physicians")}
                                className="text-xs"
                              >
                                View All
                              </Button>
                            </CardTitle>
                            <CardDescription>
                              Healthcare providers and contact details
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {physiciansLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                              </div>
                            ) : physicians.length === 0 ? (
                              <div className="text-center py-8">
                                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-3">No physicians added yet</p>
                                <Button
                                  size="sm"
                                  onClick={() => setIsAddPhysicianDialogOpen(true)}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Physician
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm font-medium">
                                  <span>Total Physicians: {physicians.length}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {physicians.filter(p => p.specialty).length} specialists
                                  </Badge>
                                </div>
                                
                                {/* Show all physicians with full details */}
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {physicians.map((physician) => (
                                    <div key={physician.id} className="border rounded-lg p-4 bg-muted/20">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-base">{physician.name}</h4>
                                          <p className="text-sm text-muted-foreground font-medium">
                                            {physician.specialty || 'General Practitioner'}
                                          </p>
                                        </div>
                                        {physician.last_visit && (
                                          <Badge variant="outline" className="text-xs">
                                            Last visit: {format(new Date(physician.last_visit), 'MMM d, yyyy')}
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2 text-sm">
                                        {physician.facility && (
                                          <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span><strong>Facility:</strong> {physician.facility}</span>
                                          </div>
                                        )}
                                        
                                        {physician.phone && (
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span><strong>Phone:</strong> {physician.phone}</span>
                                          </div>
                                        )}
                                        
                                        {physician.email && (
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span><strong>Email:</strong> {physician.email}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {physician.notes && (
                                        <div className="mt-3 pt-3 border-t border-border/30">
                                          <p className="text-xs text-muted-foreground">
                                            <strong>Notes:</strong> {physician.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => setIsNewFolderDialogOpen(true)}
                              variant="outline"
                              size="sm"
                              disabled={!activeCategory}
                            >
                              <FolderPlus className="mr-2 h-4 w-4" />
                              New Folder
                            </Button>
                            <Button 
                              onClick={handleUploadForCategory}
                              size="sm"
                              disabled={!activeCategory}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </Button>
                          </div>
                          {!activeCategory && (
                            <p className="text-sm text-muted-foreground">
                              Select a category to upload documents
                            </p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <CategoryList 
                              categories={healthcareCategories as DocumentCategory[]} 
                              activeCategory={activeCategory || ""} 
                              onCategorySelect={setActiveCategory} 
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <HealthcareFolder 
                              documents={[]} 
                              onAddDocument={handleAddDocument}
                              onCreateFolder={handleCreateFolder}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Prescriptions Tab */}
                    <TabsContent value="prescriptions" className="space-y-6">
                      <PrescriptionManager />
                    </TabsContent>
                    
                    {/* Physicians & Contacts Tab */}
                    <TabsContent value="physicians" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Physicians & Contacts
                          </CardTitle>
                          <CardDescription>
                            Manage your healthcare providers and emergency contacts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {physiciansLoading ? (
                            <div className="text-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                              <p className="mt-2 text-sm text-muted-foreground">Loading physicians...</p>
                            </div>
                          ) : physicians.length === 0 ? (
                            <div className="text-center py-12">
                              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                              <h3 className="mt-4 text-lg font-medium">No Physicians Added</h3>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Add your healthcare providers and emergency contacts to keep them organized.
                              </p>
                              <Button 
                                className="mt-4"
                                onClick={() => setIsAddPhysicianDialogOpen(true)}
                                disabled={physiciansSaving}
                              >
                                Add Physician
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Your Healthcare Providers</h3>
                                <Button 
                                  onClick={() => setIsAddPhysicianDialogOpen(true)}
                                  disabled={physiciansSaving}
                                >
                                  Add Physician
                                </Button>
                              </div>
                              <div className="grid gap-4">
                                {physicians.map((physician) => (
                                  <div key={physician.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="font-medium">{physician.name}</h4>
                                        {physician.specialty && (
                                          <p className="text-sm text-muted-foreground">{physician.specialty}</p>
                                        )}
                                        {physician.facility && (
                                          <p className="text-sm text-muted-foreground">{physician.facility}</p>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditPhysician(physician)}
                                          disabled={physiciansSaving}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeletePhysician(physician.id)}
                                          className="text-destructive hover:text-destructive"
                                          disabled={physiciansSaving}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    {physician.phone && (
                                      <p className="text-sm">Phone: {physician.phone}</p>
                                    )}
                                    {physician.email && (
                                      <p className="text-sm">Email: {physician.email}</p>
                                    )}
                                    {physician.last_visit && (
                                      <p className="text-sm">Last visit: {new Date(physician.last_visit).toLocaleDateString()}</p>
                                    )}
                                    {physician.notes && (
                                      <p className="text-sm mt-2 text-muted-foreground">{physician.notes}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Dialogs */}
        <UploadDocumentDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory || "documents"}
          documentCategories={documentCategories as any}
        />
        
        <NewFolderDialog 
          open={isNewFolderDialogOpen}
          onOpenChange={setIsNewFolderDialogOpen}
          onCreateFolder={handleCreateFolder}
        />

        <EditDocumentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          document={selectedDocument}
          onSave={handleSaveDocument}
        />

        <ShareDocumentDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          document={selectedDocument}
        />

        <DeleteDocumentDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          document={selectedDocument}
          onConfirm={handleDeleteDocument}
        />
        
        {/* Add Physician Dialog */}
        <AddPhysicianDialog
          open={isAddPhysicianDialogOpen}
          onOpenChange={setIsAddPhysicianDialogOpen}
          onAddPhysician={handleAddPhysician}
        />

        {/* Edit Physician Dialog */}
        <AddPhysicianDialog
          open={isEditPhysicianDialogOpen}
          onOpenChange={setIsEditPhysicianDialogOpen}
          onAddPhysician={handleUpdatePhysician}
          initialData={editingPhysician}
          isEdit={true}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
