
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { PrescriptionCard } from "./PrescriptionCard";
import { PrescriptionDialog } from "./PrescriptionDialog";
import { Prescription } from "./PrescriptionSchema";

export const PrescriptionManagement: React.FC = () => {
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useLocalStorage<Prescription[]>("healthcare-prescriptions", []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);
  
  const userId = "Tom Brady"; // In a real app, this would come from auth context

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Manage Prescriptions</h3>
        <Button 
          onClick={() => {
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
            <PrescriptionCard 
              key={index}
              prescription={prescription}
              onEdit={handleEditPrescription}
              onDelete={handleDeletePrescription}
            />
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
              setIsEditMode(false);
              setIsPrescriptionDialogOpen(true);
            }}
            className="mx-auto"
          >
            Add Your First Prescription
          </Button>
        </Card>
      )}
      
      <PrescriptionDialog 
        open={isPrescriptionDialogOpen}
        onOpenChange={setIsPrescriptionDialogOpen}
        onSubmit={handleAddPrescription}
        initialData={selectedPrescription}
        isEditMode={isEditMode}
      />

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
    </div>
  );
};
