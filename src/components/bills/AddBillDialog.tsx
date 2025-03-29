
import React from "react";
import { useBills } from "@/hooks/useBills";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bill } from "@/types/bill";
import { toast } from "sonner";
import { BillBasicInfoFields } from "./BillBasicInfoFields";
import { BillPaymentFields } from "./BillPaymentFields";
import { BillRecurrenceFields } from "./BillRecurrenceFields";
import { BillAdditionalFields } from "./BillAdditionalFields";
import { useBillForm } from "@/hooks/useBillForm";

interface AddBillDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBillDialog({ isOpen, onOpenChange }: AddBillDialogProps) {
  const { addBill } = useBills();
  const {
    formData,
    handleChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleStatusChange,
    handlePeriodChange,
    resetForm,
    validateForm
  } = useBillForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create new bill with a random ID
    const newBill: Bill = {
      id: `bill-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      category: formData.category,
      status: formData.status,
      paymentAccount: formData.paymentAccount || undefined,
      recurring: formData.recurring,
      recurringPeriod: formData.recurring ? formData.recurringPeriod : undefined,
      autoPay: formData.autoPay,
      notes: formData.notes || undefined,
      provider: formData.provider || undefined,
    };

    addBill(newBill);
    
    toast.success("Bill added successfully");
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
          <DialogDescription>
            Add a new bill to your bills tracker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <BillBasicInfoFields 
            name={formData.name}
            amount={formData.amount}
            dueDate={formData.dueDate}
            category={formData.category}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
          />
          
          <BillPaymentFields 
            status={formData.status}
            paymentAccount={formData.paymentAccount}
            handleChange={handleChange}
            handleStatusChange={handleStatusChange}
          />
          
          <BillRecurrenceFields 
            recurring={formData.recurring}
            recurringPeriod={formData.recurringPeriod}
            autoPay={formData.autoPay}
            handleCheckboxChange={handleCheckboxChange}
            handlePeriodChange={handlePeriodChange}
          />
          
          <BillAdditionalFields 
            provider={formData.provider}
            notes={formData.notes}
            handleChange={handleChange}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Bill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
