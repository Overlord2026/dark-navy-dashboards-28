
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prescription, prescriptionSchema } from "./PrescriptionSchema";

interface PrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Prescription) => void;
  initialData?: Prescription | null;
  isEditMode: boolean;
}

export const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode
}) => {
  const form = useForm<Prescription>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: initialData || {
      name: "",
      dosage: "",
      frequency: "",
      nextRefill: new Date().toISOString().split('T')[0],
      doctor: "",
      pharmacy: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        ...initialData,
        nextRefill: typeof initialData.nextRefill === 'string' 
          ? initialData.nextRefill.split('T')[0] 
          : new Date(initialData.nextRefill).toISOString().split('T')[0],
      });
    }
  }, [initialData, isEditMode, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};
