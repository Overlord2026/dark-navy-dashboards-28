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
import { Upload, FolderPlus, Tag, Lock, Shield, Users, Eye, FileEdit, History, LayoutDashboard, Bell, FileText, ArrowLeft, Pill, Trash2, Edit } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface HealthcareFolderProps {
  documents: DocumentItem[];
  onAddDocument: (document: DocumentItem) => void;
  onCreateFolder: (folderName: string, category: string) => void;
}

const prescriptionSchema = z.object({
  name: z.string().min(2, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  nextRefill: z.string().min(1, { message: "Next refill date is required" }),
  doctor: z.string().optional(),
  pharmacy: z.string().optional(),
  notes: z.string().optional(),
});

export type Prescription = z.infer<typeof prescriptionSchema>;

export const HealthcareFolder: React.FC<HealthcareFolderProps> = ({
  documents,
  onAddDocument,
  onCreateFolder
}) => {
  const navigate = useNavigate();
  const [activeSubcategory, setActiveSubcategory] = useState<string>("healthcare");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showOnlyEncrypted, setShowOnlyEncrypted] = useState(false);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [healthcareDocuments, setHealthcareDocuments] = useLocalStorage<DocumentItem[]>("healthcare-documents", []);
  const [prescriptions, setPrescriptions] = useLocalStorage<Prescription[]>("healthcare-prescriptions", []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);
  
  const userId = "Tom Brady";

  const form = useForm<Prescription>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      nextRefill: new Date().toISOString().split('T')[0],
      doctor: "",
      pharmacy: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (healthcareDocuments.length > 0 && documents.length === 0) {
      healthcareDocuments.forEach(doc => {
        onAddDocument(doc);
      });
    }
  }, [healthcareDocuments, documents, onAddDocument]);

  useEffect(() => {
    if (selectedPrescription && isEditMode) {
      form.reset({
        ...selectedPrescription,
        nextRefill: typeof selectedPrescription.nextRefill === 'string' 
          ? selectedPrescription.nextRefill.split('T')[0] 
          : new Date(selectedPrescription.nextRefill).toISOString().split('T')[0],
      });
    }
  }, [selectedPrescription, isEditMode, form]);
  
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
    const collaboratorPermissions: DocumentPermission[] = collaboratorIds.map(id => ({
      userId: id,
      userName: `Collaborator ${id}`,
      accessLevel: "view",
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

  const handleAddPrescription = (data: Prescription) => {
    if (isEditMode && selectedPrescription) {
      const updatedPrescriptions = prescriptions.map(prescription => 
        prescription.name === selectedPrescription.name ? data : prescription
      );
      setPrescriptions(updatedPrescriptions);
      toast.success("Prescription updated successfully");
    } else {
      setPrescriptions([...prescriptions, data]);
      toast.success("Prescription added successfully");
    }
    
    form.reset();
    setIsPrescriptionDialogOpen(false);
    setIsEditMode(false);
    setSelectedPrescription(null);
    
    auditLog.log(
      userId,
      isEditMode ? "prescription_update" : "prescription_add",
      "success",
      {
        userName: userId,
        details: {
          action: isEditMode ? "update_prescription" : "add_prescription",
          prescriptionName: data.name,
        }
      }
    );
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsEditMode(true);
    setIsPrescriptionDialogOpen(true);
  };

  const handleDeletePrescription = (prescription: Prescription) => {
    setPrescriptionToDelete(prescription);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeletePrescription = () => {
    if (prescriptionToDelete) {
      const updatedPrescriptions = prescriptions.filter(p => p.name !== prescriptionToDelete.name);
      setPrescriptions(updatedPrescriptions);
      
      auditLog.log(
        userId,
        "prescription_delete",
        "success",
        {
          userName: userId,
          details: {
            action: "delete_prescription",
            prescriptionName: prescriptionToDelete.name,
          }
        }
      );
      
      toast.success("Prescription deleted successfully");
    }
    setIsDeleteAlertOpen(false);
    setPrescriptionToDelete(null);
  };

  const handleNavigateBack = () => {
    navigate('/legacy-vault');
  };

  const relevantTags = activeSubcategory === "healthcare" 
    ? healthcareTags 
    : healthcareTags.filter(tag => tag.category === activeSubcategory);

  const activeSubcategoryName = healthcareCategories.find(cat => cat.id === activeSubcategory)?.name || "Healthcare";
  
  const documentAccessLogs = auditLog.getLogs({
    eventType: "document_access", 
    userId: userId
  }).filter(log => log.metadata?.resourceType?.includes('healthcare'));

  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    
    try {
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  const getDaysRemaining = (date: string | Date): number => {
    if (!date) return 0;
    
    try {
      const targetDate = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      const targetWithoutTime = new Date(targetDate);
      targetWithoutTime.setHours(0, 0, 0, 0);
      
      const diffTime = targetWithoutTime.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };

  const getUrgencyColor = (days: number): string => {
    if (days < 0) return "text-red-500";
    if (days < 3) return "text-amber-500";
    if (days < 7) return "text-yellow-500";
    return "text-green-500";
  };

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
                    onDownloadDocument={handleViewDocument}
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

        <TabsContent value="prescriptions">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Manage Prescriptions</h3>
              <Button 
                onClick={() => {
                  form.reset();
                  setIsEditMode(false);
                  setSelectedPrescription(null);
                  setIsPrescriptionDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                Add Prescription
              </Button>
            </div>

            {prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescriptions.map((prescription, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prescription.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditPrescription(prescription)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePrescription(prescription)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Label className="w-24 font-medium">Frequency:</Label>
                          <span>{prescription.frequency}</span>
                        </div>
                        <div className="flex items-center">
                          <Label className="w-24 font-medium">Next Refill:</Label>
                          <span className={getUrgencyColor(getDaysRemaining(prescription.nextRefill))}>
                            {formatDate(prescription.nextRefill)} ({getDaysRemaining(prescription.nextRefill) < 0 
                              ? `${Math.abs(getDaysRemaining(prescription.nextRefill))} days ago` 
                              : getDaysRemaining(prescription.nextRefill) === 0 
                                ? "Today" 
                                : `in ${getDaysRemaining(prescription.nextRefill)} days`})
                          </span>
                        </div>
                        {prescription.doctor && (
                          <div className="flex items-center">
                            <Label className="w-24 font-medium">Doctor:</Label>
                            <span>{prescription.doctor}</span>
                          </div>
                        )}
                        {prescription.pharmacy && (
                          <div className="flex items-center">
                            <Label className="w-24 font-medium">Pharmacy:</Label>
                            <span>{prescription.pharmacy}</span>
                          </div>
                        )}
                        {prescription.notes && (
                          <div className="mt-2">
                            <Label className="font-medium">Notes:</Label>
                            <p className="text-muted-foreground">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Prescriptions Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add your medication prescriptions to keep track of refills and important information.
                </p>
                <Button 
                  onClick={() => {
                    form.reset();
                    setIsPrescriptionDialogOpen(true);
                  }}
                  className="mx-auto"
                >
                  Add Your First Prescription
                </Button>
              </Card>
            )}
          </div>
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
      </Tabs>

      <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Prescription' : 'Add New Prescription'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the prescription details below."
                : "Enter the details about your medication prescription."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPrescription)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Lisinopril" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 20mg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Once daily" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="nextRefill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Refill Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescribing Doctor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Dr. Smith" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pharmacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., CVS Pharmacy" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Additional information" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{isEditMode ? 'Update Prescription' : 'Add Prescription'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the prescription "{prescriptionToDelete?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={confirmDeletePrescription}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
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
